import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ihnchiyyvbowmgxaojka.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobmNoaXl5dmJvd21neGFvamthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTY1NzQsImV4cCI6MjA3NjM3MjU3NH0.70z3ndRSDIc6CS9UwTVlB44CtRbq1kRdXb-zvM3xcnw'
)

export default async function handler(req,res){
  const termo = req.query.nome || '';

  const { data, error } = await supabase
    .from('scripts')
    .select('id,nome,jogo,descricao')
    .ilike('nome', `%${termo}%`);

  if(error) return res.status(500).json({error:error.message});

  const resultados = data.map(s=>({
    id:s.id,
    nome:s.nome,
    jogo:s.jogo,
    descricao:s.descricao,
    loadstring:`loadstring(game:HttpGet("${process.env.NEXT_PUBLIC_SITE_URL}/api/abrir?id=${s.id}"))()`
  }));

  res.json(resultados);
}
