import React, {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Engine, HemisphericLight, Scene } from 'react-babylonjs';
import { CannonJSPlugin, Color3, Vector3 } from '@babylonjs/core';
import * as CANNON from 'cannon-es';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { colord } from 'colord';
import useLoading from '../../hooks/useLoading';
import '@babylonjs/loaders';
import Penguin from './Penguin';
import Controller, { PenguinModel } from './Controller';
import { SocketContext } from '../../context/SocketContext';
import { ReduxState } from '../../redux/store';
import useGameConsole from '../../hooks/useGameConsole';
import { getPlayerColor } from '../../common/utils';
import { penguinInitPositions } from './penguinUtils';
import Ice from './Ice';
import SceneBackground from './SceneBackground';
import GameoverDialog from '../GameoverDialog';

function PenguinGame() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('Unknow Context');
  }
  const { client } = context;
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const { getPlayerCodeName } = useGameConsole();
  const playerList = useSelector(
    (state: ReduxState) => state.gameConsoleReducer.players
  );

  const isGameOver = useRef(false);
  const [winner, setWinner] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const penguinModels: PenguinModel[] = playerList.map((player, i) => ({
    name: `penguin-${i}`,
    params: {
      position: getPenguinPosition(i),
      color: getPenguinColor(player.clientId),
      ownerId: player.clientId,
    },
    ref: createRef(),
  }));

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

  const backToLobby = useCallback(async () => {
    setGameOver(false);
    isGameOver.current = false;
    await startLoading();
    navigate('/console/lobby');
  }, [navigate, startLoading]);

  const handleWinner = useCallback(
    (id: string) => {
      const winnerId = getPlayerCodeName(id);
      setWinner(winnerId);
    },
    [getPlayerCodeName]
  );

  const handleGameover = useCallback(async () => {
    setGameOver(true);
    isGameOver.current = true;
  }, []);

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
        </SceneBackground>
        {/* detect CollideEvent */}
        <Controller
          client={client!}
          penguinModels={penguinModels}
          isGameOver={isGameOver}
          backToLobby={backToLobby}
          handleGameover={handleGameover}
          handleWinner={handleWinner}
        />
      </Scene>
      <GameoverDialog isGameOver={gameOver} winnerCodeName={winner} />
    </Engine>
  );
}

export default PenguinGame;
