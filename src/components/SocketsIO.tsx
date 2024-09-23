import { Component } from 'react'
import {io} from "socket.io-client";
io("http://localhost:6001/");
export class SocketsIO extends Component {
  render() {
    return (
      <div>SocketsIO</div>
    )
  }
}

export default SocketsIO