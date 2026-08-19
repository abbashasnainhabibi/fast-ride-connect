import type { CarpoolRequest, MatchProfile, RequestStatus } from "@/mock/types";
import { delay, store, uid } from "./store";

export const requestService = {
  async getRequests(): Promise<CarpoolRequest[]> {
    return delay(store.requests.map((r) => ({ ...r })), 500);
  },
  async sendRequest(match: MatchProfile): Promise<CarpoolRequest> {
    const request: CarpoolRequest = {
      id: uid("r"),
      direction: "sent",
      userId: match.userId,
      name: match.name,
      gender: match.gender,
      pickupArea: match.pickupArea,
      rideType: match.rideType,
      verified: match.verified,
      scheduleNote: match.scheduleNote,
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
    };
    store.requests = [request, ...store.requests];
    return delay(request, 650);
  },
  async updateStatus(id: string, status: RequestStatus): Promise<CarpoolRequest> {
    const req = store.requests.find((r) => r.id === id);
    if (!req) throw new Error("Request not found.");
    req.status = status;
    return delay({ ...req }, 450);
  },
};
