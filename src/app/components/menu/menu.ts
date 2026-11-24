import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  nome = '';

  constructor(private usuarios: UsuariosService, private router: Router) {
    this.nome = this.usuarios.usuarioLogado()?.nome.split(' ')[0] ?? '';
  }

  sair(): void {
    this.usuarios.sair();
    this.router.navigate(['/login']);
  }
}
