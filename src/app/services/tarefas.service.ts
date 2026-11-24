import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tarefa } from '../models/tarefa';
import { Resumo } from '../models/resumo';

@Injectable({ providedIn: 'root' })
export class TarefasService {
  private readonly url = `${environment.apiUrl}/tarefas`;
  readonly categorias = ['Estudo', 'Trabalho', 'Saúde', 'Pessoal'];
  readonly prioridades = ['Alta', 'Média', 'Baixa'];

  constructor(private http: HttpClient) {}

  // Lista todas as tarefas ordenadas por data e horário
  listar(): Observable<Tarefa[]> {
    const params = new HttpParams().set('_sort', 'data,horario').set('_order', 'asc,asc');
    return this.http.get<Tarefa[]>(this.url, { params });
  }

  buscarPorId(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.url}/${id}`);
  }

  // Pesquisa por texto e filtra por categoria e status
  pesquisar(texto: string, categoria: string, status: string): Observable<Tarefa[]> {
    let params = new HttpParams().set('_sort', 'data,horario').set('_order', 'asc,asc');
    if (texto.trim()) {
      params = params.set('q', texto.trim());
    }
    if (categoria) {
      params = params.set('categoria', categoria);
    }
    if (status === 'pendentes') {
      params = params.set('concluida', 'false');
    } else if (status === 'concluidas') {
      params = params.set('concluida', 'true');
    }
    return this.http.get<Tarefa[]>(this.url, { params });
  }

  cadastrar(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.url, { ...tarefa, concluida: false });
  }

  editar(id: number, tarefa: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.url}/${id}`, { ...tarefa, id });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  alternarConcluida(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.patch<Tarefa>(`${this.url}/${tarefa.id}`, { concluida: !tarefa.concluida });
  }

  // Regra de negócio: resumo da rotina para o Dashboard
  resumo(): Observable<Resumo> {
    return this.listar().pipe(map(tarefas => this.calcularResumo(tarefas)));
  }

  calcularResumo(tarefas: Tarefa[]): Resumo {
    const concluidas = tarefas.filter(t => t.concluida);
    const total = tarefas.length;
    return {
      total,
      concluidas: concluidas.length,
      pendentes: total - concluidas.length,
      percentual: total ? Math.round((concluidas.length / total) * 100) : 0,
      minutosPlanejados: tarefas.reduce((soma, t) => soma + Number(t.duracao), 0),
      minutosConcluidos: concluidas.reduce((soma, t) => soma + Number(t.duracao), 0),
      porCategoria: this.categorias.map(categoria => {
        const doTipo = tarefas.filter(t => t.categoria === categoria);
        return {
          categoria,
          quantidade: doTipo.length,
          minutos: doTipo.reduce((soma, t) => soma + Number(t.duracao), 0)
        };
      })
    };
  }

  formatarDuracao(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h === 0) {
      return `${m} min`;
    }
    return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, '0')}`;
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
