# Assignment 01 - Load Balancer (Round Robin) con Nginx + Docker Compose

## Diagrama de la infraestructura

```mermaid
flowchart LR
  U[Usuario] --> LB[Load Balancer Nginx]
  LB --> S1[server1]
  LB --> S2[server2]

