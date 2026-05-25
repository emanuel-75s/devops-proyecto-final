const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const promBundle = require('express-prom-bundle');
require('dotenv').config();

const { initDB } = require('./db');
const doctorsRouter = require('./routes/doctors');
const patientsRouter = require('./routes/patients');
const appointmentsRouter = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de métricas para Prometheus
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

// Rutas
app.use('/api/doctors', doctorsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/appointments', appointmentsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    service: 'Clinica Médica API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la API de Clínica Médica',
    version: '1.0.0',
    endpoints: {
      doctors:      '/api/doctors',
      patients:     '/api/patients',
      appointments: '/api/appointments',
      health:       '/health',
      metrics:      '/metrics',
    },
  });
});

// Iniciar servidor
const start = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Métricas:     http://localhost:${PORT}/metrics`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

start();
