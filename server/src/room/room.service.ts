import { Injectable, Logger } from '@nestjs/common';
import { ClientId } from 'src/ws-client/ws-client.service';
import { customAlphabet } from 'nanoid';

const createRoomId = customAlphabet('1234567890', 6);

export type RoomId = string;

export interface Room {
  id: RoomId;
  founderId: ClientId;
  playerIds: ClientId[];
}
export type GetRoomParams = { founderId: string } | { playeId: string };

@Injectable()
export class RoomService {
  private logger: Logger = new Logger(RoomService.name);
  roomsMap = new Map<RoomId, Room>();

  addRoom(clientId: string) {
    let roomId = createRoomId();
    while (this.roomsMap.has(roomId)) {
      roomId = createRoomId();
    }

    const newRoom = {
      id: roomId,
      founderId: clientId,
      playerIds: [],
    };
    this.roomsMap.set(roomId, newRoom);
    this.logger.log(`created room : `, newRoom);

    return newRoom;
  }

  getRoom(params: GetRoomParams) {
    const result = [...this.roomsMap.values()].find((room) => {
      if ('founderId' in params) {
        return room.founderId === params.founderId;
      }
      return room.playerIds.includes(params.playeId);
    });
    return result;
  }

  hasRoom(roomId: string) {
    return this.roomsMap.has(roomId);
  }

  deleteRoom(founderId: string) {
    const rooms = [...this.roomsMap.values()].filter(
      (room) => room.founderId === founderId,
    );

    rooms.forEach(({ id }) => {
      this.roomsMap.delete(id);
    });
  }

  deletePlayer(clientId: string) {
    this.roomsMap.forEach((room, key) => {
      room.playerIds = room.playerIds.filter((id) => id !== clientId);

      this.roomsMap.set(key, room);
    });
  }
}
