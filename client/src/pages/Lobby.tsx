import React, { useEffect } from 'react';
import { Button, LobbyBackground, Polygon } from '../components';
import { GameSelectPanel } from '../components/gameSelectPanel';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { RoomIdChip } from '../components/RoomIdChip';
import useLoading from '../hooks/useLoading';
import '../style/lobby.scss';

function Lobby() {
  const { stopLoading } = useLoading();

  useEffect(() => {
    stopLoading();
  }, [stopLoading]);

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
                label="開始遊戲"
                className="w-96"
                labelHoverColor="#7b916e"
                strokeHoverColor="white"
                hoverToShowChildren
                buttonContentStyle="lobby-btn-content absolute inset-0"
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
                label="結束派對"
                className="w-96"
                labelHoverColor="#7b916e"
                strokeHoverColor="white"
                hoverToShowChildren
                buttonContentStyle="lobby-btn-content absolute inset-0"
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
            <div className="flex justify-center items-center gap-4 h-32">
              <PlayerAvatar playerId="id" codeName="1P" />
            </div>
          </div>

          {/* <!-- 選擇遊戲 --> */}
          <div className="w-1/2 flex flex-nowrap justify-center items-center flex-1 px-16">
            {/* <Button label="◀" /> */}
            <GameSelectPanel />
            {/* <Button label="▶" /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Lobby;
