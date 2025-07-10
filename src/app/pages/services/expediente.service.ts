import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Expediente {
  id_expediente?: number;
  id_paciente: number;
  antecedentes: string;
  historial: string;
  seguro: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {
  private apiUrl = 'http://127.0.0.1:6543/api/expedientes';

  constructor(private http: HttpClient) {}

  // Obtener todos los expedientes
  obtenerExpedientes(): Observable<Expediente[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => response.data || [])
    );
  }

  // Obtener un expediente por ID
  obtenerExpediente(id: number): Observable<Expediente> {
    return this.http.get<Expediente>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo expediente
  crearExpediente(expediente: Omit<Expediente, 'id_expediente'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, expediente);
  }

  // Actualizar un expediente existente
  actualizarExpediente(id: number, expediente: Partial<Expediente>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, expediente);
  }

  // Eliminar un expediente
  eliminarExpediente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}