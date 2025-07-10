import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Receta {
  id_receta?: number;
  id_consultorio: number;
  id_medico: number;
  id_paciente: number;
  fecha: string; // o podrías usar Date si lo conviertes adecuadamente
  medicamento: string;
  dosis: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = 'http://localhost:6543/api/recetas';

  constructor(private http: HttpClient) {}

  // Obtener todas las recetas
  obtenerTodas(): Observable<Receta[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => response.data || [])
    );
  }

  // Obtener una receta por ID
  obtenerUna(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  // Crear una nueva receta
  crear(receta: Omit<Receta, 'id_receta'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, receta);
  }

  // Actualizar una receta existente
  actualizar(id: number, receta: Partial<Receta>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, receta);
  }

  // Eliminar una receta
  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}