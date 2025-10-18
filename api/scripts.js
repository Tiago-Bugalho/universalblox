let scriptsDB = []; // Mantém todos os scripts em memória (servidor Vercel é stateless, mas funciona em sessões curtas)

export default function handler(req, res) {
  const id = req.query.id;
  const script = scriptsDB.find(s => s.id === id);
  if (!script) {
    res.status(404).send('Script não encontrado');
    return;
  }
  res.setHeader('Content-Type', 'text/plain');
  res.send(script.content);
}
