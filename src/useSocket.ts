import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (url: string) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(url);

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [url]);

    return socketRef;
};

export default useSocket;
