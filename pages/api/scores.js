import pool from '../../lib/db';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const { rows } = await pool.query(
          'SELECT * FROM scores WHERE DATE(created_at) = CURRENT_DATE ORDER BY score DESC LIMIT 10'
        );
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, score } = req.body;
        await pool.query(
          'INSERT INTO scores (name, score, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)',
          [name, score]
        );
        res.status(200).json({ message: 'Score added' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
  }
}