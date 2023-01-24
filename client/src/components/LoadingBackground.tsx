import { colord } from 'colord';
import { useMemo } from 'react';
import { loadingPolygons } from '../common/constants';
import { Polygon } from './Polygon';
import '../style/loadingBackground.scss';

interface LoadingBackgroundProps {
  mainColor?: string;
}
export function LoadingBackground({
  mainColor = '#c8e6b1',
}: LoadingBackgroundProps) {
  const backgroundStyle = useMemo(() => {
    const lightColor = colord(mainColor).desaturate(0.3).toHex();

    const darkColor = colord(mainColor).saturate(0.1).toHex();

    const hsvColor = colord(darkColor).toHsv();
    hsvColor.h -= 15;

    const offsetColor = colord(hsvColor).toHex();
    return {
      background: `linear-gradient(-30deg, ${offsetColor}, ${mainColor}, ${lightColor}, ${mainColor}, ${offsetColor})`,
    };
  }, [mainColor]);

  return (
    <div
      className="flex justify-center items-center absolute inset-0 overflow-hidden z-50"
      style={backgroundStyle}
    >
      <div className="flex gap-16">
        {loadingPolygons.map((polygon, i) => (
          <div
            key={polygon.id}
            className="box"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <Polygon
              className="jelly-bounce"
              size="7.4rem"
              shape={polygon.shape}
              fill="solid"
              color={polygon.color}
              opacity="0.1"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
