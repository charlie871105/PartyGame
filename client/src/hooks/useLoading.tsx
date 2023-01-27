import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { promiseTimeout } from '../common/utils';
import { START_LOADING, STOP_LOADING } from '../redux/reducer/loadingReducer';

const useLoading = () => {
  const dispatch = useDispatch();

  const startLoading = useCallback(async () => {
    dispatch(START_LOADING());
    await promiseTimeout(1400);
  }, [dispatch]);

  const stopLoading = useCallback(async () => {
    dispatch(STOP_LOADING());
  }, [dispatch]);

  return { startLoading, stopLoading };
};

export default useLoading;
