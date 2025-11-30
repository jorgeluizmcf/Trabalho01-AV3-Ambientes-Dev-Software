const express = require('express');
const path = require('path');

const app = express();

const PORT = 3000; // Nome descritivo para a porta do servidor.

app.use(express.static(path.join(__dirname, 'public')));

// Função: Serve o arquivo index.html principal.
function serveIndexHtml(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}

app.get('/', serveIndexHtml);

app.listen(PORT, () => {
  const msg = `Server running on port ${PORT}`;
  // eslint-disable-next-line no-console
  console.log(msg);
});
