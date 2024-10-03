import {io} from "@http/WebSocket/wsServer";
import {injectable} from "tsyringe";

import {SOCKET_EVENTS} from "@appUtils/Constants";

@injectable()
export class WebSocketService {
    constructor() {}

    private getConnectedUsers(adminId: string) {
        const adminRooms: string[] = [];

        for (const [id, socket] of io.of("/").sockets) {
            if (socket.handshake.auth["adminId"] === adminId) {
                adminRooms.push(id);
            }
        }

        return {adminRooms};
    }

    async sendNotificationStatsEvent(notification: Record<string, any>) {
        const {adminRooms} = this.getConnectedUsers(notification["adminId"]);
        if (!adminRooms.length) {
            return;
        }

        io.to(adminRooms).emit(SOCKET_EVENTS.RECEIVE_NOTIFICATION, notification);
    }

    async sendNotificationCountEvent(notificationCount: number, adminId: string) {
        const {adminRooms} = this.getConnectedUsers(adminId);
        if (!adminRooms.length) {
            return;
        }

        io.to(adminRooms).emit(SOCKET_EVENTS.NOTIFICATION_COUNT, {notificationCount});
    }
}
