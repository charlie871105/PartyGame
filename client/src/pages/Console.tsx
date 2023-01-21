import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useLoading from '../hooks/useLoading';

export default function Console() {
  const { stopLoading } = useLoading();
  useEffect(() => {
    stopLoading();
  }, [stopLoading]);
  return <div>Console</div>;
}
