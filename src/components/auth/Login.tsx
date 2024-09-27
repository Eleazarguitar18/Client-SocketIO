import React, { useState } from "react";
import axios from "axios";
import { url_base } from "./urlbase.routes";
import { NotificationComponent } from "../NotificationComponent";
import useSocket from "../useSocket";

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
  const { connectSocket } = useSocket("http://localhost:6001");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const credenciales: Credenciales = {
      email: user,
      password: password,
    };

    try {
      const response = await axios.post(`${url_base}/login`, credenciales);
      console.log(response.data);

      // Guardar el userId y conectar al servidor de Socket.IO
      setUserId(response.data.user.id);
      setUserName(response.data.user.name);
      connectSocket(response.data.user.id);
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
      {userId && (
        <NotificationComponent id_user={parseInt(userId)} user={userName} />
      )}
    </div>
  );
};
