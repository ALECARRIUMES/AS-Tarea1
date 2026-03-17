import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [cargando, setCargando] = useState(false);

  const obtenerTareas = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/api/tareas`);
      const datos = await respuesta.json();
      setTareas(datos);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const crearTarea = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) return;

    setCargando(true);

    try {
      await fetch(`${API_URL}/api/tareas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo })
      });

      setTitulo("");
      await obtenerTareas();
    } catch (error) {
      console.error("Error al crear tarea:", error);
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, completada) => {
    try {
      await fetch(`${API_URL}/api/tareas/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ completada: !completada })
      });

      await obtenerTareas();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await fetch(`${API_URL}/api/tareas/${id}`, {
        method: "DELETE"
      });

      await obtenerTareas();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  return (
    <main className="contenedor">
      <section className="panel">
        <h1>Checklist de tareas</h1>
        <p>Frontend conectado al backend y a PostgreSQL</p>

        <form onSubmit={crearTarea} className="formulario">
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

        <ul className="lista">
          {tareas.length === 0 ? (
            <li className="vacio">No hay tareas todavía</li>
          ) : (
            tareas.map((tarea) => (
              <li key={tarea.id} className="tarea">
                <span className={tarea.completada ? "texto completada" : "texto"}>
                  {tarea.titulo}
                </span>

                <div className="acciones">
                  <button onClick={() => cambiarEstado(tarea.id, tarea.completada)}>
                    {tarea.completada ? "Desmarcar" : "Completar"}
                  </button>
                  <button onClick={() => eliminarTarea(tarea.id)}>
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
