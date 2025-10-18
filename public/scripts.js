async function publicarScript(content, nome, jogo, descricao){
  const res = await fetch('/api/publicar', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({content, nome, jogo, descricao})
  });
  return res.json();
}

function gerarLoadstring(url){
  return `loadstring(game:HttpGet("${url}"))()`;
}
