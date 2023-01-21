export function promiseTimeout(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
