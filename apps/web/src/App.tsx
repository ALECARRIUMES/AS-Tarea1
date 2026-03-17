import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const obtenerTareas = async () => {
    try {
      setMensajeError("");

      const respuesta = await fetch(`${API_URL}/api/tareas`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener las tareas");
      }

      const datos: Tarea[] = await respuesta.json();
      setTareas(datos);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setMensajeError("No se pudo conectar con la API.");
    }
  };

  const crearTarea = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (!titulo.trim()) return;

    try {
      setCargando(true);
      setMensajeError("");

      const respuesta = await fetch(`${API_URL}/api/tareas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          titulo: titulo.trim()
        })
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo crear la tarea");
      }

      setTitulo("");
      await obtenerTareas();
    } catch (error) {
      console.error("Error al crear tarea:", error);
      setMensajeError("No se pudo crear la tarea.");
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (tarea: Tarea) => {
    try {
      setMensajeError("");

      const respuesta = await fetch(`${API_URL}/api/tareas/${tarea.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completada: !tarea.completada
        })
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo actualizar la tarea");
      }

      await obtenerTareas();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      setMensajeError("No se pudo actualizar la tarea.");
    }
  };

  const eliminarTarea = async (id: number) => {
    try {
      setMensajeError("");

      const respuesta = await fetch(`${API_URL}/api/tareas/${id}`, {
        method: "DELETE"
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar la tarea");
      }

      await obtenerTareas();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      setMensajeError("No se pudo eliminar la tarea.");
    }
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  return (
    <main className="contenedor">
      <section className="panel">
        <div className="encabezado">
          <h1>Checklist de tareas</h1>
          <p>Frontend conectado con Express, Prisma y PostgreSQL</p>
        </div>

        <form className="formulario" onSubmit={crearTarea}>
          <input
            type="text"
            placeholder="Escribe una tarea"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : "Agregar"}
          </button>
        </form>

        {mensajeError ? <div className="alerta">{mensajeError}</div> : null}

        <ul className="lista">
          {tareas.length === 0 ? (
            <li className="vacio">No hay tareas registradas todavía.</li>
          ) : (
            tareas.map((tarea) => (
              <li key={tarea.id} className="tarea">
                <span className={tarea.completada ? "texto completada" : "texto"}>
                  {tarea.titulo}
                </span>

                <div className="acciones">
                  <button
                    type="button"
                    className="secundario"
                    onClick={() => cambiarEstado(tarea)}
                  >
                    {tarea.completada ? "Desmarcar" : "Completar"}
                  </button>

                  <button
                    type="button"
                    className="peligro"
                    onClick={() => eliminarTarea(tarea.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}

export default App;