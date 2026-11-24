import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { ListaTarefas } from './pages/lista-tarefas/lista-tarefas';
import { DetalheTarefa } from './pages/detalhe-tarefa/detalhe-tarefa';
import { TarefaForm } from './pages/tarefa-form/tarefa-form';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'tarefas', component: ListaTarefas, canActivate: [authGuard] },
  { path: 'tarefas/nova', component: TarefaForm, canActivate: [authGuard] },
  { path: 'tarefas/editar/:id', component: TarefaForm, canActivate: [authGuard] },
  { path: 'tarefas/:id', component: DetalheTarefa, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
