import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { Menu } from '../../components/menu/menu';
import { Tarefa } from '../../models/tarefa';
import { TarefasService } from '../../services/tarefas.service';

@Component({
  selector: 'app-lista-tarefas',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Menu],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css'
})
export class ListaTarefas implements OnInit {
  tarefas: Tarefa[] = [];
  status = 'todas';
  carregando = true;
  erro = '';

  // Formulário reativo de pesquisa e filtro
  filtros;

  constructor(
    private fb: FormBuilder,
    public tarefasService: TarefasService,
    private router: Router
  ) {
    this.filtros = this.fb.nonNullable.group({
      texto: [''],
      categoria: ['']
    });
  }

  ngOnInit(): void {
    this.carregar();
    // Pesquisa automática quando o usuário digita ou troca a categoria
    this.filtros.valueChanges.pipe(debounceTime(300)).subscribe(() => this.carregar());
  }

  carregar(): void {
    this.erro = '';
    const { texto, categoria } = this.filtros.getRawValue();
    this.tarefasService.pesquisar(texto, categoria, this.status).subscribe({
      next: tarefas => {
        this.tarefas = tarefas;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar as tarefas. Confira se o JSON-Server está rodando (npm run api).';
        this.carregando = false;
      }
    });
  }

  mudarStatus(status: string): void {
    this.status = status;
    this.carregar();
  }

  pendentes(): number {
    return this.tarefas.filter(t => !t.concluida).length;
  }

  concluir(tarefa: Tarefa): void {
    this.tarefasService.alternarConcluida(tarefa).subscribe(() => this.carregar());
  }

  abrir(id?: number): void {
    this.router.navigate(['/tarefas', id]);
  }

  editar(id?: number): void {
    this.router.navigate(['/tarefas/editar', id]);
  }

  excluir(tarefa: Tarefa): void {
    if (tarefa.id && confirm(`Deseja excluir a tarefa "${tarefa.titulo}"?`)) {
      this.tarefasService.excluir(tarefa.id).subscribe(() => this.carregar());
    }
  }
}
