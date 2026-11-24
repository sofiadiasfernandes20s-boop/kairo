export interface ResumoCategoria {
  categoria: string;
  quantidade: number;
  minutos: number;
}

export interface Resumo {
  total: number;
  concluidas: number;
  pendentes: number;
  percentual: number;
  minutosPlanejados: number;
  minutosConcluidos: number;
  porCategoria: ResumoCategoria[];
}
