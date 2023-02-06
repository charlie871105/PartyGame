import { Vector3, PhysicsImpostor, Animation, Mesh } from '@babylonjs/core';
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useScene } from 'react-babylonjs';

function Ice() {
  const iceRef = createRef<Mesh>();
  const scene = useScene();

  const frameRate = 10;

  const meltingAnimation = useMemo(() => {
    const melting = new Animation(
      'melting',
      'scaling',
      frameRate / 50,
      Animation.ANIMATIONTYPE_VECTOR3
    );
    const keyFrames = [
      {
        frame: 0,
        value: new Vector3(1, 1, 1),
      },
      {
        frame: frameRate,
        value: new Vector3(0.1, 1, 0.1),
      },
    ];
    melting.setKeys(keyFrames);
    return melting;
  }, []);

  const updateIcePhysicsImpostor = useCallback(() => {
    iceRef.current?.physicsImpostor?.setScalingUpdated();
  }, [iceRef]);

  useEffect(() => {
    iceRef.current?.animations.push(meltingAnimation);

    scene?.beginAnimation(iceRef.current, 0, frameRate);

    // 更新物理碰撞尺寸
    scene?.registerBeforeRender(updateIcePhysicsImpostor);
    return () => {
      scene?.unregisterBeforeRender(updateIcePhysicsImpostor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <box
      ref={iceRef}
      name="ice"
      width={30}
      depth={30}
      height={4}
      position={new Vector3(0, 1, 0)}
      rotation={Vector3.Zero()}
    >
      <standardMaterial name="iceMaterial" />
      <physicsImpostor
        type={PhysicsImpostor.BoxImpostor}
        _options={{ mass: 0, friction: 0, restitution: 0 }}
      />
    </box>
  );
}

export default Ice;
