import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  erro = '';
  enviando = false;

  form;

  constructor(private fb: FormBuilder, private usuarios: UsuariosService, private router: Router) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  campoInvalido(nome: 'email' | 'senha'): boolean {
    const campo = this.form.controls[nome];
    return campo.invalid && (campo.touched || campo.dirty);
  }

  entrar(): void {
    this.erro = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    const { email, senha } = this.form.getRawValue();
    this.usuarios.entrar(email, senha).subscribe({
      next: () => this.router.navigate(['/tarefas']),
      error: (e: Error) => {
        this.erro = e.message.includes('incorretos') ? e.message : 'Não foi possível conectar ao servidor. O JSON-Server está rodando?';
        this.enviando = false;
      }
    });
  }
}
