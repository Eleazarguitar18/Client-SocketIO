import axios from "axios";
import { useEffect, useState } from "react";
import { url_base } from "./auth/urlbase.routes";
type Agenda = {
  id_especialista: number;
  fecha_agenda: string;
  token: string;
  socket_id: string;
};
// interface Tarde {
//   id_asignacion: number;
//   //   datos_consultorio: DatosConsultorio;
//   horarios: Horario[];
// }
interface Horario {
  hora: string;
  estado: string; // Podría ser un enum si se conocen los valores posibles
  observacion: string;
}

export const ListAgenda = (agendaCred: Agenda) => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [status, setStatus] = useState<number>(0);
  const listAgenda = async () => {
    const response = await axios.post(
      `${url_base}/especialista/horario`,
      agendaCred,
      {
        headers: {
          Authorization: `Bearer ${agendaCred.token}`, // Agrega el token aquí
        },
      }
    );
    setStatus(response.status);
    setHorarios(response.data.mañana.horarios);
    console.log(response.data.mañana.horarios);
  };
  useEffect(() => {
    listAgenda();
  }, []);

  return (
    <div>
      <div>ListAgenda</div>
      <button onClick={listAgenda}>listar horarios</button>
      <h3>{status}</h3>
      <h3>{}</h3>
      {horarios.length > 0 ? (
        <ul>
          {horarios.map((horario, index) => (
            <div key={index}>
              <br />
              <hr />
              <li>{horario.hora}</li>
              <li>{horario.estado}</li>
              <li>{horario.observacion}</li>
            </div>
          ))}
        </ul>
      ) : (
        <div>No hay horarios</div>
      )}
    </div>
  );
};
