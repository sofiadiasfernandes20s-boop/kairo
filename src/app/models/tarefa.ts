export type Categoria = 'Estudo' | 'Trabalho' | 'Saúde' | 'Pessoal';
export type Prioridade = 'Alta' | 'Média' | 'Baixa';

export interface Tarefa {
  id?: number;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  duracao: number;
  categoria: Categoria;
  prioridade: Prioridade;
  concluida: boolean;
}
