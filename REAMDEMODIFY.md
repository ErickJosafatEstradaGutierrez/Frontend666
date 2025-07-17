# Configuración de Backend y Base de Datos

Esta guía explica cómo modificar los archivos de configuración para cambiar la URL del backend y adaptarse a diferentes configuraciones de base de datos.

## 📋 Archivos a Modificar

### 1. Services (*.service.ts)

Todos los servicios tienen una propiedad `apiUrl` que debe ser actualizada:

```typescript
// En todos los archivos *.service.ts
private apiUrl = 'http://127.0.0.1:6543'; // ⚠️ CAMBIAR ESTA URL
```

**Archivos que contienen esta configuración:**
- `auth.service.ts`
- `consulta.service.ts`
- `consultorios.service.ts`
- `expediente.service.ts`
- `horario.service.ts`
- `receta.service.ts`

### 2. Interceptor (auth.interceptor.ts)

El interceptor no requiere cambios de URL, ya que intercepta automáticamente todas las peticiones HTTP.

### 3. Guard (auth.guard.ts)

El guard no requiere cambios de URL, ya que utiliza el `TokenService` para validar autenticación.

## 🔧 Pasos para Cambiar la Configuración

### Paso 1: Actualizar URL del Backend

Reemplaza `http://127.0.0.1:6543` por la URL de tu backend en todos los servicios:

```typescript
// Ejemplo: Cambiar a producción
private apiUrl = 'https://mi-api.com/api';

// Ejemplo: Cambiar a otro puerto local
private apiUrl = 'http://localhost:8080/api';

// Ejemplo: Cambiar a IP específica
private apiUrl = 'http://192.168.1.100:3000/api';
```

### Paso 2: Verificar Endpoints

Algunos servicios tienen endpoints específicos. Asegúrate de que coincidan con tu backend:

```typescript
// auth.service.ts
login(data: LoginData): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, data); // Verificar endpoint
}

// consulta.service.ts
private apiUrl = 'http://127.0.0.1:6543/api/consultas'; // Verificar ruta completa
```

### Paso 3: Adaptaciones para Diferentes Backends

#### Si tu backend usa diferente estructura de respuesta:

```typescript
// Ejemplo actual (Go backend)
obtenerConsultas(): Observable<Consulta[]> {
  return this.http.get<any>(this.apiUrl).pipe(
    map((response: any) => response.data || []) // ← Cambiar según tu estructura
  );
}

// Ejemplo para backend que retorna array directo
obtenerConsultas(): Observable<Consulta[]> {
  return this.http.get<any>(this.apiUrl).pipe(
    map((response: any) => response || []) // ← Sin .data
  );
}
```

#### Si tu backend usa diferentes nombres de campos:

```typescript
// auth.service.ts - Ajustar según respuesta de tu backend
tap((response: any) => {
  if (response.Data && response.Data[0]) { // ← Cambiar estructura
    const authData = response.Data[0];
    this.tokenService.setToken(authData.access_token); // ← Cambiar nombres
  }
})
```

## 🌐 Configuración por Entorno

### Crear archivo de configuración centralizada:

```typescript
// src/app/config/api.config.ts
export const API_CONFIG = {
  baseUrl: 'http://127.0.0.1:6543',
  endpoints: {
    auth: '/login',
    consultas: '/api/consultas',
    consultorios: '/api/consultorios',
    expedientes: '/api/expedientes',
    horarios: '/api/horarios',
    recetas: '/api/recetas'
  }
};
```

### Usar la configuración en servicios:

```typescript
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = API_CONFIG.baseUrl; // ← Usar configuración centralizada
  
  login(data: LoginData): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_CONFIG.endpoints.auth}`, data);
  }
}
```

## 🔐 Configuración de Autenticación

### Si tu backend usa diferentes headers:

```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token.trim()}`), // ← Cambiar formato si necesario
      // headers: req.headers.set('X-Auth-Token', token.trim()), // Ejemplo alternativo
    });
    return next(cloned);
  }

  return next(req);
};
```

## 📝 Lista de Verificación

- [ ] Actualizar `apiUrl` en todos los servicios
- [ ] Verificar endpoints específicos
- [ ] Adaptar estructura de respuestas
- [ ] Ajustar nombres de campos según backend
- [ ] Verificar headers de autenticación
- [ ] Probar todas las funcionalidades

## 🚨 Notas Importantes

1. **Consistency**: Asegúrate de que todos los servicios usen la misma URL base
2. **CORS**: Verifica que tu backend permita conexiones desde tu dominio frontend
3. **HTTPS**: En producción, usa siempre HTTPS
4. **Environment**: Considera usar variables de entorno para diferentes configuraciones

## 🔍 Problemas Comunes

- **Error 404**: Verifica que las rutas del backend coincidan con las del frontend
- **CORS Error**: Configura CORS en tu backend
- **Token Issues**: Verifica que el formato del token sea correcto en el interceptor
- **Response Structure**: Asegúrate de que el mapeo de respuestas coincida con tu backend