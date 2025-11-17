const express = require('express');
const path = require('path');

const app = express();

const p = 3000;

app.use(express.static(path.join(__dirname, 'public')));

function doStuff(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}

app.get('/', doStuff);

app.listen(p, () => {
  const msg = `Server running on port ${p}`;
  // CORREÇÃO 'no-console':
  // Desabilitamos a regra do ESLint apenas para esta linha,
  // pois este console.log é útil para sabermos que o server subiu.
  // eslint-disable-next-line no-console
  console.log(msg);
});
