// src/app/pages/services/horario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Horario {
  id_horario?: number;
  id_consultorio: number;
  id_medico: number;
  id_consulta: number | null;
  turno: string;
  dia: string;
}

interface HorarioResponse {
  data: Horario[];
}

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = 'http://127.0.0.1:6543/api/horarios';

  constructor(private http: HttpClient) {}

  obtenerHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl);
  }


  obtenerHorario(id: number): Observable<Horario> {
    return this.http.get<Horario>(`${this.apiUrl}/${id}`);
  }

  crearHorario(horario: Omit<Horario, 'id_horario'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, horario);
  }

  actualizarHorario(id: number, horario: Partial<Horario>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, horario);
  }

  eliminarHorario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}