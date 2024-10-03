// type Props = {};

import { io } from "socket.io-client";

export const Login2 = () => {
  const socket = io("http://192.168.4.230:6001");
  const socketURL = "http://192.168.4.230:6001";
  return (
    <div>
      <div>{socketURL}</div>
      {/* <div>{socket.id}</div> */}
    </div>
  );
};
