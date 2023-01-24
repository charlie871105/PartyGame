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
import { toast } from 'react-toastify';
import {
  CLOSE_DIALOG,
  SET_TOAST_ID,
} from '../redux/reducer/joinPartyDialogReducer';
import { ReduxState } from '../redux/store';
import '../style/joinPartyDialog.scss';

const RoomCodeInput = styled(TextField)({
  input: {
    textAlign: 'center',
    height: '3rem',
    boxSizing: 'border-box',
  },
  '.MuiInputBase-root': {
    borderRadius: '4rem',
  },
});
const SubmitButton = styled(Button)({
  padding: '6px 12px',
  height: '3rem',
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
  const open = useSelector(
    (state: ReduxState) => state.joinPartyDialogReducer.open
  );

  const submit = async () => {
    if (!inputRef.current) return;
    if (!/^[0-9]{6}$/.test(inputRef.current.value)) {
      toast.error('請輸入6位數字');
      return;
    }
    const loadingToastId = toast.loading('加入房間中');
    dispatch(SET_TOAST_ID(loadingToastId));
  };

  return (
    <Dialog onClose={() => dispatch(CLOSE_DIALOG())} open={open}>
      <div className="card flex flex-col p-14 gap-8">
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
      </div>
    </Dialog>
  );
}
