import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {
  // URL directa (igual que en tu AuthService)
  private apiUrl = 'http://127.0.0.1:6543/api/expedientes'; 

  constructor(private http: HttpClient) {}

  obtenerExpedientes() {
    return this.http.get<any>(this.apiUrl).pipe(
            map((res: any) => res.data)
        );
    }

  crearExpediente(datos: any) {
    return this.http.post(this.apiUrl, datos);
  }

  actualizarExpediente(id: number, datos: any) {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }

  eliminarExpediente(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}