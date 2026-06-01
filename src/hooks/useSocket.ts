import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SOCKET_URL = API_URL.replace(/\/api$/, "");

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    let tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'default';
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            const parts = hostname.split('.');
            if (parts.length >= 3 || (parts.length === 2 && !hostname.includes('vercel.app'))) {
                tenantId = parts[0];
            }
        } else {
            const localTenant = localStorage.getItem('dev-tenant-id');
            if (localTenant) tenantId = localTenant;
        }
    }

    const socketInstance = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      query: {
        tenantId
      },
      transports: ["websocket"], 
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {});

    socketInstance.on("connect_error", (err) => {});

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
