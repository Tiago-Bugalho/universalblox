import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { content, nome, jogo, descricao } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Nenhum conteúdo enviado' });
  }

  // Gera ID aleatório
  const id = String(Math.floor(Math.random() * 9999999) + 1).padStart(7, '0');
  const fileName = `script_${id}.html`;

  // Pasta scripts dentro do root (Vercel permite criar dentro de /tmp)
  const scriptsDir = path.join('/tmp', 'scripts');
  if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir);

  const filePath = path.join(scriptsDir, fileName);

  // Salva o script puro (conteúdo enviado)
  fs.writeFileSync(filePath, content, 'utf8');

  // URL para acessar (como Vercel não salva arquivos permanentes, use endpoint dinâmico)
  const url = `/api/abrir?id=${id}`;

  res.status(200).json({ success: true, id, url });
}
