import { Injectable } from '@angular/core';
import { Tarefa } from '../models/tarefa';

@Injectable({ providedIn: 'root' })
export class TarefasService {
  private tarefas: Tarefa[] = [
    { id: 1, titulo: 'Estudar Cálculo 2', descricao: 'Revisar integrais', data: '2026-11-05', prioridade: 'Alta', concluida: false },
    { id: 2, titulo: 'Academia', descricao: 'Treino de pernas', data: '2026-11-04', prioridade: 'Média', concluida: true },
    { id: 3, titulo: 'Gravar vídeos', descricao: 'Gravação das 15h às 16h30', data: '2026-11-06', prioridade: 'Alta', concluida: false },
    { id: 4, titulo: 'Ler 10 páginas', descricao: 'Leitura antes de dormir', data: '2026-11-07', prioridade: 'Baixa', concluida: false }
  ];
  private proximoId = 5;

  listar(): Tarefa[] {
    return this.tarefas;
  }

  buscarPorId(id: number): Tarefa | undefined {
    return this.tarefas.find(t => t.id === id);
  }

  pesquisar(texto: string): Tarefa[] {
    const busca = texto.toLowerCase();
    return this.tarefas.filter(t =>
      t.titulo.toLowerCase().includes(busca) ||
      t.descricao.toLowerCase().includes(busca)
    );
  }

  adicionar(tarefa: Tarefa): void {
    tarefa.id = this.proximoId++;
    this.tarefas.push(tarefa);
  }

  editar(tarefa: Tarefa): void {
    const i = this.tarefas.findIndex(t => t.id === tarefa.id);
    if (i !== -1) {
      this.tarefas[i] = tarefa;
    }
  }

  excluir(id: number): void {
    this.tarefas = this.tarefas.filter(t => t.id !== id);
  }

  alternarConcluida(id: number): void {
    const tarefa = this.buscarPorId(id);
    if (tarefa) {
      tarefa.concluida = !tarefa.concluida;
    }
  }
}
