import { Injectable } from '@nestjs/common';

export enum ClientType {
  GAME_CONSOLE = 'game-console',
  PLAYER = 'player',
}

export type ClientId = string;

export interface Client {
  id: ClientId;
  socketId: string;
  type: `${ClientType}`;
}

export interface PutClientParams {
  socketId: string;
  clientId: ClientId;
  type: `${ClientType}`;
}
/**  可利用 socketId or clientId get */
export type GetClientParams = { socketId: string } | { clientId: string };

@Injectable()
export class WsClientService {
  clientsMap = new Map<ClientId, Client>();

  // 更新 / 新增 client
  putClient(params: PutClientParams) {
    const { clientId, socketId, type } = params;

    const client = this.clientsMap.get(clientId);
    // 找不到 -> 新增
    if (!client) {
      const newClient = { id: clientId, socketId, type };
      this.clientsMap.set(clientId, newClient);
      return newClient;
    }

    // 找得到 -> 更新
    client.socketId = socketId;
    client.type = type;
    this.clientsMap.set(clientId, client);
    return client;
  }

  getClient(params: GetClientParams) {
    // 傳入的是 clientId
    if ('clientId' in params) {
      return this.clientsMap.get(params.clientId);
    }
    // 傳入的是 socketId
    const clients = [...this.clientsMap.values()];
    const target = clients.find(({ socketId }) => socketId === params.socketId);
    return target;
  }
}
