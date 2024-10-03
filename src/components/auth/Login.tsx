import React, { useState } from "react";
import axios from "axios";
import { url_base } from "./urlbase.routes";
// import { NotificationComponent } from "../NotificationComponent";
import { io, Socket } from "socket.io-client";
// import useSocket from "../useSocket";

type Credenciales = {
  email: string;
  password: string;
};
// type User = {};
export const Login: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  // const { connectSocket } = useSocket("http://localhost:6001");
  const conexionSocket = (urlsocket: string) => {
    const socket: Socket = io(urlsocket);
    socket.on("connect", () => {
      console.log(`Este es el id de la conexion: ${socket.id}`);
    });
    // console.log(`Este es el id de la conexion: ${socket.id}`);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const credenciales: Credenciales = {
      email: user,
      password: password,
    };

    try {
      const response = await axios.post(`${url_base}/login`, credenciales);
      console.log(response.data);

      if (response.status == 200) {
        // Guardar el userId y conectar al servidor de Socket.IO
        setUserId(response.data.user.id);
        setUserName(response.data.user.name);
        // conexionSocket(response.data.user.id);
        conexionSocket("http://192.168.4.230:6001");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {/* {userId && (
        <NotificationComponent id_user={parseInt(userId)} user={userName} />
      )} */}
    </div>
  );
};
