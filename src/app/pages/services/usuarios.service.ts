import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://127.0.0.1:6543/api/usuarios';

  constructor(private http: HttpClient) {}

  obtenerMedicos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/medicos`);
  }

  obtenerPacientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/pacientes`);
  }
}
