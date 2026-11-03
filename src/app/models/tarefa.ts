export interface Tarefa {
    id: number;
  titulo: string;
  descricao: string;
  data: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  concluida: boolean;
}
