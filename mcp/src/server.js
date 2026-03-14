const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/mcp/status', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', type: 'mcp stub Server' });
});

app.post('/mcp/context', (req, res) => {
  const payload = req.body || {};
  const response = {
    message: 'MCP receive',
    payload,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`MCP endpoint at http://localhost:${PORT}`);
});
