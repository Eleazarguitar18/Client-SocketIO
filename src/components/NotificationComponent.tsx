import React, { useEffect, useState } from "react";
import useSocket from "../useSocket";

const NotificationComponent: React.FC = () => {
  const socketRef = useSocket("http://localhost:6001");
  const [notificaciones, setNotificaciones] = useState<string[]>([]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("notificacion", (data: string) => {
        console.log("Notificación recibida:", data);
        setNotificaciones((prevNotificaciones) => [
          ...prevNotificaciones,
          data,
        ]);
      });
    }
  }, [socketRef]);

  return (
    <div>
      <h1>Notificaciones en Tiempo Real</h1>
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

export default NotificationComponent;
