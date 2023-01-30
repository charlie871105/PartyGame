import { Avatar } from '@mui/material';
import { debounce } from 'lodash-es';
import DoneIcon from '@mui/icons-material/Done';
import React, {
  createRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { GameButtonIcon } from '../common/constants';
import { getPlayerColor } from '../common/utils';
import { KeyName } from '../types/game.type';
import '../style/playerAvatar.scss';

type Message = `${KeyName}` | '';
interface PlayerAvatarProps {
  /** 玩家 ID，同 client ID */
  playerId: string;
  /** 玩家代號 */
  codeName: string;
}

export type PlayerAvatarHandle = {
  showBalloon: (text: Message) => void;
};

export const PlayerAvatar = forwardRef(
  ({ playerId, codeName }: PlayerAvatarProps, forwardedRef) => {
    const [message, setMessage] = useState<Message>('');
    const color = useMemo(() => getPlayerColor({ codeName }), [codeName]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const hideBalloon = useCallback(
      debounce(() => {
        setMessage('');
      }, 2000),
      []
    );

    function showBalloon(text: Message) {
      console.log(text);
      setMessage(text);
      hideBalloon();
    }

    function messageToIcon() {
      if (message === '') {
        return null;
      }
      return GameButtonIcon[message];
    }

    useImperativeHandle(forwardedRef, () => ({
      showBalloon,
    }));

    return (
      <Avatar
        sx={{
          height: '6rem',
          width: '6rem',
          fontSize: '2rem',
          bgcolor: color,
          color: 'white',
          overflow: 'visible',
        }}
      >
        {codeName}
        <div className="balloon-box">
          <CSSTransition
            in={message !== ''}
            timeout={1000}
            classNames="balloon"
            unmountOnExit
          >
            {message !== '' ? (
              <div className="balloon text-black">{messageToIcon()}</div>
            ) : (
              <div />
            )}
          </CSSTransition>
        </div>
      </Avatar>
    );
  }
);
