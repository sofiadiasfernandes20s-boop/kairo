import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menu } from '../../components/menu/menu';
import { Resumo } from '../../models/resumo';
import { TarefasService } from '../../services/tarefas.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Menu],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  resumo?: Resumo;
  erro = '';

  constructor(public tarefasService: TarefasService) {}

  ngOnInit(): void {
    this.tarefasService.resumo().subscribe({
      next: resumo => (this.resumo = resumo),
      error: () => (this.erro = 'Não foi possível carregar o resumo. O JSON-Server está rodando?')
    });
  }

  largura(minutos: number): number {
    const maior = Math.max(...(this.resumo?.porCategoria.map(c => c.minutos) ?? [0]), 1);
    return Math.round((minutos / maior) * 100);
  }
}
