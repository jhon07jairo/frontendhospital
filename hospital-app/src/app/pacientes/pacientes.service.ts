import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environtments/environment';
import { Paciente, PacienteCreate, PacienteUpdate } from './paciente.model';

@Injectable({ providedIn: 'root' })
export class PacientesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/pacientes`;

  getAll(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.baseUrl);
  }

  getById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/${id}`);
  }

  create(p: PacienteCreate): Observable<Paciente> {
    return this.http.post<Paciente>(this.baseUrl, this.toPayload(p));
  }

  update(id: number, p: PacienteUpdate): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, this.toPayload(p));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Ensure date is sent as ISO or yyyy-MM-dd depending on backend expectation
  private toPayload(p: PacienteCreate | PacienteUpdate) {
    // If nacimiento is like 'YYYY-MM-DD', keep it; if Date object, convert
    const nacimiento = (p as any).nacimiento instanceof Date
      ? (p as any).nacimiento.toISOString().substring(0, 10)
      : p.nacimiento;

    return { ...p, nacimiento };
  }
}
