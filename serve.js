import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 80;

// Habilita CORS para todas as origens
app.use(cors());

// Serve arquivos estáticos do diretório dist
app.use(express.static(join(__dirname, 'dist')));

// Todas as outras rotas retornam o index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Frontend rodando em http://0.0.0.0:${port}`);
});
