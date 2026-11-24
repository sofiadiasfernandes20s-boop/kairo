import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

// Só deixa abrir as telas internas se a pessoa tiver feito login
export const authGuard: CanActivateFn = () => {
  const usuarios = inject(UsuariosService);
  const router = inject(Router);
  return usuarios.estaLogado() ? true : router.createUrlTree(['/login']);
};
