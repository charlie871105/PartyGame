import { playerColor } from './constants';

export function promiseTimeout(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/** 取得玩家顏色 */
export function getPlayerColor({ codeName }: { codeName: string }) {
  if (!codeName.includes('P')) {
    return '#9e9e9e';
  }

  try {
    const index = parseInt(codeName.replaceAll('P', ''), 10) - 1;
    return playerColor?.[index] ?? '#9e9e9e';
  } catch (error) {
    return '#9e9e9e';
  }
}
