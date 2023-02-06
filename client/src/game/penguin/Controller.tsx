import { Vector3 } from '@babylonjs/core';
import { curry } from 'lodash-es';
import React, { MutableRefObject, useCallback, useEffect } from 'react';
import { useEngine, useScene } from 'react-babylonjs';
import { GamepadData, KeyName, SingleData } from '../../types/game.type';
import { ClientSocket } from '../../types/socket.type';
import { PenguinController, PenguinProps } from './Penguin';

export type PenguinModel = PenguinProps & {
  ref: MutableRefObject<PenguinController | null>;
};

type ControllerProps = {
  penguinModels: PenguinModel[];
  client: ClientSocket;
  isGameOver: React.MutableRefObject<boolean>;
  backToLobby: () => Promise<void>;
  handleWinner: (id: string) => void;
  handleGameover: () => void;
};
function Controller({
  penguinModels,
  client,
  isGameOver,
  backToLobby,
  handleGameover,
  handleWinner,
}: ControllerProps) {
  const engine = useEngine();
  const scene = useScene();

  const penguinControllers = penguinModels.map((penguin) => penguin.ref);

  /** 偵測企鵝碰撞事件 */
  const detectCollideEvents = useCallback(() => {
    const length = penguinControllers.length;
    for (let i = 0; i < length; i++) {
      for (let j = i; j < length; j++) {
        if (i === j) continue;

        const aPenguin = penguinControllers[i].current;
        const bPenguin = penguinControllers[j].current;
        if (!aPenguin || !bPenguin) continue;

        const aMesh = aPenguin?.mesh.current;
        const bMesh = bPenguin?.mesh.current;
        if (!aMesh || !bMesh) continue;

        if (aMesh.intersectsMesh(bMesh)) {
          handleCollideEvent(aPenguin, bPenguin);
        }
      }
    }
  }, [penguinControllers]);
  /** 處理碰撞事件 */
  function handleCollideEvent(
    aPenguin: PenguinController,
    bPenguin: PenguinController
  ) {
    if (!aPenguin?.mesh.current || !bPenguin?.mesh.current) return;

    const aState = aPenguin.state.current;
    const bState = bPenguin.state.current;

    // 企鵝在 idle 狀態，不須動作
    if ([aState, bState].includes('idle')) return;

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

  /** 控制企鵝 */
  const controlPenguin = useCallback(
    (penguin: PenguinController, data: GamepadData) => {
      const { keys } = data;
      const findData = findSingleData(keys);

      // 攻擊
      const attackData = findData('attack');

      if (attackData) {
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

  const updateGameData = useCallback(
    (data: GamepadData) => {
      console.log('[ gameConsole.onGamepadData ] data : ', data);

      const { playerId, keys } = data;

      // 處理遊戲結束
      const findData = findSingleData(keys);
      const attackData = findData('attack');
      if (attackData && isGameOver.current) {
        backToLobby();
        return;
      }

      const targetPenguinModel = penguinModels.find(
        (penguinModel) => penguinModel.params?.ownerId === playerId
      );
      const penguin = targetPenguinModel?.ref.current;

      if (!penguin) return;
      controlPenguin(penguin, data);
    },
    [backToLobby, controlPenguin, findSingleData, isGameOver, penguinModels]
  );

  /**
   * 偵測出界的
   * y 軸低於 -3 判定為出界
   */
  const detectOutOfBounds = useCallback(() => {
    penguinControllers.forEach((penguinController) => {
      if (!penguinController.current) return;
      const penguin = penguinController.current.mesh.current;
      if (!penguin) return;

      if (penguin.position.y < -3) {
        penguin.dispose();
      }
    });
  }, [penguinControllers]);

  /** 偵測是否有贏家 */
  const detectWinner = useCallback(() => {
    const alivePenguins = penguinModels.filter(
      ({ ref }) => !ref.current?.mesh.current?.isDisposed()
    );

    if (alivePenguins.length !== 1) return;

    engine?.stopRenderLoop();

    const winnerId = alivePenguins[0].params?.ownerId ?? '';
    // winnerCodeName.current = getPlayerCodeName(winnerId);
    // isGameOver.current = true;
    handleWinner(winnerId);
    handleGameover();
  }, [engine, handleGameover, handleWinner, penguinModels]);

  const registerRenderEvent = useCallback(() => {
    detectCollideEvents();
    detectOutOfBounds();
    detectWinner();
  }, [detectCollideEvents, detectOutOfBounds, detectWinner]);

  // 註冊碰撞事件
  useEffect(() => {
    scene?.registerAfterRender(registerRenderEvent);
    return () => {
      scene?.unregisterAfterRender(registerRenderEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 註冊控制企鵝
  useEffect(() => {
    client?.on('player:gamepad-data', updateGameData);

    return () => {
      client?.removeListener('player:gamepad-data', updateGameData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default Controller;
