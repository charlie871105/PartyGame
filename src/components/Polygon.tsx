import React, { useMemo } from 'react';
import { FillType, ShapeType } from '../common/constants';

const clipPathMap: { [key in ShapeType]: string } = {
  [ShapeType.ROUND]: `circle(50% at 50% 50%)`,
  [ShapeType.SQUARE]: `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`,
  [ShapeType.TRIANGLE]: `polygon(50% 0%, 0% 100%, 100% 100%)`,
  [ShapeType.PENTAGON]: `polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)`,
};

const fillMap = {
  [FillType.SOLID]: ``,
  [FillType.FENCE]: `url(/images/line.svg)`,
  [FillType.SPOT]: `url(/images/round.svg)`,
};

interface PolygonProps {
  size?: string;
  color?: string;
  rotate?: string;
  opacity?: string | number;
  shape?: `${ShapeType}`;
  fill?: `${FillType}`;
}

export function Polygon({
  size = '10rem',
  color = 'white',
  rotate = '0deg',
  opacity = '0.4',
  shape = 'round',
  fill = 'fence',
}: PolygonProps) {
  const clipPath = useMemo(
    () => clipPathMap[shape || ShapeType.ROUND],
    [shape]
  );
  const filled = useMemo(() => fillMap[fill || FillType.SPOT], [fill]);

  const style = useMemo(
    () => ({
      width: size,
      height: size,
      backgroundColor: color,
      '-webkit-mask-image': filled,
      '-webkit-mask-size': `6%`,
      opacity: opacity,
      clipPath: clipPath,
      transform: `rotate(${rotate})`,
    }),
    [clipPath, color, filled, opacity, rotate, size]
  );

  return (
    <div className="frame">
      <div className="polygon" style={style} />
    </div>
  );
}
