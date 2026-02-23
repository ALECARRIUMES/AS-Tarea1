# Assignment 03 — AWS Elastic Beanstalk + Docker + ECR + GitHub Actions (Vite + React + TS)

Despliegue de una aplicación **Vite + React + TypeScript** (UI estilo “Solo Leveling”) en **AWS Elastic Beanstalk** usando **Docker**, con entrega automatizada vía **GitHub Actions** y gestión de variables/secretos con **Doppler**.

---

##  URL de la aplicación (Elastic Beanstalk)

- **Producción (Beanstalk):**  
  `http://as-assignment-03-env.eba-y32asf3u.us-east-1.elasticbeanstalk.com/`

> Recomendación: en algunos navegadores móviles se debe abrir con `http://` explícito (no https).

---

##  Evidencias (capturas)

- UI funcionando (desktop):  
  ![alt text](image-2.png)

- UI funcionando (mobile):  
  ![alt text](image-3.png)

- Elastic Beanstalk (Environment **Green** + versión `ecr-<sha>`):  
  ![alt text](image-4.png)

- Amazon ECR (repositorio + imagen subida):  
  ![alt text](image-5.png)

- GitHub Actions (workflow exitoso):  
  ![alt text](image-6.png)

## Estructura del proyecto

- app/ → Aplicación Vite + React + TS
- .github/workflows/ → Pipelines de GitHub Actions
- Dockerfile (en app/) → Multi-stage build (Node) + Nginx serve
- nginx.conf (en app/) → SPA fallback a index.html

## Ejecución local con Docker

-  Desde la carpeta app/:
- COMANDOS:
- docker build -t as-tarea3-solo-leveling .
- docker run --rm -p 8085:80 as-tarea3-solo-leveling
- abrir = http://localhost:8085

## Despliegue en AWS (Elastic Beanstalk + Docker)

- Se creó una Application y un Environment en Elastic Beanstalk con plataforma:
- Docker running on 64bit Amazon Linux 2023
- La aplicación se despliega mediante un bundle que contiene:
- Dockerrun.aws.json (generado por GitHub Actions)
- Imagen Docker alojada en Amazon ECR

## Amazon ECR

- Se usa un repositorio privado en ECR para almacenar la imagen Docker construida por el pipeline.

- Repositorio ECR: as-tarea3-solo-leveling
- Tag típico: SHA del commit (${{ github.sha }})

## CI/CD con GitHub Actions

### Workflow:

- Archivo: .github/workflows/deploy-eb-ecr.yml
Rama objetivo: assignment-03

### Flujo:

- Checkout del repositorio
- Configurar credenciales AWS (Access Keys)
- Login a Amazon ECR
- Build + Push de imagen Docker a ECR
- Generación de Dockerrun.aws.json
- Creación de deploy.zip
- Deploy a Elastic Beanstalk con einaregilsson/beanstalk-deploy

## Secretos y variables (GitHub Actions + Doppler)

- GitHub Actions (Repository Secrets)
- Se usan los siguientes secrets (sin exponer valores):
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- EB_APPLICATION_NAME
- EB_ENVIRONMENT_NAME
- ECR_REPOSITORY

### Doppler

Se creó un proyecto assignment-03 con configs:
dev, stg, prd
Se integró Doppler con GitHub Actions para sincronización de secretos del proyecto (según configuración elegida).

## Husky + lint-staged (pre-commit)

- Se agregó validación automática antes de cada commit para mejorar calidad de código.
- Paquetes usados
- husky
- lint-staged
- eslint
- prettier
### ¿Qué hace el pre-commit?

- Ejecuta lint-staged, el cual corre validaciones (lint/format) sobre archivos staged antes de permitir el commit.

### Comandos útiles

- Instalar dependencias (en app/):
- npm i

### Ejecutar lint manual:

- npm run lint

## Autor

- Nombre: ALEJANDRO CARRILLO GARCIA

- Curso: Arquitectura de Sistemas II

- Rama: assignment-03