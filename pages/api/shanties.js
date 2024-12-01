import pool from '../../lib/db';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const { rows } = await pool.query(
          'SELECT * FROM shanties WHERE play_date = CURRENT_DATE'
        );
        res.status(200).json(rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const { title, line, youtubeId, playDate } = req.body;
        await pool.query(
          'INSERT INTO shanties (title, line, youtube_id, play_date) VALUES ($1, $2, $3, $4)',
          [title, line, youtubeId, playDate]
        );
        res.status(200).json({ message: 'Shanty added' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
  }
}