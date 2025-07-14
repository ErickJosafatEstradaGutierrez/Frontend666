// \src\app\pages\services\consultorios.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
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

  obtenerConsultorios(): Observable<Consultorio[]> {
    return this.http.get<Consultorio[]>(this.apiUrl).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response.map((item: any) => ({
            id: item.id_consultorio || item.id,
            id_medico: item.id_medico,
            tipo: item.tipo,
            ubicacion: item.ubicacion,
            nombre: item.nombre,
            telefono: item.telefono
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener consultorios:', error);
        return throwError(() => error);
      })
    );
  }

  obtenerConsultorio(id: number): Observable<Consultorio> {
    return this.http.get<Consultorio>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => ({
        id: response.id_consultorio || response.id,
        id_medico: response.id_medico,
        tipo: response.tipo,
        ubicacion: response.ubicacion,
        nombre: response.nombre,
        telefono: response.telefono
      })),
      catchError(error => {
        console.error('Error al obtener consultorio:', error);
        return throwError(() => error);
      })
    );
  }

  crearConsultorio(datos: any): Observable<any> {
    // Convertir id_medico a número
    const datosParaEnviar = {
      id_medico: Number(datos.id_medico),
      tipo: datos.tipo,
      ubicacion: datos.ubicacion,
      nombre: datos.nombre,
      telefono: datos.telefono
    };

    return this.http.post(`${this.apiUrl}`, datosParaEnviar).pipe(
      catchError(error => {
        console.error('Error completo:', error);
        return throwError(() => error);
      })
    );
  }

  actualizarConsultorio(id: number, datos: any): Observable<any> {
    const { id: _, ...datosParaEnviar } = datos;
    return this.http.put(`${this.apiUrl}/${id}`, datosParaEnviar);
  }

  eliminarConsultorio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar consultorio:', error);
        return throwError(() => error);
      })
    );
  }

  obtenerConsultoriosDisponibles(): Observable<Consultorio[]> {
    return this.http.get<any>(`${this.apiUrl}/disponibles`).pipe(
      map((response: any) => {
        if (Array.isArray(response.data || response)) {
          return (response.data || response).map((item: any) => ({
            id: item.id_consultorio || item.id,
            nombre: item.nombre,
            tipo: item.tipo,
            ubicacion: item.ubicacion
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener consultorios disponibles:', error);
        return throwError(() => error);
      })
    );
  }
}