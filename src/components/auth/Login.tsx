import React, { useEffect, useState } from "react";
import axios from "axios";
import { url_base, url_base_socket } from "./urlbase.routes";
import { io, Socket } from "socket.io-client";
import { ListAgenda } from "../ListAgenda";

type Credenciales = {
  email: string;
  password: string;
};
// type User = {};
export const Login: React.FC = () => {
  // const socket = useSocket(url_base_socket);

  const [user, setUser] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [socket_id, setSocketId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [shouldUpdateAgenda, setShouldUpdateAgenda] = useState<boolean>(false);
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (userId && userName) {
      console.log("Valores actualizados:", userId, userName);
      // Aquí puedes hacer cualquier acción que necesite los valores actualizados
    }
  }, [userId, userName]);
  const conexionSocket = async (urlsocket: string, idusuario: number) => {
    const socket: Socket = io(urlsocket);

    socket.on("connect", () => {
      // console.log(socket_id, userId, userName);

      const id = socket.id; // Captura el valor de socket.id
      if (id) {
        // Asegurarse de que id no sea undefined
        setSocketId(id); // Actualiza el estado solo si id tiene un valor
        // console.log(`Este es el id de la conexion: ${id}`);
        // Enviar datos al servidor inmediatamente después de conectarse
        socket.emit("registerUser", { userId: idusuario, socketId: id });
      }
      // console.log(`Este es el id de la conexion: ${socket.id}`);
    });
    socket.on("agenda", (data) => {
      console.log("dice el server que se agrego una agenda en la bd :v");
      if (data && data.message) {
        console.log("Mensaje recibido:", data.message);
        // Puedes actualizar el estado o realizar otras acciones con el mensaje recibido
      } else {
        console.error("Datos no válidos recibidos:", data);
      }
      setKey((prevKey) => prevKey + 1);
    });
    socket.on("conexionID", (data) => {
      console.log("El ID de la conexion es: ", data);
      // setShouldUpdateAgenda(true);
    });
    socket.on("registrationError", (data: any) => {
      console.log("ocurrio un error", data);
    });
    // console.log(`Este es el id de la conexion: ${socket.id}`);
  };

  // Asegúrate de incluir socket aquí

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
        setToken(response.data.access_token);
        await conexionSocket(url_base_socket, response.data.user.id);
        setShouldUpdateAgenda(true);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };
  const llenarDatos = () => {
    setUser("ecruzm-ext-95");
    setPassword("14478925");
  };
  return (
    <div>
      <button onClick={llenarDatos}>Llenar datos</button>
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
      {shouldUpdateAgenda && (
        <ListAgenda
          key={key} //
          fecha_agenda="2024-10-08"
          id_especialista={2}
          token={token!}
          socket_id={socket_id!}
        />
      )}
    </div>
  );
};
