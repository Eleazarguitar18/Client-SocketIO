import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (url: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    // Limpia la conexión cuando el componente que usa este hook se desmonta
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [url]);

  return socket;
};

export default useSocket;
