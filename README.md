# Proyecto Menchaca - Frontend

**Menchaca** es una aplicación web desarrollada en Angular que permite gestionar reportes médicos de pacientes. Está diseñada para manejar información médica confidencial de manera segura y eficiente.

##  Requisitos Previos

- Node.js 18+
- Angular CLI 19+
- Un backend funcional (API REST)

##  Instalación

Clona el repositorio:

```bash
git clone https://github.com/SrArmstrong/proyectomenchaca_front

```

Ejecuta los siguientes comandos:

```bash
npm install     # Instala dependencias
ng serve        # Inicia el servidor de desarrollo
ng build        # Genera el build de producción
ng test         # Ejecuta el test de prueba

```

##  Estructura de carpetas

```plaintext
.angular/
.vscode/
node_modules/
public/
src/
  ├── app/
  │   ├── pages/
  │   │   └── auth/
  │   │       ├── login/
  │   │       │   ├── login.component.css
  │   │       │   ├── login.component.html
  │   │       │   ├── login.component.spec.ts
  │   │       │   ├── login.component.ts
  │   │       │   └── README.md
  │   │       └── register/
  │   │           ├── register.component.css
  │   │           ├── register.component.html
  │   │           ├── register.component.spec.ts
  │   │           ├── register.component.ts
  │   │           └── README.md
  │   ├── consultas/
  │   ├── consultorio/
  │   ├── dashboard/
  │   ├── expediente/
  │   ├── horarios/
  │   ├── recetas/
  │   └── services/
  ├── app.component.css
  ├── app.component.html
  ├── app.component.spec.ts
  ├── app.component.ts
  ├── app.config.ts
  ├── app.config.server.ts
  ├── app.routes.ts
  ├── app.routes.server.ts
  ├── index.html
  ├── main.ts
  ├── main.server.ts
  ├── server.ts
  └── styles.css
.editorconfig
.gitignore
angular.json
package.json
package-lock.json
README.md
tsconfig.app.json
tsconfig.json
tsconfig.spec.json