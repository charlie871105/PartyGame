import { nanoid } from 'nanoid';
import {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { promiseTimeout } from '../common/utils';
import '../style/button.scss';

interface ButtonProps {
  className?: string;
  children?: ReactNode;
  label?: string;
  labelColor?: string;
  labelHoverColor?: string;
  strokeColor?: string;
  strokeHoverColor?: string;
  strokeSize?: string;
  onClick?: () => void;
  hoverToShowChildren?: boolean;
  buttonContentStyle?: string;
}

export const Button = forwardRef(
  (
    {
      children,
      className,
      onClick,
      label = '',
      labelColor = 'white',
      strokeSize = '2',
      strokeColor = '#888',
      strokeHoverColor,
      labelHoverColor,
      hoverToShowChildren = false,
      buttonContentStyle,
    }: ButtonProps,
    ref
  ) => {
    const id = useRef(nanoid());
    const [isHover, setIsHover] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const hoverClass = isHover ? 'hover' : '';
    const activeClass = isActive ? 'active' : '';

    const svgFilterId = useMemo(() => `svg-filter-${id.current}`, []);

    const labelStyle = useMemo(() => {
      let color = labelColor;

      if (labelHoverColor) {
        color = isHover ? labelHoverColor : labelColor;
      }

      return {
        color,
      };
    }, [isHover, labelColor, labelHoverColor]);

    const strokeStyle = useMemo(() => {
      let color = strokeColor;

      if (strokeHoverColor) {
        color = isHover ? strokeHoverColor : strokeColor;
      }

      return {
        color,
        filter: `url(#${svgFilterId})`,
      };
    }, [isHover, strokeColor, strokeHoverColor, svgFilterId]);

    function handleMouseenter() {
      setIsHover(true);
    }

    function handleMouseleave() {
      setIsActive(false);
      setIsHover(false);
    }

    function handleMouseup() {
      setIsActive(false);
    }

    function handleMousedown() {
      setIsActive(true);
    }

    useImperativeHandle(ref, () => ({
      click: async () => {
        if (!onClick) return;
        handleMousedown();
        onClick();
        await promiseTimeout(100);
        handleMouseup();
      },
      isHover,
      hover: handleMouseenter,
      leave: handleMouseleave,
    }));

    return (
      <button
        type="button"
        className={`btn flex overflow-hidden justify-center items-center text-3xl p-12 rounded-full ${className} ${activeClass}`}
        onClick={onClick}
        onMouseEnter={handleMouseenter}
        onMouseLeave={handleMouseleave}
        onMouseUp={handleMouseup}
        onMouseDown={handleMousedown}
        onBlur={() => setIsActive(false)}
      >
        {hoverToShowChildren && isHover && (
          <div className={`${buttonContentStyle} ${hoverClass}`}>
            {children}
          </div>
        )}
        {!hoverToShowChildren && (
          <div className={`${buttonContentStyle} ${hoverClass}`}>
            {children}
          </div>
        )}

        <div
          className="label relative font-black tracking-widest"
          style={labelStyle}
        >
          {label}
          <div className="label-stroke absolute" style={strokeStyle}>
            {label}
          </div>
        </div>

        <svg version="1.1" className="hidden">
          <defs>
            <filter id={svgFilterId}>
              <feMorphology radius={strokeSize} operator="dilate" />
              <feComposite operator="xor" in="SourceGraphic" />
            </filter>
          </defs>
        </svg>
      </button>
    );
  }
);
