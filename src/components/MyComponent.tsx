import React, { useEffect } from "react";
import echo from "../echo"; // Importa tu configuración de Echo
interface MessageSentEvent {
  message: string;
  // Añade otros campos que esperes en el evento
}

const MyComponent: React.FC = () => {
  useEffect(() => {
    const channel = echo.channel("my-channel");
    channel.listen("MessageSent", (e: MessageSentEvent) => {
      console.log("Message received:", e);
    });

    return () => {
      channel.stopListening("MessageSent");
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Connection</h1>
    </div>
  );
};

export default MyComponent;
