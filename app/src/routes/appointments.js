const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET todas las citas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
        p.name as patient_name, 
        d.name as doctor_name,
        d.specialty as doctor_specialty
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET cita por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
        p.name as patient_name, 
        d.name as doctor_name,
        d.specialty as doctor_specialty
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST crear cita
router.post('/', async (req, res) => {
  const { patient_id, doctor_id, appointment_date, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, notes) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [patient_id, doctor_id, appointment_date, notes]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT actualizar estado de cita
router.put('/:id', async (req, res) => {
  const { status, notes, appointment_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE appointments 
       SET status=$1, notes=$2, appointment_date=$3 
       WHERE id=$4 RETURNING *`,
      [status, notes, appointment_date, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE cancelar cita
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM appointments WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }
    res.json({ success: true, message: 'Cita cancelada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
