require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const prisma = require("./prisma");

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API de Tareas",
    version: "1.0.0",
    description: "API para gestionar una checklist de tareas"
  },
  servers: [
    {
      url: `http://localhost:${PORT}`
    }
  ],
  paths: {
    "/health": {
      get: {
        summary: "Verifica que la API esté funcionando",
        responses: {
          "200": {
            description: "API funcionando correctamente"
          }
        }
      }
    },
    "/api/tareas": {
      get: {
        summary: "Obtiene todas las tareas",
        responses: {
          "200": {
            description: "Lista de tareas"
          }
        }
      },
      post: {
        summary: "Crea una nueva tarea",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  titulo: {
                    type: "string"
                  }
                },
                required: ["titulo"]
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Tarea creada"
          }
        }
      }
    },
    "/api/tareas/{id}": {
      patch: {
        summary: "Actualiza una tarea",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  titulo: {
                    type: "string"
                  },
                  completada: {
                    type: "boolean"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Tarea actualizada"
          }
        }
      },
      delete: {
        summary: "Elimina una tarea",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          "200": {
            description: "Tarea eliminada"
          }
        }
      }
    }
  }
};

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    mensaje: "API funcionando correctamente"
  });
});

app.get("/api/tareas", async (req, res) => {
  try {
    const tareas = await prisma.tarea.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(tareas);
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener las tareas",
      detalle: error.message
    });
  }
});

app.post("/api/tareas", async (req, res) => {
  try {
    const { titulo } = req.body;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({
        ok: false,
        mensaje: "El título es obligatorio"
      });
    }

    const nuevaTarea = await prisma.tarea.create({
      data: {
        titulo: titulo.trim()
      }
    });

    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al crear la tarea",
      detalle: error.message
    });
  }
});

app.patch("/api/tareas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { titulo, completada } = req.body;

    const tareaActualizada = await prisma.tarea.update({
      where: { id },
      data: {
        ...(titulo !== undefined ? { titulo: titulo.trim() } : {}),
        ...(completada !== undefined ? { completada } : {})
      }
    });

    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar la tarea",
      detalle: error.message
    });
  }
});

app.delete("/api/tareas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.tarea.delete({
      where: { id }
    });

    res.json({
      ok: true,
      mensaje: "Tarea eliminada correctamente"
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar la tarea",
      detalle: error.message
    });
  }
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
  console.log(`Swagger en http://localhost:${PORT}/docs`);
});
