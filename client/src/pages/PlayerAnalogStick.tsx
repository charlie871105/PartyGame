import { Card, CardContent, Dialog } from '@mui/material';
import React, { useContext, useEffect, useMemo } from 'react';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import { useSelector } from 'react-redux';
import {
  AnalogStick,
  GamepadButton,
  GamepadDirectionButton,
} from '../components';
import useLoading from '../hooks/useLoading';
import useScreenOrientation from '../hooks/useScreenOrientation';
import { getPlayerColor } from '../common/utils';
import '../style/gamepadLobby.scss';
import { ReduxState } from '../redux/store';

export default function PlayerAnalogStick() {
  const { stopLoading } = useLoading();
  const isPortrait = useScreenOrientation();
  const playerlist = useSelector(
    (state: ReduxState) => state.gameConsoleReducer.players
  );
  const clientid = useSelector(
    (state: ReduxState) => state.socketReducer.clientId
  );
  const codeName = useMemo(() => {
    const index = playerlist.findIndex(
      (player) => player.clientId === clientid
    );
    if (index < 0) {
      return 'unknown ';
    }
    return `${index + 1}P`;
  }, [clientid, playerlist]);

  const playerColor = getPlayerColor({ codeName });

  useEffect(() => {
    stopLoading();
  }, [stopLoading]);

  return (
    <div className="w-full h-full flex text-white select-none">
      <div className="code-name" style={{ backgroundColor: playerColor }}>
        {codeName}
      </div>
      <GamepadButton
        keyName="confirm"
        size="20rem"
        className="absolute bottom-10 right-20"
      />
      <AnalogStick className="absolute bottom-5 left-8" />

      <Dialog open={isPortrait}>
        <Card className="p-8">
          <CardContent className="flex flex-col items-center gap-6">
            <ScreenRotationIcon
              color="primary"
              sx={{ width: '10rem', height: '10rem' }}
            />
            <div className="text-4xl">請將手機轉為橫向</div>
            <div className="text-base">轉為橫向後，此視窗會自動關閉</div>
          </CardContent>
        </Card>
      </Dialog>
    </div>
  );
}
