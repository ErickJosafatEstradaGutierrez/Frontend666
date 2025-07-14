import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, throwError } from 'rxjs';

export interface Consulta {
  id_consulta?: number;
  id_consultorio: number;
  id_medico: number;
  id_paciente: number;
  tipo: string;
  fecha: string;
  hora: string;
  diagnostico: string;
  costo: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private apiUrl = 'http://127.0.0.1:6543/api/consultas';

  constructor(private http: HttpClient) {}

  // Obtener todas las consultas
  obtenerConsultas(): Observable<Consulta[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => response.data || [])
    );
  }

  // Obtener una consulta por ID
  obtenerConsulta(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva consulta
  crearConsulta(consulta: Omit<Consulta, 'id_consulta'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, consulta);
  }

  // Actualizar una consulta existente
  actualizarConsulta(id: number, consulta: Partial<Consulta>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, consulta).pipe(
      catchError(error => {
        console.error('Error en servicio:', error);
        return throwError(() => error);
      })
    );
  }

  // Eliminar una consulta
  eliminarConsulta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Opcional: Obtener consultas por paciente
  obtenerConsultasPorPaciente(idPaciente: number): Observable<Consulta[]> {
    return this.http.get<any>(`${this.apiUrl}/paciente/${idPaciente}`).pipe(
      map((response: any) => response.data || [])
    );
  }

  // Opcional: Obtener consultas por médico
  obtenerConsultasPorMedico(idMedico: number): Observable<Consulta[]> {
    return this.http.get<any>(`${this.apiUrl}/medico/${idMedico}`).pipe(
      map((response: any) => response.data || [])
    );
  }
}