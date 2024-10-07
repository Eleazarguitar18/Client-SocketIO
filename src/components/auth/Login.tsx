import React, { useEffect, useState } from "react";
import axios from "axios";
import { url_base, url_base_socket } from "./urlbase.routes";
// import { NotificationComponent } from "../NotificationComponent";
import { io, Socket } from "socket.io-client";
import { ListAgenda } from "../ListAgenda";
// import useSocket from "../hooks/useSocket";
// import useSocket from "../useSocket";

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
  // const { connectSocket } = useSocket("http://localhost:6001");
  // useEffect(() => {
  //   setShouldUpdateAgenda(true);
  // }, [shouldUpdateAgenda]);

  // useEffect(() => {
  //   if (socket) {
  //     // Escucha un evento cuando el socket esté listo

  //     socket.on("connect", () => {
  //       console.log(socket_id, userId, userName);

  //       const id = socket.id; // Captura el valor de socket.id
  //       if (id) {
  //         // Asegurarse de que id no sea undefined
  //         setSocketId(id); // Actualiza el estado solo si id tiene un valor
  //         console.log(`Este es el id de la conexion: ${id}`);
  //         // Enviar datos al servidor inmediatamente después de conectarse
  //         if (userId) {
  //           socket.emit("registerUser", { userId, socketId: id });
  //         }
  //       }
  //       // console.log(`Este es el id de la conexion: ${socket.id}`);
  //     });
  //     socket.on("agenda", () => {
  //       console.log("dice el server que se agrego una agenda en la bd :v");
  //       setShouldUpdateAgenda(false);
  //       setShouldUpdateAgenda(true);
  //     });
  //     socket.on("conexionID", (data) => {
  //       console.log("El servidor envia el Id de la conexion: ", data);
  //       // setShouldUpdateAgenda(true);
  //     });
  //   }
  //   // Limpia el listener cuando el componente se desmonta
  //   return () => {
  //     if (socket) {
  //       // socket.off("connect");
  //       socket.off("agenda");
  //       socket.off("conexionID");
  //     }
  //   };
  // }, [socket, userId]);
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
    socket.on("agenda", () => {
      console.log("dice el server que se agrego una agenda en la bd :v");
      setKey((prevKey) => prevKey + 1);
    });
    socket.on("conexionID", (data) => {
      console.log("El ID de la conexion es: ", data);
      // setShouldUpdateAgenda(true);
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
        // console.log(socket_id, userId, userName);
        // console.log(response.data.user.name);
        // console.log(response.data.user.id);
        // console.log(response.data);

        // if (socket) {
        //   socket.connect(); // Conecta el socket manualmente
        // }
        // conexionSocket(response.data.user.id);
        await conexionSocket(url_base_socket, response.data.user.id);
        // console.log({
        //   id_socket: socket_id,
        //   id_user: userId,
        //   user: userName,
        // });
        // Conectar al socket después del inicio de sesión exitoso
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
      {/* {userId && (
        <NotificationComponent id_user={parseInt(userId)} user={userName} />
      )} */}
      {/* Renderiza ListAgenda cuando se actualice el estado */}
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
