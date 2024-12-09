import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    
    // Get today's shanty
    const { rows } = await pool.query(`
      SELECT * FROM shanties 
      WHERE DATE(play_date AT TIME ZONE 'GMT') = CURRENT_DATE AT TIME ZONE 'GMT'
    `);

    console.log('Query result:', rows); // Debug log

    // If no shanty found for today, return default
    if (!rows || rows.length === 0) {
      const defaultShanty = {
        title: "Drunken Sailor",
        line: "what shall we do with the drunken sailor",
        youtube_id: "qGyPuey-1Jw",
        play_date: new Date().toISOString().split('T')[0]
      };
      console.log('Returning default shanty:', defaultShanty); // Debug log
      return res.status(200).json(defaultShanty);
    }

    // Return found shanty
    console.log('Returning database shanty:', rows[0]); // Debug log
    return res.status(200).json(rows[0]);

  } catch (error) {
    console.error('Detailed API Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return res.status(500).json({ 
      error: 'Database error',
      details: error.message 
    });
  }
}