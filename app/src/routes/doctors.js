const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET todos los doctores
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM doctors ORDER BY created_at DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET doctor por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM doctors WHERE id = $1', 
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor no encontrado' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST crear doctor
router.post('/', async (req, res) => {
  const { name, specialty, phone, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO doctors (name, specialty, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, specialty, phone, email]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT actualizar doctor
router.put('/:id', async (req, res) => {
  const { name, specialty, phone, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE doctors SET name=$1, specialty=$2, phone=$3, email=$4 WHERE id=$5 RETURNING *',
      [name, specialty, phone, email, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor no encontrado' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE eliminar doctor
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM doctors WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor no encontrado' });
    }
    res.json({ success: true, message: 'Doctor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
