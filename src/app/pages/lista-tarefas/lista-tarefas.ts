import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Menu } from '../../components/menu/menu';
import { Tarefa } from '../../models/tarefa';
import { TarefasService } from '../../services/tarefas.service';

@Component({
  selector: 'app-lista-tarefas',
  imports: [CommonModule, FormsModule, RouterLink, Menu],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css'
})
export class ListaTarefas implements OnInit {
  tarefas: Tarefa[] = [];
  textoPesquisa = '';

  constructor(private tarefasService: TarefasService, private router: Router) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.tarefas = this.tarefasService.pesquisar(this.textoPesquisa);
  }

  pendentes(): number {
    return this.tarefas.filter(t => !t.concluida).length;
  }

  concluir(id: number): void {
    this.tarefasService.alternarConcluida(id);
    this.carregar();
  }

  editar(id: number): void {
    this.router.navigate(['/tarefas/editar', id]);
  }

  excluir(id: number): void {
    if (confirm('Deseja excluir esta tarefa?')) {
      this.tarefasService.excluir(id);
      this.carregar();
    }
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}