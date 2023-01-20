import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { ReduxState } from '../redux/store';
import '../style/loadingOverlay.scss';
import { LoadingBackground } from './LoadingBackground';

export function LoadingOverlay() {
  const isLoading = useSelector(
    (state: ReduxState) => state.loadingReducer.isLoading
  );
  return (
    <div className="absolute inset-0">
      <CSSTransition
        in={isLoading}
        classNames="round"
        timeout={{ enter: 1400, exit: 400 }}
        mountOnEnter
      >
        {/* <div className="absolute inset-0 mask bg-white z-50" /> */}
        <LoadingBackground />
      </CSSTransition>
    </div>
  );
}
