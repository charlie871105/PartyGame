import React, { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { Engine, HemisphericLight, Scene } from 'react-babylonjs';
import {
  CannonJSPlugin,
  Color3,
  PhysicsImpostor,
  Vector3,
} from '@babylonjs/core';
import * as CANNON from 'cannon-es';
import useLoading from '../../hooks/useLoading';
import '@babylonjs/loaders';
import Penguin, { PenguinController, PenguinProps } from './Penguin';
import Controller from './Controller';

type PenguinModel = PenguinProps & {
  ref: MutableRefObject<PenguinController | null>;
};
function PenguinGame() {
  const { stopLoading } = useLoading();

  const penguinModels: PenguinModel[] = [
    { name: 'first_penguins', ref: useRef(null) },
    {
      name: 'second_penguins',
      params: {
        position: new Vector3(5, 10, 0),
        color: new Color3(3, 3, 0),
        ownerId: '',
      },
      ref: useRef(null),
    },
  ];
  console.log(penguinModels);

  const penguinControllers = penguinModels.map((penguin) => penguin.ref);

  // 偵測企鵝碰撞事件
  const detectCollideEvents = useCallback(
    (penguins: MutableRefObject<PenguinController | null>[]) => {
      const length = penguins.length;
      for (let i = 0; i < length; i++) {
        for (let j = i; j < length; j++) {
          if (i === j) continue;

          const aMesh = penguins[i]?.current?.mesh.current;
          const bMesh = penguins[i]?.current?.mesh.current;
          if (!aMesh || !bMesh) continue;

          if (aMesh.intersectsMesh(bMesh)) {
            handleCollideEvent(penguins[i].current, penguins[j].current);
          }
        }
      }
    },
    []
  );

  function handleCollideEvent(
    aPenguin: PenguinController | null,
    bPenguin: PenguinController | null
  ) {
    if (!aPenguin?.mesh.current || !bPenguin?.mesh.current) return;

    const aState = aPenguin.state.current;
    const bState = bPenguin.state.current;

    // 沒有企鵝在 attack 狀態，不須動作
    if (![aState, bState].includes('attack')) return;

    const direction = bPenguin.mesh.current.position.subtract(
      aPenguin.mesh.current.position
    );
    if (aState === 'attack') {
      bPenguin.assaulted(direction);
    } else {
      aPenguin.assaulted(direction.multiply(new Vector3(-1, -1, -1)));
    }
  }

  const keyboardEvent = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft': {
        penguinModels[0].ref.current?.walk(new Vector3(-1, 0, 0));
        break;
      }
      case 'ArrowUp': {
        penguinModels[0].ref.current?.walk(new Vector3(0, 0, 1));
        break;
      }
      case 'ArrowRight': {
        penguinModels[0].ref.current?.walk(new Vector3(1, 0, 0));
        break;
      }
      case 'ArrowDown': {
        penguinModels[0].ref.current?.walk(new Vector3(0, 0, -1));
        break;
      }
      case ' ': {
        penguinModels[0].ref.current?.attack();
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    stopLoading();
  }, [stopLoading]);

  return (
    <Engine
      antialias
      adaptToDeviceRatio
      canvasId="babylonJS"
      renderOptions={{
        whenVisibleOnly: true,
      }}
    >
      <Scene
        onSceneMount={() => {
          document.addEventListener('keydown', keyboardEvent);
        }}
        enablePhysics={[
          new Vector3(0, -9.81, 0),
          new CannonJSPlugin(true, 8, CANNON),
        ]}
      >
        <arcRotateCamera
          name="camera"
          target={new Vector3(0, 0, -2)}
          alpha={-Math.PI / 2}
          beta={Math.PI / 4}
          radius={34}
        />
        <HemisphericLight />
        <ground name="sea" width={1000} height={1000}>
          <backgroundMaterial
            name="seaMaterial"
            primaryColor={new Color3(0.57, 0.7, 0.83)}
            useRGBColor={false}
          >
            <box
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
            {penguinModels.map((penguin) => (
              <Penguin
                key={penguin.name}
                ref={penguin.ref}
                name={penguin.name}
                params={penguin.params}
              />
            ))}
            <Controller
              register={() => detectCollideEvents(penguinControllers)}
            />
          </backgroundMaterial>
        </ground>
      </Scene>
    </Engine>
  );
}

export default PenguinGame;
