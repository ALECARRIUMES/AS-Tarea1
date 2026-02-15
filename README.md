@"
# Assignment 01 - Load Balancer (Round Robin) con Nginx + Docker Compose

## Diagrama de la infraestructura

```mermaid
flowchart LR
  U[Usuario / Browser / Curl] -->|http://localhost:8080| LB[Nginx Load Balancer]
  LB --> S1[server1: Nginx (Hola mundo desde server 1)]
  LB --> S2[server2: Nginx (Hola mundo desde server 2)]
