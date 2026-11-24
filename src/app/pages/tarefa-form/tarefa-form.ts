import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from '../../components/menu/menu';
import { Categoria, Prioridade, Tarefa } from '../../models/tarefa';
import { TarefasService } from '../../services/tarefas.service';
import { semEspacosVazios } from '../../validators/kairo.validators';

@Component({
  selector: 'app-tarefa-form',
  imports: [CommonModule, ReactiveFormsModule, Menu],
  templateUrl: './tarefa-form.html',
  styleUrl: './tarefa-form.css'
})
export class TarefaForm implements OnInit {
  id?: number;
  concluida = false;
  erro = '';
  enviando = false;

  form;

  constructor(
    private fb: FormBuilder,
    public tarefasService: TarefasService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.nonNullable.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60), semEspacosVazios]],
      descricao: ['', [Validators.maxLength(200)]],
      data: ['', [Validators.required]],
      horario: ['', [Validators.required]],
      duracao: [30, [Validators.required, Validators.min(5), Validators.max(600)]],
      categoria: ['' as Categoria | '', [Validators.required]],
      prioridade: ['Média' as Prioridade, [Validators.required]]
    });
  }

  get editando(): boolean {
    return this.id !== undefined;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id);
      this.tarefasService.buscarPorId(this.id).subscribe({
        next: tarefa => {
          this.concluida = tarefa.concluida;
          this.form.patchValue(tarefa);
        },
        error: () => (this.erro = 'Tarefa não encontrada.')
      });
    }
  }

  campoInvalido(nome: keyof typeof this.form.controls): boolean {
    const campo = this.form.controls[nome];
    return campo.invalid && (campo.touched || campo.dirty);
  }

  temErro(nome: keyof typeof this.form.controls, erro: string): boolean {
    return this.campoInvalido(nome) && !!this.form.controls[nome].errors?.[erro];
  }

  salvar(): void {
    this.erro = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    const valores = this.form.getRawValue();
    const tarefa: Tarefa = {
      ...valores,
      titulo: valores.titulo.trim(),
      descricao: valores.descricao.trim(),
      duracao: Number(valores.duracao),
      categoria: valores.categoria as Categoria,
      concluida: this.concluida
    };
    const pedido = this.editando
      ? this.tarefasService.editar(this.id!, tarefa)
      : this.tarefasService.cadastrar(tarefa);

    pedido.subscribe({
      next: () => this.router.navigate(['/tarefas']),
      error: () => {
        this.erro = 'Não foi possível salvar. Confira se o JSON-Server está rodando.';
        this.enviando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/tarefas']);
  }
}
