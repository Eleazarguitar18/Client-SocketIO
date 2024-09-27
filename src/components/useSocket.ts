import {  useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

const useSocket = (url: string) => {
    const socketRef = useRef<Socket | null>(null);

    const connectSocket = (userId: number) => {
        if (!socketRef.current) {
            socketRef.current = io(url);

            socketRef.current.on('connect', () => {
                console.log('Conectado al servidor de Socket.IO');
                // Enviar el socket.id a la API de Laravel
                axios.post('http://localhost:8001/api/store-socket-id', {
                    userId: userId,
                    socketId: socketRef.current?.id
                });
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    };

    return { socketRef, connectSocket };
};

export default useSocket;
