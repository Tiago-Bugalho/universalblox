let scriptsDB = []; // Mesmo banco em memória

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  const { content, nome, jogo, descricao } = req.body;
  if (!content || !nome || !jogo) return res.status(400).send('Campos obrigatórios');

  const id = Math.floor(Math.random()*9999999).toString().padStart(7,'0');
  scriptsDB.push({ id, content, nome, jogo, descricao });
  res.json({ success: true, id, url: `/api/scripts?id=${id}` });
}
