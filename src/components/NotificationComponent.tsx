import { useEffect, useState } from "react";
import useSocket from "./useSocket";

type User = {
  user: string;
  id_user: number;
};

export const NotificationComponent = ({ id_user, user }: User) => {
  const { socketRef, connectSocket } = useSocket("http://localhost:6001");
  const [notificaciones, setNotificaciones] = useState<string[]>([]);

  useEffect(() => {
    connectSocket(id_user);

    const socket = socketRef.current; // Copiar el valor de socketRef.current a una variable local

    if (socket) {
      socket.on("notificacion", (data: string) => {
        console.log("Notificación recibida:", data);
        setNotificaciones((prevNotificaciones) => [
          ...prevNotificaciones,
          data,
        ]);
      });
    }
    return () => {
      if (socket) {
        socket.off("notificacion");
      }
      // disconnect();
    };
  }, [connectSocket, id_user, socketRef]);

  return (
    <div>
      <h1>Notificaciones en Tiempo Real</h1>
      <h3>{user}</h3>
      {notificaciones.length > 0 ? (
        <ul>
          {notificaciones.map((notificacion, index) => (
            <li key={index}>{notificacion}</li>
          ))}
        </ul>
      ) : (
        <div>No hay notificaciones</div>
      )}
    </div>
  );
};
// export default NotificationComponent;
