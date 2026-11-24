import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { semEspacosVazios, senhasIguais } from '../../validators/kairo.validators';

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {
  erro = '';
  sucesso = '';
  enviando = false;

  form;

  constructor(private fb: FormBuilder, private usuarios: UsuariosService, private router: Router) {
    this.form = this.fb.nonNullable.group({
      nome: ['', [Validators.required, Validators.minLength(3), semEspacosVazios]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: senhasIguais });
  }

  campoInvalido(nome: 'nome' | 'email' | 'senha' | 'confirmarSenha'): boolean {
    const campo = this.form.controls[nome];
    return campo.invalid && (campo.touched || campo.dirty);
  }

  senhasDiferentes(): boolean {
    const confirmar = this.form.controls.confirmarSenha;
    return !!this.form.errors?.['senhasDiferentes'] && (confirmar.touched || confirmar.dirty);
  }

  cadastrar(): void {
    this.erro = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    const { nome, email, senha } = this.form.getRawValue();
    this.usuarios.cadastrar({ nome: nome.trim(), email, senha }).subscribe({
      next: () => {
        this.sucesso = 'Conta criada! Agora é só entrar.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (e: Error) => {
        this.erro = e.message.includes('cadastrado') ? e.message : 'Não foi possível conectar ao servidor.';
        this.enviando = false;
      }
    });
  }
}
