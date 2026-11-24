import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly url = `${environment.apiUrl}/usuarios`;
  private readonly chave = 'kairo-usuario';

  constructor(private http: HttpClient) {}

  // Confere e-mail e senha na API
  entrar(email: string, senha: string): Observable<Usuario> {
    const params = new HttpParams().set('email', email.toLowerCase());
    return this.http.get<Usuario[]>(this.url, { params }).pipe(
      map(usuarios => {
        const usuario = usuarios.find(u => u.senha === senha);
        if (!usuario) {
          throw new Error('E-mail ou senha incorretos.');
        }
        this.salvarSessao(usuario);
        return usuario;
      })
    );
  }

  // Regra de negócio: não deixa cadastrar dois usuários com o mesmo e-mail
  cadastrar(usuario: Usuario): Observable<Usuario> {
    const email = usuario.email.toLowerCase();
    const params = new HttpParams().set('email', email);
    return this.http.get<Usuario[]>(this.url, { params }).pipe(
      switchMap(existentes => {
        if (existentes.length > 0) {
          return throwError(() => new Error('Este e-mail já está cadastrado.'));
        }
        return this.http.post<Usuario>(this.url, { ...usuario, email });
      })
    );
  }

  usuarioLogado(): Usuario | null {
    const salvo = localStorage.getItem(this.chave);
    return salvo ? JSON.parse(salvo) : null;
  }

  estaLogado(): boolean {
    return this.usuarioLogado() !== null;
  }

  sair(): void {
    localStorage.removeItem(this.chave);
  }

  private salvarSessao(usuario: Usuario): void {
    const { senha, ...semSenha } = usuario;
    localStorage.setItem(this.chave, JSON.stringify(semSenha));
  }
}
