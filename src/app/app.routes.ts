import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { ListaTarefas } from './pages/lista-tarefas/lista-tarefas';
import { NovaTarefa } from './pages/nova-tarefa/nova-tarefa';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'tarefas', component: ListaTarefas },
  { path: 'tarefas/nova', component: NovaTarefa },
  { path: 'tarefas/editar/:id', component: NovaTarefa },
  { path: '**', redirectTo: 'login' }
];