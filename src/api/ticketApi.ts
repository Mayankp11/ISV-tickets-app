import api from "./axios";
import type { Ticket } from "../types/ticket";

export const submitTicket = (ticket: Ticket) => {
  return api.post("/tickets", ticket); // Full URL will be baseURL + /ticket
};
