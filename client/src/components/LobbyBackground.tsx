import { colord } from 'colord';
import React, { useMemo } from 'react';
import { ShapeType } from '../common/constants';
import '../style/consoleLobbyBackground.scss';
import { Polygon } from './Polygon';

interface LobbyBackgroundProps {
  mainColor?: string;
  className?: string;
}

export function LobbyBackground({
  className,
  mainColor = '#b3e6d0',
}: LobbyBackgroundProps) {
  const shapeTypes = Object.values(ShapeType);
  const polygons: ShapeType[] = Array.from(
    Array(500),
    (_, i) => shapeTypes[i % shapeTypes.length]
  );

  const backgroundStyle = useMemo(() => {
    // 變亮
    const lightenColor = colord(mainColor).desaturate(0.1).toHex();

    // 變暗並偏移色相
    const darkColor = colord(mainColor).saturate(0.1).toHex();

    const hsvColor = colord(darkColor).toHsv();
    hsvColor.h -= 20;

    const offsetColor = colord(hsvColor).toHex();

    return {
      background: `linear-gradient(-30deg, ${offsetColor}, ${mainColor}, ${lightenColor}, ${mainColor}, ${offsetColor})`,
    };
  }, [mainColor]);

  return (
    <div className={`overflow-hidden ${className}`} style={backgroundStyle}>
      <div className="flex w-full h-full gap-10 flex-wrap">
        {polygons.map((shape, i) => (
          <Polygon
            key={i}
            className="lobby-polygon"
            size="2rem"
            fill="solid"
            shape={shape}
            color="#f9fff0"
            style={{ animationDelay: `-${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}
