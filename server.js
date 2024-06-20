const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5002;


app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
})

app.get('/todos',async(req,res) =>{
    try{
        const result = await pool.query('SELECT * FROM todos');
        res.json(result.rows);
    }catch(err){
        console.log(err.message);
    }
});
app.post('/todos', async (req, res) => {
    try {
      const { description } = req.body;
      const result = await pool.query('INSERT INTO todos (description) VALUES ($1) RETURNING *', [description]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  app.put('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { description, completed } = req.body;
      const result = await pool.query('UPDATE todos SET description = $1, completed = $2 WHERE id = $3 RETURNING *', [description, completed, id]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  app.delete('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM todos WHERE id = $1', [id]);
      res.json({ message: 'Task deleted' });
    } catch (err) {
      console.error(err.message);
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });