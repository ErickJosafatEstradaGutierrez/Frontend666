// \src\app\pages\services\consultorios.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Consultorio {
  id: number;
  id_medico: number;
  tipo: string;
  ubicacion: string;
  nombre: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultoriosService {
  private apiUrl = 'http://127.0.0.1:6543/api/consultorios';

  constructor(private http: HttpClient) {}

  // Obtener todos los consultorios
  obtenerConsultorios(): Observable<Consultorio[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => response.data || [])
    );
  }

  // Obtener un consultorio por ID
  obtenerConsultorio(id: number): Observable<Consultorio> {
    return this.http.get<Consultorio>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  // Crear un nuevo consultorio
  crearConsultorio(consultorio: Omit<Consultorio, 'id_consultorio'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, consultorio);
  }

  // Actualizar un consultorio existente
  actualizarConsultorio(id: number, consultorio: Partial<Consultorio>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, consultorio);
  }

  // Eliminar un consultorio
  eliminarConsultorio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Obtener consultorios disponibles (similar a tu endpoint GetConsultoriosDisponibles)
  obtenerConsultoriosDisponibles(): Observable<Consultorio[]> {
    return this.http.get<any>(`${this.apiUrl}/disponibles`).pipe(
      map((response: any) => response.data || [])
    );
  }
}