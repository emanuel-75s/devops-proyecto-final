# Proyecto Final – Sistemas Operativos II
## Infraestructura DevOps en la Nube – Clínica San Rafael

## Descripción
Sistema de gestión médica desplegado en infraestructura cloud con prácticas DevOps completas.

## Stack Tecnológico
| Componente | Tecnología |
|------------|------------|
| Aplicación | Node.js + Express + PostgreSQL |
| Contenedores | Docker + Docker Compose |
| Orquestación | Docker Swarm |
| CI | GitHub Actions |
| CD | Jenkins |
| Registry | Docker Hub |
| Cloud | AWS EC2 (2x t3.small) |
| Monitoreo | Prometheus + Grafana + Node Exporter |
| Seguridad | Nginx + HTTPS + SSL (Let's Encrypt) |
| Dominio | clinica-medica.mooo.com |

## URLs del Proyecto
- **Aplicación:** https://clinica-medica.mooo.com
- **API Health:** https://clinica-medica.mooo.com/health
- **Prometheus:** http://3.151.151.43:9090
- **Grafana:** http://3.151.151.43:3001
- **Jenkins:** http://3.147.162.203:8080
- **Docker Hub:** https://hub.docker.com/r/emanuelsalama75/clinica-medica-api

## Arquitectura
- VM1 (3.151.151.43): App + Docker Swarm Manager + Nginx + Prometheus + Grafana
- VM2 (3.147.162.203): Jenkins CI/CD

## Endpoints API
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/doctors | Listar doctores |
| POST | /api/doctors | Crear doctor |
| GET | /api/patients | Listar pacientes |
| POST | /api/patients | Crear paciente |
| GET | /api/appointments | Listar citas |
| POST | /api/appointments | Crear cita |
| GET | /health | Estado del sistema |
| GET | /metrics | Métricas Prometheus |

## Pipeline CI/CD
1. Push a GitHub → GitHub Actions construye imagen Docker
2. Imagen subida a Docker Hub
3. Jenkins detecta cambio → despliega en Docker Swarm
4. 2 réplicas de la app corriendo en producción

## Monitoreo
- Prometheus recolecta métricas cada 15 segundos
- Grafana dashboard muestra CPU, memoria, red y disco en tiempo real
- Node Exporter expone métricas del servidor

## Integrante
- Sergio Emanuel Salama
