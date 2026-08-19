import type { CarpoolRequest, Connection } from "@/mock/types";
import { delay, store, uid } from "./store";

export const connectionService = {
  async getConnections(): Promise<Connection[]> {
    const visible = store.connections.filter((c) => !store.blocked.includes(c.name));
    return delay(visible.map((c) => ({ ...c })), 500);
  },
  async createFromRequest(request: CarpoolRequest): Promise<Connection> {
    const connection: Connection = {
      id: uid("c"),
      userId: request.userId,
      name: request.name,
      gender: request.gender,
      pickupArea: request.pickupArea,
      rideType: request.rideType,
      phone: "+92 300 5551234",
      days: ["Monday", "Wednesday", "Friday"],
      timeWindow: "07:30 AM departure · 12:00 PM return",
      connectedAt: new Date().toISOString().slice(0, 10),
    };
    store.connections = [connection, ...store.connections];
    return delay(connection, 400);
  },
  async removeConnection(id: string): Promise<{ ok: true }> {
    store.connections = store.connections.filter((c) => c.id !== id);
    return delay({ ok: true } as const, 400);
  },
};
