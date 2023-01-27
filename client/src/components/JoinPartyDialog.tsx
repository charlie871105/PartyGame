import {
  Button,
  Dialog,
  TextField,
  styled,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useGamePlayer from '../hooks/useGamePlayer';
import useLoading from '../hooks/useLoading';
import { SET_ROOM_ID } from '../redux/reducer/gameConsoleReducer';
import { CLOSE_DIALOG } from '../redux/reducer/joinPartyDialogReducer';
import { ReduxState } from '../redux/store';
import '../style/joinPartyDialog.scss';

const RoomCodeInput = styled(TextField)({
  input: {
    textAlign: 'center',
    height: '4rem',
    boxSizing: 'border-box',
  },
  '.MuiInputBase-root': {
    borderRadius: '4rem',
  },
});
const SubmitButton = styled(Button)({
  padding: '6px 12px',
  height: '4rem',
  borderRadius: '4rem',
});

const joinPartyTheme = createTheme({
  palette: {
    secondary: {
      light: '#37d1c3',
      main: '#26a69a',
      dark: '#1e847b',
    },
  },
});
export function JoinPartyDialog() {
  const inputRef = useRef<HTMLInputElement>();
  const dispatch = useDispatch();
  const { startLoading } = useLoading();
  const open = useSelector(
    (state: ReduxState) => state.joinPartyDialogReducer.open
  );
  const { joinRoom } = useGamePlayer();
  const navigate = useNavigate();

  const submit = async () => {
    if (!inputRef.current) return;

    if (!/^[0-9]{6}$/.test(inputRef.current.value)) {
      toast.error('請輸入6位數字');
      return;
    }

    // create loading toast
    const loadingToastId = toast.loading('加入房間中');
    try {
      const room = await joinRoom(inputRef.current.value);
      // 成功 更新roomId
      console.log(`[ joinRoom ] room : `, room);
      dispatch(SET_ROOM_ID(room.id));

      // toast結束 loading
      toast.update(loadingToastId, {
        render: '加入房間成功',
        type: 'success',
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });

      // 關閉Dialog
      dispatch(CLOSE_DIALOG());
      await startLoading();
      navigate('/player-gamepad');
    } catch (error: any) {
      toast.update(loadingToastId, {
        render: `加入房間失敗 : ${error?.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: { width: '30rem', height: '30rem' },
        className: 'card flex flex-col p-14 justify-around',
      }}
      onClose={() => dispatch(CLOSE_DIALOG())}
      open={open}
    >
      <div className="text-3xl text-center">輸入派對房間 ID</div>
      <ThemeProvider theme={joinPartyTheme}>
        <RoomCodeInput
          inputRef={inputRef}
          color="secondary"
          type="tel"
          placeholder="請輸入 6 位數字"
        />
        <SubmitButton
          color="secondary"
          variant="contained"
          className="p-4"
          onClick={submit}
        >
          加入
        </SubmitButton>
      </ThemeProvider>
    </Dialog>
  );
}
