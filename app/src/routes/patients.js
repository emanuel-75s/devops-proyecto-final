const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET todos los pacientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM patients ORDER BY created_at DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET paciente por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM patients WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST crear paciente
router.post('/', async (req, res) => {
  const { name, age, phone, email, address } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO patients (name, age, phone, email, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, age, phone, email, address]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT actualizar paciente
router.put('/:id', async (req, res) => {
  const { name, age, phone, email, address } = req.body;
  try {
    const result = await pool.query(
      'UPDATE patients SET name=$1, age=$2, phone=$3, email=$4, address=$5 WHERE id=$6 RETURNING *',
      [name, age, phone, email, address, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE eliminar paciente
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM patients WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
    }
    res.json({ success: true, message: 'Paciente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
