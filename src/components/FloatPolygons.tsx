import React, { useMemo } from 'react';
import { colord } from 'colord';
import { Polygon } from './Polygon';

interface FloatPolygonsProps {
  mainColor?: string;
  /** 初始數量，畫面出現時，內部初始方塊數量 */
  initialQuantity?: number;
  /** 色塊最大數量，超過此數量時，會暫停產生方塊 */
  maxQuantity?: number;
  /** 產生間距，越短生成速度越快，單位 ms */
  generateInterval?: number;
}

export function FloatPolygons({
  mainColor = '#ffce5c',
  initialQuantity = 10,
  maxQuantity = 30,
  generateInterval = 500,
}: FloatPolygonsProps) {
  const backgroundStyle = useMemo(() => {
    // 變亮
    const lightenColor = colord(mainColor).lighten(0.1).toHex();

    // 變暗並偏移色相
    const darkColor = colord(mainColor).darken(0.1);

    const hsvColor = colord(darkColor).toHsl();

    hsvColor.h -= 10;

    const offsetColor = colord(hsvColor).toHex();

    return {
      background: `linear-gradient(-30deg, ${offsetColor}, ${mainColor}, ${lightenColor}, ${mainColor}, ${offsetColor})`,
    };
  }, [mainColor]);

  return (
    <div style={backgroundStyle} className="overflow-hidden h-full">
      <Polygon shape="round" fill="solid" />
      <Polygon shape="round" fill="spot" />
      <Polygon shape="triangle" fill="fence" />
      <Polygon shape="square" fill="spot" />
      <Polygon shape="pentagon" fill="solid" />
    </div>
  );
}
