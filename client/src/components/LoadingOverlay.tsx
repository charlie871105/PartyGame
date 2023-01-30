import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { ReduxState } from '../redux/store';
import '../style/loadingOverlay.scss';
import { LoadingBackground } from './LoadingBackground';

export function LoadingOverlay() {
  const isLoading = useSelector(
    (state: ReduxState) => state.loadingReducer.isLoading
  );
  const transitionRef = useRef(null);

  return (
    <div className="absolute inset-0">
      <CSSTransition
        in={isLoading}
        nodeRef={transitionRef}
        classNames="round"
        timeout={{ enter: 1400, exit: 400 }}
        mountOnEnter
      >
        <LoadingBackground ref={transitionRef} />
      </CSSTransition>
    </div>
  );
}
