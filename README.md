# Assignment 01 - Load Balancer (Round Robin) con Nginx + Docker Compose

## Diagrama de la infraestructura

### Comando para ejecutarlo en PoweShell 
(Invoke-WebRequest http://localhost:8080).Content -replace '.*<h1>(.*?)</h1>.*','$1'
### Comando para ejecutarlo en Ubuntu    
curl -s http://localhost:8080 | grep -oP 'Hola mundo desde server \d'

```mermaid
flowchart LR
  U[Usuario] --> LB[Load Balancer Nginx]
  LB --> S1[server1]
  LB --> S2[server2]

