import { debounce } from 'lodash-es';
import React, {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  Button,
  Polygon,
  RoomIdChip,
  PlayerAvatar,
  GameSelectPanel,
  LobbyBackground,
  PlayerAvatarHandle,
  game,
} from '../components';
import { SocketContext } from '../context/SocketContext';
import useGameConsole from '../hooks/useGameConsole';
import useGamepadNavigator, {
  ControlElement,
} from '../hooks/useGamepadNavigator';
import useLoading from '../hooks/useLoading';
import { ReduxState } from '../redux/store';
import '../style/consoleLobby.scss';
import { GamepadData } from '../types/game.type';

function ConsoleLobby() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('Unknow Context');
  }
  const { client } = context;
  const { startLoading, stopLoading } = useLoading();
  const { setStatus, setGameName } = useGameConsole();
  const playerList = useSelector(
    (state: ReduxState) => state.gameConsoleReducer.players
  );

  const navigate = useNavigate();
  const startGameBtnRef = useRef<ControlElement>(null);
  const endGameBtnRef = useRef<ControlElement>(null);
  const gameNavigator = useGamepadNavigator();

  const startGame = debounce(
    async () => {
      await startLoading();
      setStatus('playing');
      setGameName(game.gameName);
      navigate('/console/penguin');
    },
    3000,
    {
      leading: true,
      trailing: false,
    }
  );

  const playersInfos = useMemo(
    () =>
      playerList.map((player, i) => ({
        id: player.clientId,
        codeName: `${i + 1}P`,
        componentRef: createRef<PlayerAvatarHandle>(),
        transitionRef: createRef<HTMLDivElement>(),
      })),
    [playerList]
  );

  const receiveGamepadData = useCallback(
    (data: GamepadData) => {
      console.log(`[ onGamepadData ] data : `, data);

      const lastDatum = data.keys.at(-1);

      const action = lastDatum?.name;
      const state = lastDatum?.value;

      if (!action) return;
      // 忽略按下訊號
      if (state) return;

      const targetPlayer = playersInfos.find(
        (playerInfo) => playerInfo.id === data.playerId
      );
      targetPlayer?.componentRef.current?.showBalloon(action);

      if (action === 'up') {
        gameNavigator.prev();
      }
      if (action === 'down') {
        gameNavigator.next();
      }
      if (action === 'confirm') {
        gameNavigator.click();
      }
    },
    [gameNavigator, playersInfos]
  );
  useEffect(() => {
    gameNavigator.addElement(startGameBtnRef);
    gameNavigator.addElement(endGameBtnRef);
    return () => {
      gameNavigator.clearElement();
    };
  }, [endGameBtnRef, gameNavigator, startGameBtnRef]);

  useEffect(() => {
    setStatus('lobby');
    stopLoading();
    client?.on('player:gamepad-data', receiveGamepadData);
    return () => {
      client?.removeListener('player:gamepad-data', receiveGamepadData);
    };
  }, [client, receiveGamepadData, setStatus, stopLoading]);

  return (
    <>
      <LobbyBackground className="absolute inset-0" />

      <div className="absolute inset-0 flex">
        <div className="flex w-full h-full">
          {/* <!-- 選單 --> */}
          <div className="w-1/2 flex flex-col p-12">
            <div className="flex flex-col flex-1 justify-center items-center gap-14">
              <RoomIdChip color="#67785d" />
              <Button
                ref={startGameBtnRef}
                label="開始遊戲"
                className="w-96 relative"
                labelHoverColor="#7b916e"
                strokeHoverColor="white"
                hoverToShowChildren
                buttonContentStyle="lobby-btn-content absolute inset-0"
                onClick={startGame}
              >
                <div className="lobby-polygon-lt">
                  <Polygon
                    className="lobby-polygon-beat"
                    size="13rem"
                    shape="round"
                    fill="spot"
                  />
                </div>
                <div className="lobby-polygon-rb">
                  <Polygon
                    className="lobby-polygon-beat"
                    size="13rem"
                    shape="round"
                    fill="fence"
                    opacity="0.2"
                  />
                </div>
              </Button>

              <Button
                ref={endGameBtnRef}
                label="結束派對"
                className="w-96 relative"
                labelHoverColor="#7b916e"
                strokeHoverColor="white"
                hoverToShowChildren
                buttonContentStyle="lobby-btn-content absolute inset-0"
                onClick={() => console.log('end')}
              >
                <div className="lobby-polygon-lt">
                  <Polygon
                    className="lobby-polygon-swing"
                    size="13.4rem"
                    shape="square"
                    fill="spot"
                  />
                </div>
                <div className="lobby-polygon-rb">
                  <Polygon
                    className="lobby-polygon-swing"
                    size="13.3rem"
                    shape="square"
                    fill="fence"
                    opacity="0.2"
                  />
                </div>
              </Button>
            </div>

            {/* <!-- 玩家清單 --> */}
            <TransitionGroup className="flex justify-center items-center gap-4 h-32">
              {playersInfos.map((playerInfo) => (
                <CSSTransition
                  key={playerInfo.id}
                  nodeRef={playerInfo.transitionRef}
                  timeout={500}
                  classNames="list"
                >
                  <div ref={playerInfo.transitionRef}>
                    <PlayerAvatar
                      ref={playerInfo.componentRef}
                      playerId={playerInfo.id}
                      codeName={playerInfo.codeName}
                    />
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>

          {/* <!-- 選擇遊戲 --> */}
          <div className="w-1/2 flex flex-nowrap justify-center items-center flex-1 px-16">
            <GameSelectPanel />
          </div>
        </div>
      </div>
    </>
  );
}

export default ConsoleLobby;
