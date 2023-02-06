import React, {
  createRef,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { Engine, HemisphericLight, Scene } from 'react-babylonjs';
import { CannonJSPlugin, Color3, Vector3 } from '@babylonjs/core';
import * as CANNON from 'cannon-es';
import { curry, find } from 'lodash-es';
import { useSelector } from 'react-redux';
import { colord } from 'colord';
import useLoading from '../../hooks/useLoading';
import '@babylonjs/loaders';
import Penguin, { PenguinController, PenguinProps } from './Penguin';
import Controller from './Controller';
import { SocketContext } from '../../context/SocketContext';
import { GamepadData, KeyName, SingleData } from '../../types/game.type';
import { ReduxState } from '../../redux/store';
import useGameConsole from '../../hooks/useGameConsole';
import { getPlayerColor } from '../../common/utils';
import { penguinInitPositions } from './penguinUtils';
import Ice from './Ice';
import SceneBackground from './SceneBackground';

type PenguinModel = PenguinProps & {
  ref: MutableRefObject<PenguinController | null>;
};
function PenguinGame() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('Unknow Context');
  }
  const { client } = context;

  const { stopLoading } = useLoading();
  const { getPlayerCodeName } = useGameConsole();
  const playerList = useSelector(
    (state: ReduxState) => state.gameConsoleReducer.players
  );

  const penguinModels: PenguinModel[] = playerList.map((player, i) => ({
    name: `penguin-${i}`,
    params: {
      position: getPenguinPosition(i),
      color: getPenguinColor(player.clientId),
      ownerId: player.clientId,
    },
    ref: createRef(),
  }));

  const penguinControllers = penguinModels.map((penguin) => penguin.ref);

  /** 依照玩家ID 取得對應顏色 */
  function getPenguinColor(id: string) {
    const codeName = getPlayerCodeName(id);
    const color = getPlayerColor({ codeName });
    const rgb = colord(color).toRgb();
    return new Color3(rgb.r / 255, rgb.g / 255, rgb.b / 255);
  }

  /** 依照玩家ID 取得對應初始位置 */
  function getPenguinPosition(index: number) {
    const len = penguinInitPositions.length;
    const position = penguinInitPositions[index % len];
    position._y = Math.round(index / len) * 10 + 5;
    return position;
  }

  /** 偵測企鵝碰撞事件 */
  const detectCollideEvents = useCallback(
    (penguins: MutableRefObject<PenguinController | null>[]) => {
      const length = penguins.length;
      for (let i = 0; i < length; i++) {
        for (let j = i; j < length; j++) {
          if (i === j) continue;

          const aPenguin = penguins[i].current;
          const bPenguin = penguins[j].current;
          if (!aPenguin || !bPenguin) continue;

          const aMesh = aPenguin?.mesh.current;
          const bMesh = bPenguin?.mesh.current;
          if (!aMesh || !bMesh) continue;

          if (aMesh.intersectsMesh(bMesh)) {
            handleCollideEvent(aPenguin, bPenguin);
          }
        }
      }
    },
    []
  );

  function handleCollideEvent(
    aPenguin: PenguinController,
    bPenguin: PenguinController
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

  /** 根據key取得資料 */
  const findSingleData = curry((keys: SingleData[], name: `${KeyName}`) =>
    keys.find((key) => key.name === name)
  );

  /** 控制制定企鵝 */
  const controlPenguin = useCallback(
    (penguin: PenguinController, data: GamepadData) => {
      const { keys } = data;
      const findData = findSingleData(keys);

      // 攻擊
      const attackData = findData('attack');
      if (attackData) {
        console.log(penguin);
        penguin?.attack();
        return;
      }

      const xData = findData('x-axis');
      const yData = findData('y-axis');

      const x = xData?.value ?? 0;
      const y = yData?.value ?? 0;

      if (x === 0 && y === 0) return;
      if (typeof x === 'number' && typeof y === 'number') {
        penguin?.walk(new Vector3(x, 0, y));
      }
    },
    [findSingleData]
  );

  useEffect(() => {
    stopLoading();
  }, [stopLoading]);

  const updateGameData = useCallback(
    (data: GamepadData) => {
      console.log('[ gameConsole.onGamepadData ] data : ', data);
      const { playerId } = data;

      const targetPenguinModel = penguinModels.find(
        (penguinModel) => penguinModel.params?.ownerId === playerId
      );
      const penguin = targetPenguinModel?.ref.current;

      if (!penguin) return;
      controlPenguin(penguin, data);
    },
    [controlPenguin, penguinModels]
  );

  useEffect(() => {
    client?.on('player:gamepad-data', updateGameData);

    return () => {
      client?.removeListener('player:gamepad-data', updateGameData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <SceneBackground>
          <Ice />
          {/* create penguin */}
          {penguinModels.map((penguin) => (
            <Penguin
              key={penguin.name}
              ref={penguin.ref}
              name={penguin.name}
              params={penguin.params}
            />
          ))}
          {/* detect CollideEvent */}
          <Controller
            register={() => detectCollideEvents(penguinControllers)}
          />
        </SceneBackground>
      </Scene>
    </Engine>
  );
}

export default PenguinGame;
