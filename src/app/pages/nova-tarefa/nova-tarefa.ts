import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from '../../components/menu/menu';
import { Tarefa } from '../../models/tarefa';
import { TarefasService } from '../../services/tarefas.service';

@Component({
  selector: 'app-nova-tarefa',
  imports: [FormsModule, Menu],
  templateUrl: './nova-tarefa.html',
  styleUrl: './nova-tarefa.css'
})
export class NovaTarefa implements OnInit {
  tarefa: Tarefa = { id: 0, titulo: '', descricao: '', data: '', prioridade: 'Média', concluida: false };
  editando = false;

  constructor(
    private tarefasService: TarefasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const encontrada = this.tarefasService.buscarPorId(Number(id));
      if (encontrada) {
        this.tarefa = { ...encontrada };
        this.editando = true;
      }
    }
  }

  salvar(): void {
    if (!this.tarefa.titulo.trim()) {
      alert('Digite o título da tarefa.');
      return;
    }
    if (this.editando) {
      this.tarefasService.editar(this.tarefa);
    } else {
      this.tarefasService.adicionar(this.tarefa);
    }
    this.router.navigate(['/tarefas']);
  }

  cancelar(): void {
    this.router.navigate(['/tarefas']);
  }
}