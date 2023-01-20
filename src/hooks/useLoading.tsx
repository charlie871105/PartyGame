import { useDispatch } from 'react-redux';
import { promiseTimeout } from '../common/utils';
import { START_LOADING, STOP_LOADING } from '../redux/reducer/loadingReducer';

const useLoading = () => {
  const dispatch = useDispatch();

  const startLoading = async () => {
    dispatch(START_LOADING());
    await promiseTimeout(1400);
  };
  const stopLoading = async () => {
    dispatch(STOP_LOADING());
  };

  return { startLoading, stopLoading };
};

export default useLoading;
