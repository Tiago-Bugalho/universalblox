const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Pastas públicas
app.use(express.static('public'));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use(bodyParser.json());

// Criar pastas/arquivo se não existirem
const scriptsDir = path.join(__dirname, 'scripts');
if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir);

const metadataFile = path.join(__dirname, 'scripts.json');
if (!fs.existsSync(metadataFile)) fs.writeFileSync(metadataFile, JSON.stringify([]));

// Função para gerar ID
function gerarID() {
  return String(Math.floor(Math.random() * 9999999)).padStart(7, '0');
}

// Publicar script
app.post('/api/publicar', (req, res) => {
  const { content, nome, jogo, descricao } = req.body;
  if(!content || !nome || !jogo) return res.status(400).json({ error: 'Campos obrigatórios' });

  const id = gerarID();
  const fileName = `script_${id}.html`;
  const filePath = path.join(scriptsDir, fileName);

  fs.writeFileSync(filePath, content, 'utf8');

  const scriptsData = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  scriptsData.push({
    id,
    fileName,
    nome,
    jogo,
    descricao,
    loadstring: `loadstring(game:HttpGet("/scripts/${fileName}"))()`
  });
  fs.writeFileSync(metadataFile, JSON.stringify(scriptsData, null, 2));

  res.json({ success: true, id });
});

// Abrir script puro
app.get('/api/abrir', (req, res) => {
  const id = req.query.id;
  if(!id) return res.status(400).send('ID não fornecido');

  const scriptsData = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  const script = scriptsData.find(s => s.id === id);
  if(!script) return res.status(404).send('Script não encontrado');

  const content = fs.readFileSync(path.join(scriptsDir, script.fileName), 'utf8');
  res.setHeader('Content-Type', 'text/plain');
  res.send(content);
});

// Pesquisar scripts
app.get('/api/pesquisar', (req, res) => {
  const termo = req.query.nome?.toLowerCase() || '';
  const scriptsData = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  const resultados = scriptsData.filter(s => s.nome.toLowerCase().includes(termo));
  res.json(resultados);
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
