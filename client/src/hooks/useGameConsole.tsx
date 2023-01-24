import useSocket from './useSocket';

const useGameConsole = () => {
  const { connect, close } = useSocket();

  async function starParty() {
    close();

    // 開始連線
    const client = connect('game-console');

    return new Promise<string>((resolve, reject) => {
      // 5秒後超時
      const timer = setTimeout(() => {
        close();
        client.removeAllListeners();

        reject(Error('連線超時'));
      }, 3000);

      // 連線異常
      client.once('connect_error', (error) => {
        client.removeAllListeners();
        reject(error);
      });

      // 建立成功
      client.once('game-console:room-created', async ({ id }) => {
        client.removeAllListeners();
        // clearTimeout(timer);
        resolve(id);
      });
    });
  }

  return {
    /** 開始派對
     *
     *建立連線，並回傳房間id
     */
    starParty,
  };
};

export default useGameConsole;
