import {
  AnimationGroup,
  Color3,
  MeshBuilder,
  Vector3,
  PhysicsImpostor,
  StandardMaterial,
  Animation,
  ActionManager,
  InterpolateValueAction,
  Mesh,
} from '@babylonjs/core';
import { debounce, throttle } from 'lodash-es';
import React, {
  forwardRef,
  MutableRefObject,
  Suspense,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Model, useScene } from 'react-babylonjs';

export interface PenguinController {
  walk: (force: Vector3) => void;
  attack: () => void;
  assaulted: (direction: Vector3) => void;
  mesh: MutableRefObject<Mesh | null>;
  state: React.MutableRefObject<State>;
}

interface AnimationMap {
  idle?: AnimationGroup;
  walk?: AnimationGroup;
  attack?: AnimationGroup;
}

type State = 'idle' | 'walk' | 'attack';

export interface PenguinParams {
  /** 起始位置 */
  position?: Vector3;
  color?: Color3;
  ownerId: string;
}
export interface PenguinProps {
  name: string;
  params?: Required<PenguinParams>;
}

const Penguin = forwardRef(
  (
    {
      name,
      params = {
        position: new Vector3(0, 10, 0),
        color: new Color3(0.9, 0.9, 0.9),
        ownerId: '',
      },
    }: PenguinProps,
    ref
  ) => {
    const scene = useScene();

    const maxVelocity = useRef(new Vector3(6, 6, 6));
    const assaultedForce = useRef(new Vector3(20, 20, 20));
    const mesh = useRef<Mesh | null>(null);
    const state = useRef<State>('idle');

    const animation = useRef<AnimationMap>({
      idle: undefined,
      walk: undefined,
      attack: undefined,
    });

    /** 負責人物轉向動畫 */
    const rotateAction = useRef<InterpolateValueAction | null>(null);

    function createHitBox() {
      if (!scene) throw new Error('尚未建立 場景');

      const hitBox = MeshBuilder.CreateBox(`${name}-hit-box`, {
        width: 2,
        depth: 2,
        height: 4,
      });
      hitBox.position = params.position;
      hitBox.visibility = 0;
      // 初始化 mesh
      mesh.current = hitBox;
      /** 使用物理效果 */
      const hitBoxImpostor = new PhysicsImpostor(
        hitBox,
        PhysicsImpostor.BoxImpostor,
        { mass: 1, friction: 0.7, restitution: 0.7 },
        scene
      );

      hitBox.physicsImpostor = hitBoxImpostor;
      return hitBox;
    }

    function createBadge() {
      if (!scene) throw new Error('尚未建立 場景');

      const badge = MeshBuilder.CreateBox(`${name}-badge`, {
        width: 0.5,
        depth: 0.5,
        height: 0.5,
      });
      const material = new StandardMaterial('badgeMaterial', scene);
      material.diffuseColor = params.color;
      badge.material = material;

      const deg = Math.PI / 4;
      badge.rotation = new Vector3(deg, 0, deg);
      badge.visibility = 0.9;

      // 建立動畫
      const frameRate = 10;
      const badgeRotate = new Animation(
        'badgeRotate',
        'rotation.y',
        frameRate / 5,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
      );

      const keyFrames = [
        {
          frame: 0,
          value: 0,
        },
        {
          frame: frameRate,
          value: 2 * Math.PI,
        },
      ];

      badgeRotate.setKeys(keyFrames);
      badge.animations.push(badgeRotate);

      scene.beginAnimation(badge, 0, frameRate, true);

      return badge;
    }

    function initAnimation(animationGroups?: AnimationGroup[]) {
      animationGroups?.forEach((animationGroup) => {
        animationGroup.stop();
      });

      const attackAni = animationGroups?.find((ani) => ani.name === 'attack');
      const walkAni = animationGroups?.find((ani) => ani.name === 'walk');
      const idleAni = animationGroups?.find((ani) => ani.name === 'idle');

      animation.current.attack = attackAni;
      animation.current.walk = walkAni;
      animation.current.idle = idleAni;
    }

    function initActionManager() {
      if (!scene) throw new Error('尚未建立 場景');
      const penguin = scene.getMeshByName(`${name}-hit-box`);
      if (!penguin) throw new Error('尚未建立 企鵝');

      penguin.actionManager = new ActionManager(scene);

      rotateAction.current = new InterpolateValueAction(
        ActionManager.NothingTrigger,
        penguin,
        'rotation',
        new Vector3(0, 3, 0),
        300
      );
      penguin.actionManager.registerAction(rotateAction.current);
    }

    const limitMaxVelocity = useCallback(() => {
      if (!scene) throw new Error('尚未建立 場景');

      const penguin = scene.getMeshByName(`${name}-hit-box`);

      if (!penguin) throw new Error('尚未建立 企鵝');

      const velocity = penguin.physicsImpostor?.getLinearVelocity();
      if (!velocity) throw new Error('當前速度取得錯誤');

      const currentSpeed = velocity.length();
      if (currentSpeed > maxVelocity.current.length()) {
        const newVelocity = velocity.normalize().multiply(maxVelocity.current);
        penguin.physicsImpostor?.setLinearVelocity(newVelocity);
      }
    }, [name, scene]);

    const getForceAngle = useCallback(
      (force: Vector3) => {
        if (!scene) throw new Error('尚未建立 場景');
        const penguin = scene.getMeshByName(`${name}-hit-box`);

        if (!penguin) throw new Error('尚未建立 企鵝');

        const forceVector = force.normalize();
        /** 企鵝面相正 Z 軸方向 */
        const characterVector = new Vector3(0, 0, 1);
        const deltaAngle = Math.acos(Vector3.Dot(forceVector, characterVector));

        /** 反餘弦求得角度範圍為 0~180 度，需要自行判斷負角度部分。
         *  力向量 X 軸分量為負時，表示夾角為負。
         */
        if (forceVector.x < 0) {
          return deltaAngle * -1;
        }

        return deltaAngle;
      },
      [name, scene]
    );

    const getAnimationByState = useCallback((value: State) => {
      return animation.current[value];
    }, []);

    /** 處理狀態動畫 */
    const processStateAnimation = useCallback(
      (newState: State) => {
        if (newState === state.current) return;

        const playingAni = getAnimationByState(state.current);
        const targetAni = getAnimationByState(newState);

        state.current = newState;
        if (!targetAni || !playingAni) return;

        /** 攻擊動畫不循環播放 */
        const loop = state.current !== 'attack';
        /** 切換至攻擊動畫速度要快一點 */
        const offset = state.current === 'attack' ? 0.3 : undefined;

        scene?.onBeforeRenderObservable.runCoroutineAsync(
          animationBlending(playingAni, targetAni, loop, offset)
        );
      },
      [getAnimationByState, scene?.onBeforeRenderObservable]
    );

    const setState = useCallback(
      (value: State) => {
        processStateAnimation(value);
        state.current = value;
      },
      [processStateAnimation]
    );

    const setIdleStateDebounce = useMemo(
      () =>
        debounce(async () => {
          setState('idle');
        }, 500),
      [setState]
    );

    /** 動畫混合 */
    function* animationBlending(
      fromAni: AnimationGroup,
      toAni: AnimationGroup,
      loop = true,
      offset = 0.1
    ) {
      let currentWeight = 1;
      let targetWeight = 0;

      toAni.play(loop);

      while (targetWeight < 1) {
        targetWeight += offset;
        currentWeight -= offset;

        toAni.setWeightForAllAnimatables(targetWeight);
        fromAni.setWeightForAllAnimatables(currentWeight);
        yield;
      }

      fromAni.stop();
    }

    /** 指定移動方向與力量 */
    const walk = useCallback(
      (force: Vector3) => {
        if (!scene) throw new Error('尚未建立 場景');

        const penguin = scene.getMeshByName(`${name}-hit-box`);

        if (!penguin) throw new Error('尚未建立 企鵝');

        // 受力
        penguin.physicsImpostor?.applyImpulse(force, Vector3.Zero());

        // 轉向
        const targetAngle = getForceAngle(force);
        const currentAngle = penguin.rotation.y;

        /** 若角度超過 180 度，則先直接切換至兩倍補角處，讓轉向更自然 */
        if (Math.abs(targetAngle - currentAngle) > Math.PI) {
          const supplementaryAngle = Math.PI * 2 - Math.abs(currentAngle);
          if (currentAngle < 0) {
            penguin.rotation = new Vector3(0, supplementaryAngle, 0);
          } else {
            penguin.rotation = new Vector3(0, -supplementaryAngle, 0);
          }
        }

        if (rotateAction.current) {
          rotateAction.current.value = new Vector3(0, targetAngle, 0);
          rotateAction.current.execute();

          /** 播放走路動畫 */
          animation.current.walk?.start(true);
          setState('walk');
          /** 在停止走路後，過 500ms 時切換為 idle 狀態 */
          setIdleStateDebounce();
        }
      },
      [getForceAngle, name, scene, setIdleStateDebounce, setState]
    );

    /** 攻擊結束後 1 秒時，回到 idle 狀態 */
    const leaveAttackStateDebounce = useMemo(
      () =>
        debounce(
          () => {
            setState('idle');
          },
          1000,
          {
            leading: false,
            trailing: true,
          }
        ),
      [setState]
    );
    /** 攻擊，限制攻擊頻率，2 秒一次 */
    const attack = useMemo(
      () =>
        throttle(
          () => {
            setState('attack');
            leaveAttackStateDebounce();
            setIdleStateDebounce.cancel();
          },
          2000,
          {
            leading: true,
            trailing: false,
          }
        ),
      [leaveAttackStateDebounce, setIdleStateDebounce, setState]
    );

    const assaulted = useMemo(
      () =>
        throttle(
          (direction: Vector3) => {
            if (!scene) throw new Error('尚未建立 場景');

            const penguin = scene.getMeshByName(`${name}-hit-box`);

            if (!penguin) throw new Error('尚未建立 企鵝');

            // 計算力量
            const force = direction
              .normalize()
              .multiply(assaultedForce.current);

            penguin.physicsImpostor?.applyImpulse(force, Vector3.Zero());
          },
          500,
          {
            leading: true,
            trailing: false,
          }
        ),
      [name, scene]
    );

    useImperativeHandle(
      ref,
      (): PenguinController => ({
        walk,
        attack,
        assaulted,
        mesh,
        state,
      })
    );

    return (
      <Suspense fallback={<box name="fallback" />}>
        <Model
          position={params.position}
          name={name}
          rootUrl="/games/"
          sceneFilename={`penguin.glb?id=${name}`}
          onModelLoaded={(model) => {
            // init Animation
            initAnimation(model.animationGroups);

            // init penguin
            const penguin = model.meshes?.[0];
            if (!penguin) return;
            penguin.position = new Vector3(0, -2, 0);

            // create hitbox
            const hitbox = createHitBox();
            penguin.setParent(hitbox);
            // create badge
            const badge = createBadge();
            badge.setParent(hitbox);
            badge.position = new Vector3(0, 3, 0);

            // init ActionManager
            initActionManager();

            scene?.registerBeforeRender(() => {
              limitMaxVelocity();
            });
          }}
        />
      </Suspense>
    );
  }
);

export default Penguin;
