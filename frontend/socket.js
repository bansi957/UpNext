import { io } from "socket.io-client";
import { serverUrl } from "./src/App";
let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(serverUrl, {
      withCredentials: true,
    });
  }
  return socket;
};
 