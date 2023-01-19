import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { colord } from 'colord';
import { nanoid } from 'nanoid';
import { cloneDeep, random, sample } from 'lodash-es';
import { Polygon, PolygonProps } from './Polygon';
import { FillType, ShapeType } from '../common/constants';
import { promiseTimeout } from '../common/utils';

interface FloatPolygonsProps {
  className?: string;
  children?: ReactNode;
  mainColor?: string;
  /** 初始數量，畫面出現時，內部初始方塊數量 */
  initialQuantity?: number;
  /** 色塊最大數量，超過此數量時，會暫停產生方塊 */
  maxQuantity?: number;
  /** 產生間距，越短生成速度越快，單位 ms */
  generateInterval?: number;
}

export function BackGround({
  className,
  children,
  mainColor = '#f7c652',
  initialQuantity = 10,
  maxQuantity = 30,
  generateInterval = 500,
}: FloatPolygonsProps) {
  const createPolygonParams = useCallback(() => {
    // 變暗、偏移色相、提升飽和度，作為 polygon 候選顏色
    const darkColor = colord(mainColor).darken(0.1);
    let hsvColor = darkColor.toHsl();
    hsvColor.s += 20;

    const hsvColor01 = cloneDeep(hsvColor);
    hsvColor01.h -= 10;

    const hsvColor02 = cloneDeep(hsvColor);
    hsvColor02.h += 10;

    const colors = [
      colord(hsvColor).toHex(),
      colord(hsvColor01).toHex(),
      colord(hsvColor02).toHex(),
    ];

    const params: Omit<PolygonProps, 'id'> = {
      left: `${random(0, 100)}%`,
      top: `${random(0, 100)}%`,
      size: `${random(5, 20)}rem`,
      rotate: `${random(0, 90)}deg`,
      opacity: random(0.1, 0.2, true),
      color: sample(colors) ?? '',
      shape: sample(Object.values(ShapeType)) ?? 'round',
      fill: sample(Object.values(FillType)) ?? 'solid',
      animationDuration: `${random(5, 20)}s`,
    };
    return params;
  }, [mainColor]);
  const initMap = new Map<string, Omit<PolygonProps, 'id'>>();
  const init = () => {
    // 預先建立多邊形
    for (let i = 0; i < initialQuantity; i++) {
      initMap.set(nanoid(), createPolygonParams());
    }
  };

  const [polygonsMap, setPolygonsMap] = useState(initMap);

  function addPolygon(params: Omit<PolygonProps, 'id'>) {
    setPolygonsMap((prev) => {
      prev.set(nanoid(), params);
      return new Map(prev);
    });
  }

  function removePolygon(id: string) {
    setPolygonsMap((prev) => {
      prev.delete(id);
      return new Map(prev);
    });
  }
  useEffect(() => {
    const interval = setInterval(async () => {
      if (polygonsMap.size < maxQuantity) {
        await promiseTimeout(random(100, 1000));

        addPolygon(createPolygonParams());
      }
    }, generateInterval);

    return () => {
      clearInterval(interval);
    };
  }, [createPolygonParams, generateInterval, maxQuantity, polygonsMap.size]);
  useLayoutEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    <div className={`overflow-hidden ${className}`} style={backgroundStyle}>
      {children}
      {Array.from(polygonsMap).map(([id, params]) => (
        <Polygon
          className="absolute polygon-move"
          key={id}
          {...params}
          animationEnd={() => {
            removePolygon(id);
          }}
        />
      ))}
    </div>
  );
}
