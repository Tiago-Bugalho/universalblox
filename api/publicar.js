import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ihnchiyyvbowmgxaojka.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobmNoaXl5dmJvd21neGFvamthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTY1NzQsImV4cCI6MjA3NjM3MjU3NH0.70z3ndRSDIc6CS9UwTVlB44CtRbq1kRdXb-zvM3xcnw'
)

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Método não permitido'});
  const { content, nome, jogo, descricao } = req.body;
  if(!content || !nome || !jogo) return res.status(400).json({error:'Campos obrigatórios'});

  const { data,error } = await supabase
    .from('scripts')
    .insert([{content,nome,jogo,descricao}])
    .select();

  if(error) return res.status(500).json({error:error.message});

  const id = data[0].id;
  res.status(200).json({success:true,id});
}
