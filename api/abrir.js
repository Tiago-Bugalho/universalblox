import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ihnchiyyvbowmgxaojka.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobmNoaXl5dmJvd21neGFvamthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTY1NzQsImV4cCI6MjA3NjM3MjU3NH0.70z3ndRSDIc6CS9UwTVlB44CtRbq1kRdXb-zvM3xcnw'
)

export default async function handler(req,res){
  const id=req.query.id;
  if(!id) return res.status(400).send('ID não fornecido');

  const { data, error } = await supabase
    .from('scripts')
    .select('content')
    .eq('id',id)
    .single();

  if(error || !data) return res.status(404).send('Script não encontrado');

  res.setHeader('Content-Type','text/plain');
  res.send(data.content);
}
