import React, { MutableRefObject, useCallback, useMemo, useRef } from 'react';

export interface ControlElement {
  click(): void;
  hover(): void;
  leave(): void;
  isHover(): void;
}

function useGamepadNavigator<T extends ControlElement>() {
  const controlElements = useRef<MutableRefObject<T | null>[]>([]);

  /** 加入控制元件 */
  const addElement = useCallback((el: MutableRefObject<T | null>) => {
    if (!el.current) return;
    controlElements.current.push(el);
  }, []);
  /** 清除控制元件 */
  const clearElement = useCallback(() => {
    controlElements.current = [];
  }, []);

  /** hover 指定元件 */
  const hoverElement = useCallback((index: number) => {
    controlElements.current?.forEach((el) => el.current?.leave());
    controlElements.current?.[index]?.current?.hover();
  }, []);

  /** 目前 hover 元件的 index */
  const currentIndex = useCallback(
    () => controlElements.current?.findIndex((item) => item.current?.isHover),
    []
  );

  /** 上一個元件 */
  const prev = useCallback(() => {
    if (!currentIndex()) {
      return hoverElement(0);
    }
    if (currentIndex() < 0) {
      return hoverElement(0);
    }

    let targetIndex = currentIndex() - 1;
    if (targetIndex < 0) {
      targetIndex += controlElements.current?.length || 0;
    }

    return hoverElement(targetIndex);
  }, [currentIndex, hoverElement]);

  /** 下一個元件 */
  const next = useCallback(() => {
    if (!currentIndex) {
      return hoverElement(0);
    }
    if (currentIndex() < 0) {
      return hoverElement(0);
    }

    const targetIndex =
      (currentIndex() + 1) % (controlElements.current?.length || 1);
    return hoverElement(targetIndex);
  }, [currentIndex, hoverElement]);

  /** 點擊目前 hover 元件 */
  const click = useCallback(() => {
    if (!currentIndex) {
      return hoverElement(0);
    }
    if (currentIndex() < 0) {
      hoverElement(0);
      return controlElements.current?.[0].current?.click();
    }

    const targetIndex = currentIndex;
    hoverElement(targetIndex());
    return controlElements.current?.[targetIndex()].current?.click();
  }, [currentIndex, hoverElement]);

  return {
    addElement,
    clearElement,
    next,
    prev,
    click,
  };
}

export default useGamepadNavigator;
