import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Menu } from '../../components/menu/menu';
import { Tarefa } from '../../models/tarefa';
import { TarefasService } from '../../services/tarefas.service';

@Component({
  selector: 'app-detalhe-tarefa',
  imports: [CommonModule, RouterLink, Menu],
  templateUrl: './detalhe-tarefa.html',
  styleUrl: './detalhe-tarefa.css'
})
export class DetalheTarefa implements OnInit {
  tarefa?: Tarefa;
  erro = '';

  constructor(
    public tarefasService: TarefasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tarefasService.buscarPorId(id).subscribe({
      next: tarefa => (this.tarefa = tarefa),
      error: () => (this.erro = 'Tarefa não encontrada.')
    });
  }

  concluir(): void {
    if (this.tarefa) {
      this.tarefasService.alternarConcluida(this.tarefa).subscribe(t => (this.tarefa = t));
    }
  }

  excluir(): void {
    if (this.tarefa?.id && confirm(`Deseja excluir a tarefa "${this.tarefa.titulo}"?`)) {
      this.tarefasService.excluir(this.tarefa.id).subscribe(() => this.router.navigate(['/tarefas']));
    }
  }
}
