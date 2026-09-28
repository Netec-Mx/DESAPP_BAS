# Servicios en Angular

![Arquitectura del laboratorio: servicio raíz y componentes de tareas](assets/lab-overview.png)

## Metadatos

| Campo | Detalle |
|---|---|
| **Duración estimada** | 74 minutos |
| **Complejidad** | Media |
| **Nivel Bloom** | Aplicar (*Apply*) |
| **Versión Angular** | 21.x (standalone) |
| **Última revisión** | 2024 |

---

## Descripción General

> **Arquitectura objetivo:** Angular 21 standalone sobre Windows 11 con PowerShell. Se conservan los diez pasos, el estado compartido, la comparación de scopes y el troubleshooting original.

En este laboratorio construirás una aplicación Angular de gestión de tareas (*To-Do List*) que centraliza toda la lógica de datos en un servicio dedicado llamado `TaskService`. Aprenderás a generar el servicio con Angular CLI, a registrarlo en el inyector raíz mediante `providedIn: 'root'` y a consumirlo desde dos componentes independientes (`TaskListComponent` y `TaskFormComponent`), demostrando que el estado compartido fluye a través del servicio sin necesidad de comunicación directa entre componentes. Al finalizar, inspeccionarás el servicio en tiempo de ejecución utilizando Angular DevTools.

---

## Objetivos de Aprendizaje

Al completar este laboratorio, serás capaz de:

- [ ] Definir un servicio Angular utilizando el decorador `@Injectable` e identificar su rol como capa de lógica de negocio separada de los componentes.
- [ ] Implementar la inyección de dependencias de Angular para proveer servicios a nivel de módulo raíz (`providedIn: 'root'`) y a nivel de componente específico (arreglo `providers`).
- [ ] Consumir métodos y propiedades de un servicio desde múltiples componentes para compartir estado y lógica de forma centralizada.
- [ ] Generar servicios utilizando Angular CLI (`ng generate service`) y registrarlos correctamente en el árbol de inyectores de la aplicación.
- [ ] Inspeccionar servicios inyectados en tiempo de ejecución utilizando la extensión Angular DevTools.

---

## Prerrequisitos

### Conocimientos previos

| Área | Nivel requerido |
|---|---|
| Componentes Angular y ciclo de vida (`ngOnInit`) | Básico |
| Decoradores TypeScript (`@Component`, `@Injectable`) | Básico |
| Angular CLI (`ng new`, `ng generate component`) | Básico |
| Clases e interfaces en TypeScript | Básico |
| Componentes standalone e imports locales | Básico |

### Acceso y herramientas

| Herramienta | Versión requerida |
|---|---|
| Node.js | 22.12 o superior compatible |
| NPM | 10.x (incluido con Node.js 22.x) |
| Angular CLI | 21.x |
| Visual Studio Code | 1.85.x o superior |
| Google Chrome | 120.x o superior |
| Angular DevTools (extensión Chrome) | Última disponible |
| Extensión Angular Language Service (VS Code) | 17.x |

---

## Entorno de Laboratorio

### Verificación del entorno

Antes de comenzar, abre una terminal y ejecuta los siguientes comandos para confirmar que tu entorno está correctamente configurado:

```bash
# Verificar Node.js 22 (22.12 o superior)
node --version

# Verificar versión de NPM
npm --version

# Verificar versión de Angular CLI
ng version
```

**Salida esperada (ejemplo):**

```
Node.js: v22.x.x
npm: 10.2.4
Angular CLI: 21.x.x
```

> **Referencia secundaria para macOS/Linux:** Si `ng` no se reconoce como comando, verifica que `~/.npm-global/bin` esté en tu variable `PATH`. Ejecuta `export PATH=$PATH:~/.npm-global/bin` en tu terminal o agrégalo a tu `~/.bashrc` / `~/.zshrc`.

> **⚠️ Nota para usuarios de Windows:** Usa PowerShell o CMD. Si `ng` no se reconoce, ejecuta `npm install -g @angular/cli` nuevamente y reinicia la terminal.

### Instalar Angular CLI (si es necesario)

```bash
npm install -g @angular/cli@21
```

### Confirmar instalación de Angular DevTools

1. Abre Google Chrome.
2. Navega a `chrome://extensions/`.
3. Busca **Angular DevTools** en la lista de extensiones instaladas.
4. Si no está instalada, ve a la [Chrome Web Store](https://chrome.google.com/webstore) y busca "Angular DevTools".

---

## Pasos del Laboratorio

### Paso 1 — Crear el proyecto Angular

**Objetivo:** Inicializar un nuevo proyecto Angular con soporte para NgModule (modo tradicional), que será la base de toda la práctica.

#### Instrucciones

1. Abre una terminal en el directorio donde deseas crear el proyecto (por ejemplo, `~/proyectos` o `C:\proyectos`).

2. Ejecuta el siguiente comando para crear el proyecto standalone; `--routing=false` mantiene el alcance enfocado en servicios:

   ```bash
   ng new lab08-tareas --standalone --routing=false --style=css --file-name-style-guide=2016
   ```

3. Cuando Angular CLI pregunte **"Would you like to share pseudonymous usage data..."**, escribe `N` y presiona Enter.

4. Espera a que finalice la instalación de dependencias (puede tomar entre 1 y 3 minutos dependiendo de tu conexión a internet).

5. Ingresa al directorio del proyecto:

   ```bash
   cd lab08-tareas
   ```

6. Abre el proyecto en Visual Studio Code:

   ```bash
   code .
   ```

#### Salida esperada

```
✔ Packages installed successfully.
    Successfully initialized git.
```

La estructura debe incluir `src/app/app.config.ts` y `src/main.ts` con `bootstrapApplication`.

#### Verificación

En VS Code, abre `src/main.ts` y confirma que usa `bootstrapApplication`; después revisa `src/app/app.config.ts`, donde se alojan providers globales adicionales.

---

### Paso 2 — Definir la interfaz `Task`

**Objetivo:** Crear un modelo de datos tipado con TypeScript que represente una tarea, aplicando el principio de tipado estático para garantizar consistencia en toda la aplicación.

#### Instrucciones

1. En la terminal (dentro del directorio `lab08-tareas`), crea el archivo de la interfaz manualmente. Primero crea la carpeta `models`:

   **Referencia secundaria — macOS/Linux:**
   ```bash
   mkdir -p src/app/models
   ```

   **Windows (PowerShell):**
   ```powershell
   New-Item -ItemType Directory -Path src\app\models -Force
   ```

2. En VS Code, crea el archivo `src/app/models/task.model.ts` y agrega el siguiente contenido:

   ```typescript
   // src/app/models/task.model.ts

   /**
    * Interfaz que define la estructura de una tarea en la aplicación.
    * Utilizar una interfaz garantiza tipado estático en todo el proyecto.
    */
   export interface Task {
     /** Identificador único de la tarea (generado automáticamente) */
     id: number;
     /** Título descriptivo de la tarea */
     title: string;
     /** Indica si la tarea ha sido completada */
     completed: boolean;
     /** Fecha de creación de la tarea */
     createdAt: Date;
   }
   ```

#### Salida esperada

El archivo `src/app/models/task.model.ts` debe existir y contener la interfaz `Task` exportada con los cuatro campos definidos.

#### Verificación

En VS Code, abre el archivo y confirma que TypeScript no muestra errores de sintaxis (no debe haber subrayados rojos). Puedes verificar esto en la pestaña **Problems** de VS Code (`Ctrl+Shift+M` / `Cmd+Shift+M`).

---

### Paso 3 — Generar el servicio `TaskService` con Angular CLI

**Objetivo:** Utilizar Angular CLI para generar un servicio con la estructura correcta y el decorador `@Injectable`, comprendiendo los archivos que se crean automáticamente.

#### Instrucciones

1. En la terminal, ejecuta el siguiente comando para generar el servicio dentro de la carpeta `services`:

   ```bash
   ng generate service services/task --type=service
   # Forma abreviada equivalente:
   # ng g s services/task
   ```

2. Angular CLI creará dos archivos. Verifica que ambos existen:

   ```
   src/app/services/task.service.ts        ← Archivo principal del servicio
   src/app/services/task.service.spec.ts   ← Archivo de pruebas unitarias
   ```

3. Abre `src/app/services/task.service.ts` en VS Code. Observa la estructura generada automáticamente:

   ```typescript
   import { Injectable } from '@angular/core';

   @Injectable({
     providedIn: 'root'
   })
   export class TaskService {

     constructor() { }

   }
   ```

   > **Punto clave:** Nota que `providedIn: 'root'` ya está configurado por defecto. Esto significa que Angular registrará automáticamente este servicio en el inyector raíz de la aplicación, creando una única instancia (Singleton) compartida por todos los componentes.

4. Ahora **reemplaza completamente** el contenido del archivo con la implementación completa del servicio:

   ```typescript
   // src/app/services/task.service.ts

   import { Injectable } from '@angular/core';
   import { Task } from '../models/task.model';

   /**
    * TaskService: Servicio centralizado para la gestión de tareas.
    *
    * Al usar providedIn: 'root', Angular crea una única instancia de este
    * servicio (patrón Singleton) disponible en toda la aplicación.
    * Todos los componentes que lo inyecten compartirán el mismo estado.
    */
   @Injectable({
     providedIn: 'root'
   })
   export class TaskService {

     /** Contador interno para generar IDs únicos */
     private nextId: number = 4;

     /**
      * Arreglo privado que almacena el estado de las tareas.
      * Al ser privado, solo se puede modificar a través de los métodos
      * del servicio, garantizando integridad de datos.
      */
     private tasks: Task[] = [
       {
         id: 1,
         title: 'Estudiar el decorador @Injectable',
         completed: true,
         createdAt: new Date('2024-01-15')
       },
       {
         id: 2,
         title: 'Crear el primer servicio con Angular CLI',
         completed: true,
         createdAt: new Date('2024-01-16')
       },
       {
         id: 3,
         title: 'Implementar inyección de dependencias',
         completed: false,
         createdAt: new Date('2024-01-17')
       }
     ];

     constructor() {
       console.log('TaskService: instancia creada');
     }

     /**
      * Retorna una copia del arreglo de tareas para evitar mutaciones externas.
      * Los componentes reciben los datos pero no pueden modificar el arreglo
      * directamente.
      */
     getTasks(): Task[] {
       return [...this.tasks];
     }

     /**
      * Agrega una nueva tarea al arreglo.
      * @param title - Título de la nueva tarea
      */
     addTask(title: string): void {
       if (!title || title.trim() === '') {
         console.warn('TaskService: El título no puede estar vacío');
         return;
       }

       const newTask: Task = {
         id: this.nextId++,
         title: title.trim(),
         completed: false,
         createdAt: new Date()
       };

       this.tasks.push(newTask);
       console.log(`TaskService: Tarea agregada — "${newTask.title}"`);
     }

     /**
      * Elimina una tarea por su ID.
      * @param id - Identificador de la tarea a eliminar
      */
     deleteTask(id: number): void {
       const index = this.tasks.findIndex(task => task.id === id);
       if (index !== -1) {
         const removed = this.tasks.splice(index, 1);
         console.log(`TaskService: Tarea eliminada — "${removed[0].title}"`);
       } else {
         console.warn(`TaskService: No se encontró tarea con ID ${id}`);
       }
     }

     /**
      * Alterna el estado de completado de una tarea.
      * @param id - Identificador de la tarea a actualizar
      */
     toggleTask(id: number): void {
       const task = this.tasks.find(task => task.id === id);
       if (task) {
         task.completed = !task.completed;
         console.log(`TaskService: Tarea "${task.title}" marcada como ${task.completed ? 'completada' : 'pendiente'}`);
       }
     }

     /**
      * Retorna el número total de tareas.
      */
     getTaskCount(): number {
       return this.tasks.length;
     }

     /**
      * Retorna el número de tareas pendientes (no completadas).
      */
     getPendingCount(): number {
       return this.tasks.filter(task => !task.completed).length;
     }
   }
   ```

#### Salida esperada

El archivo `task.service.ts` debe contener la clase `TaskService` con los métodos `getTasks()`, `addTask()`, `deleteTask()`, `toggleTask()`, `getTaskCount()` y `getPendingCount()`. No debe haber errores en la pestaña **Problems** de VS Code.

#### Verificación

Verifica que TypeScript reconoce correctamente la interfaz `Task` importada. Pasa el cursor sobre `Task` en el código — VS Code debe mostrar la definición de la interfaz en un tooltip. Si aparece un error de importación, revisa que la ruta `'../models/task.model'` sea correcta relativa a la ubicación del servicio.

---

### Paso 4 — Generar y configurar `TaskListComponent`

**Objetivo:** Crear el componente que consume el `TaskService` para mostrar la lista de tareas, demostrando cómo inyectar un servicio en el constructor de un componente.

#### Instrucciones

1. Genera el componente con Angular CLI:

   ```bash
   ng generate component components/task-list --type=component
   # Forma abreviada:
   # ng g c components/task-list
   ```

2. Angular CLI crea cuatro archivos. En standalone, agrega `CommonModule` a `TaskListComponent` porque su template usa directivas y pipes:

```typescript
@Component({
  imports: [CommonModule]
})
```

3. Abre `src/app/components/task-list/task-list.component.ts` y **reemplaza** su contenido con:

   ```typescript
   // src/app/components/task-list/task-list.component.ts

   import { CommonModule } from '@angular/common';
   import { Component, OnInit } from '@angular/core';
   import { TaskService } from '../../services/task.service';
   import { Task } from '../../models/task.model';

   @Component({
     selector: 'app-task-list',
     imports: [CommonModule],
     templateUrl: './task-list.component.html',
     styleUrl: './task-list.component.css'
   })
   export class TaskListComponent implements OnInit {

     /** Arreglo local que almacena las tareas obtenidas del servicio */
     tasks: Task[] = [];

     /**
      * Angular inyecta automáticamente la instancia de TaskService
      * gracias al sistema de inyección de dependencias.
      * No es necesario usar "new TaskService()" — Angular lo gestiona.
      */
     constructor(private taskService: TaskService) { }

     /**
      * ngOnInit se ejecuta después de que Angular inicializa el componente.
      * Es el lugar correcto para obtener datos iniciales del servicio.
      */
     ngOnInit(): void {
       this.loadTasks();
     }

     /** Carga las tareas desde el servicio al arreglo local */
     loadTasks(): void {
       this.tasks = this.taskService.getTasks();
     }

     /** Delega la eliminación de una tarea al servicio y recarga la lista */
     onDeleteTask(id: number): void {
       this.taskService.deleteTask(id);
       this.loadTasks();
     }

     /** Delega el cambio de estado al servicio y recarga la lista */
     onToggleTask(id: number): void {
       this.taskService.toggleTask(id);
       this.loadTasks();
     }

     /** Propiedad calculada: número de tareas pendientes */
     get pendingCount(): number {
       return this.taskService.getPendingCount();
     }

     /** Propiedad calculada: número total de tareas */
     get totalCount(): number {
       return this.taskService.getTaskCount();
     }
   }
   ```

4. Abre `src/app/components/task-list/task-list.component.html` y **reemplaza** su contenido con:

   ```html
   <!-- src/app/components/task-list/task-list.component.html -->

   <div class="task-list-container">
     <h2>Lista de Tareas</h2>

     <!-- Resumen de estado -->
     <div class="task-summary">
       <span class="badge-total">Total: {{ totalCount }}</span>
       <span class="badge-pending">Pendientes: {{ pendingCount }}</span>
     </div>

     <!-- Mensaje cuando no hay tareas -->
     <p *ngIf="tasks.length === 0" class="empty-message">
       No hay tareas registradas. ¡Agrega una nueva tarea!
     </p>

     <!-- Lista de tareas -->
     <ul class="task-list" *ngIf="tasks.length > 0">
       <li *ngFor="let task of tasks"
           class="task-item"
           [class.completed]="task.completed">

         <!-- Checkbox para marcar como completada -->
         <input
           type="checkbox"
           [checked]="task.completed"
           (change)="onToggleTask(task.id)"
           [id]="'task-' + task.id">

         <!-- Título de la tarea -->
         <label [for]="'task-' + task.id" class="task-title">
           {{ task.title }}
         </label>

         <!-- Fecha de creación -->
         <span class="task-date">
           {{ task.createdAt | date:'dd/MM/yyyy' }}
         </span>

         <!-- Botón de eliminar -->
         <button
           class="btn-delete"
           (click)="onDeleteTask(task.id)"
           title="Eliminar tarea">
           ✕
         </button>
       </li>
     </ul>
   </div>
   ```

5. Abre `src/app/components/task-list/task-list.component.css` y agrega los siguientes estilos:

   ```css
   /* src/app/components/task-list/task-list.component.css */

   .task-list-container {
     max-width: 600px;
     margin: 0 auto;
     padding: 16px;
     font-family: Arial, sans-serif;
   }

   h2 {
     color: #333;
     border-bottom: 2px solid #4a90d9;
     padding-bottom: 8px;
   }

   .task-summary {
     display: flex;
     gap: 12px;
     margin-bottom: 16px;
   }

   .badge-total, .badge-pending {
     padding: 4px 10px;
     border-radius: 12px;
     font-size: 13px;
     font-weight: bold;
   }

   .badge-total {
     background-color: #e0e0e0;
     color: #333;
   }

   .badge-pending {
     background-color: #fff3cd;
     color: #856404;
   }

   .task-list {
     list-style: none;
     padding: 0;
     margin: 0;
   }

   .task-item {
     display: flex;
     align-items: center;
     gap: 10px;
     padding: 10px 12px;
     margin-bottom: 8px;
     border: 1px solid #ddd;
     border-radius: 6px;
     background-color: #fff;
     transition: background-color 0.2s;
   }

   .task-item:hover {
     background-color: #f9f9f9;
   }

   .task-item.completed {
     background-color: #f0fff0;
     border-color: #90ee90;
   }

   .task-item.completed .task-title {
     text-decoration: line-through;
     color: #888;
   }

   .task-title {
     flex: 1;
     cursor: pointer;
   }

   .task-date {
     font-size: 11px;
     color: #999;
     white-space: nowrap;
   }

   .btn-delete {
     background: none;
     border: none;
     color: #e74c3c;
     cursor: pointer;
     font-size: 16px;
     padding: 2px 6px;
     border-radius: 4px;
     transition: background-color 0.2s;
   }

   .btn-delete:hover {
     background-color: #fdecea;
   }

   .empty-message {
     text-align: center;
     color: #888;
     font-style: italic;
     padding: 20px;
   }
   ```

#### Salida esperada

El componente `TaskListComponent` debe existir en `src/app/components/task-list/` con sus cuatro archivos, y debe declarar sus dependencias en `imports`.

#### Verificación

En VS Code, abre el archivo `.ts` del componente y verifica que no hay errores. Específicamente, confirma que `TaskService` se importa correctamente y que el constructor recibe `private taskService: TaskService` sin errores de tipo.

---

### Paso 5 — Generar y configurar `TaskFormComponent`

**Objetivo:** Crear el componente de formulario que utiliza el mismo `TaskService` para agregar nuevas tareas, demostrando que ambos componentes comparten la misma instancia del servicio (Singleton).

#### Instrucciones

1. Genera el componente:

   ```bash
   ng generate component components/task-form --type=component
   # Forma abreviada:
   # ng g c components/task-form
   ```

2. Abre `src/app/components/task-form/task-form.component.ts` y **reemplaza** su contenido con:

   ```typescript
   // src/app/components/task-form/task-form.component.ts

   import { Component } from '@angular/core';
   import { FormsModule } from '@angular/forms';
   import { TaskService } from '../../services/task.service';

   @Component({
     selector: 'app-task-form',
     imports: [FormsModule],
     templateUrl: './task-form.component.html',
     styleUrl: './task-form.component.css'
   })
   export class TaskFormComponent {

     /** Modelo del campo de texto del formulario (Two-Way Binding con ngModel) */
     newTaskTitle: string = '';

     /** Mensaje de retroalimentación al usuario */
     feedbackMessage: string = '';

     /**
      * Se inyecta la MISMA instancia de TaskService que usa TaskListComponent.
      * Esto es posible gracias a providedIn: 'root' — Angular garantiza
      * que es el mismo objeto en memoria (patrón Singleton).
      */
     constructor(private taskService: TaskService) { }

     /**
      * Maneja el envío del formulario.
      * Agrega la tarea a través del servicio y limpia el campo.
      */
     onSubmit(): void {
       if (!this.newTaskTitle || this.newTaskTitle.trim() === '') {
         this.feedbackMessage = '⚠️ Por favor, ingresa un título para la tarea.';
         return;
       }

       this.taskService.addTask(this.newTaskTitle);
       this.feedbackMessage = `✅ Tarea "${this.newTaskTitle.trim()}" agregada correctamente.`;
       this.newTaskTitle = '';

       // Limpiar el mensaje después de 3 segundos
       setTimeout(() => {
         this.feedbackMessage = '';
       }, 3000);
     }
   }
   ```

3. Abre `src/app/components/task-form/task-form.component.html` y **reemplaza** su contenido con:

   ```html
   <!-- src/app/components/task-form/task-form.component.html -->

   <div class="task-form-container">
     <h3>Agregar Nueva Tarea</h3>

     <form (ngSubmit)="onSubmit()" #taskForm="ngForm" class="task-form">
       <div class="form-group">
         <label for="taskTitle">Título de la tarea:</label>
         <input
           type="text"
           id="taskTitle"
           name="taskTitle"
           [(ngModel)]="newTaskTitle"
           placeholder="Ej: Revisar documentación de Angular"
           class="form-input"
           maxlength="100"
           autocomplete="off">
       </div>

       <button type="submit" class="btn-submit">
         + Agregar Tarea
       </button>
     </form>

     <!-- Mensaje de retroalimentación -->
     <p *ngIf="feedbackMessage" class="feedback-message">
       {{ feedbackMessage }}
     </p>

     <!-- Nota educativa sobre el servicio compartido -->
     <div class="info-box">
       <strong>ℹ️ Nota:</strong> Este formulario usa la misma instancia de
       <code>TaskService</code> que el componente de lista. Al agregar una tarea
       aquí, los datos se actualizan en el servicio compartido.
     </div>
   </div>
   ```

4. Abre `src/app/components/task-form/task-form.component.css` y agrega:

   ```css
   /* src/app/components/task-form/task-form.component.css */

   .task-form-container {
     max-width: 600px;
     margin: 0 auto 24px auto;
     padding: 16px;
     background-color: #f8f9fa;
     border: 1px solid #dee2e6;
     border-radius: 8px;
     font-family: Arial, sans-serif;
   }

   h3 {
     color: #333;
     margin-top: 0;
   }

   .task-form {
     display: flex;
     flex-direction: column;
     gap: 12px;
   }

   .form-group {
     display: flex;
     flex-direction: column;
     gap: 4px;
   }

   label {
     font-size: 14px;
     font-weight: bold;
     color: #555;
   }

   .form-input {
     padding: 10px 12px;
     border: 1px solid #ccc;
     border-radius: 6px;
     font-size: 14px;
     transition: border-color 0.2s;
   }

   .form-input:focus {
     outline: none;
     border-color: #4a90d9;
     box-shadow: 0 0 0 2px rgba(74, 144, 217, 0.2);
   }

   .btn-submit {
     align-self: flex-start;
     padding: 10px 20px;
     background-color: #4a90d9;
     color: white;
     border: none;
     border-radius: 6px;
     font-size: 14px;
     cursor: pointer;
     transition: background-color 0.2s;
   }

   .btn-submit:hover {
     background-color: #357abd;
   }

   .feedback-message {
     margin-top: 8px;
     padding: 8px 12px;
     background-color: #d4edda;
     border: 1px solid #c3e6cb;
     border-radius: 4px;
     color: #155724;
     font-size: 13px;
   }

   .info-box {
     margin-top: 12px;
     padding: 10px 12px;
     background-color: #d1ecf1;
     border: 1px solid #bee5eb;
     border-radius: 4px;
     font-size: 12px;
     color: #0c5460;
   }

   .info-box code {
     background-color: #fff;
     padding: 1px 4px;
     border-radius: 3px;
     font-size: 12px;
   }
   ```

#### Salida esperada

El componente `TaskFormComponent` debe existir en `src/app/components/task-form/` y contener `imports: [FormsModule]`.

#### Verificación

Confirma que `TaskListComponent` importa `CommonModule`, `TaskFormComponent` importa `FormsModule` y, en el paso siguiente, `AppComponent` importa ambos componentes.

---

### Paso 6 — Configurar `AppComponent` standalone

**Objetivo:** Componer la aplicación standalone integrando `TaskFormComponent` y `TaskListComponent` en el componente raíz.

#### Instrucciones

1. Abre `src/app/app.component.ts` y reemplaza su contenido con la composición standalone:

   ```typescript
   import { Component } from '@angular/core';
   import { TaskFormComponent } from './components/task-form/task-form.component';
   import { TaskListComponent } from './components/task-list/task-list.component';

   @Component({
     selector: 'app-root',
     imports: [TaskFormComponent, TaskListComponent],
     templateUrl: './app.component.html',
     styleUrl: './app.component.css'
   })
   export class AppComponent {
     title = 'Gestor de Tareas';
   }
   ```

   > **Punto clave de aprendizaje:** Observa que `TaskService` **no aparece** en el arreglo `providers`. Esto es porque al usar `providedIn: 'root'` en el decorador `@Injectable`, Angular lo registra automáticamente. No es necesario (ni recomendado) duplicar el registro aquí.

2. Abre `src/app/app.component.ts` y **reemplaza** su contenido con:

   ```typescript
   // src/app/app.component.ts

   import { Component } from '@angular/core';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrl: './app.component.css'
   })
   export class AppComponent {
     title = 'Gestión de Tareas — Lab 08';
   }
   ```

3. Abre `src/app/app.component.html` y **reemplaza todo** su contenido con:

   ```html
   <!-- src/app/app.component.html -->

   <div class="app-container">
     <header class="app-header">
       <h1>📋 {{ title }}</h1>
       <p class="app-subtitle">
         Demostración de Servicios e Inyección de Dependencias en Angular
       </p>
     </header>

     <main class="app-main">
       <!-- Componente de formulario: usa TaskService para AGREGAR tareas -->
       <app-task-form></app-task-form>

       <!-- Componente de lista: usa TaskService para MOSTRAR y GESTIONAR tareas -->
       <app-task-list></app-task-list>
     </main>

     <footer class="app-footer">
       <p>
         Ambos componentes comparten la misma instancia de
         <strong>TaskService</strong> (Singleton via <code>providedIn: 'root'</code>)
       </p>
     </footer>
   </div>
   ```

4. Abre `src/app/app.component.css` y agrega:

   ```css
   /* src/app/app.component.css */

   .app-container {
     min-height: 100vh;
     background-color: #f4f6f9;
   }

   .app-header {
     background-color: #2c3e50;
     color: white;
     padding: 20px 24px;
     text-align: center;
   }

   .app-header h1 {
     margin: 0 0 8px 0;
     font-size: 24px;
   }

   .app-subtitle {
     margin: 0;
     font-size: 13px;
     color: #adb5bd;
   }

   .app-main {
     max-width: 700px;
     margin: 24px auto;
     padding: 0 16px;
   }

   .app-footer {
     text-align: center;
     padding: 16px;
     font-size: 12px;
     color: #888;
     border-top: 1px solid #ddd;
     margin-top: 32px;
   }

   .app-footer code {
     background-color: #e9ecef;
     padding: 1px 5px;
     border-radius: 3px;
   }
   ```

#### Salida esperada

`TaskFormComponent` debe importar `FormsModule`; `app.component.ts` debe importar ambos hijos y `app.component.html` debe contener los selectores `<app-task-form>` y `<app-task-list>`.

#### Verificación

Abre la pestaña **Problems** en VS Code (`Ctrl+Shift+M`). No debe haber errores de compilación en ninguno de los archivos modificados.

---

### Paso 7 — Ejecutar la aplicación y verificar el comportamiento

**Objetivo:** Compilar y ejecutar la aplicación para confirmar que el servicio funciona correctamente como capa de datos compartida entre ambos componentes.

#### Instrucciones

1. En la terminal, ejecuta el servidor de desarrollo:

   ```bash
   ng serve --open
   ```

   La bandera `--open` abre automáticamente el navegador en `http://localhost:4200`.

2. Observa la aplicación en el navegador. Debes ver:
   - El encabezado con el título "📋 Gestión de Tareas — Lab 08".
   - El formulario para agregar tareas.
   - La lista con las 3 tareas iniciales (2 completadas, 1 pendiente).

3. **Prueba 1 — Agregar tarea:** Escribe "Explorar Angular DevTools" en el campo del formulario y haz clic en **+ Agregar Tarea**. La lista debe actualizarse mostrando la nueva tarea.

   > **Observación clave:** El formulario y la lista son componentes **separados** y **no se comunican directamente entre sí**. La actualización ocurre porque ambos usan la misma instancia de `TaskService`.

   > **⚠️ Nota importante:** Para ver la tarea recién agregada en `TaskListComponent`, debes hacer clic en el botón o realizar alguna acción que dispare `loadTasks()`. En esta implementación, `TaskListComponent` carga las tareas al inicializarse y al eliminar/togglear. Para ver la nueva tarea inmediatamente, recarga la página con `F5` — las tareas en memoria se reiniciarán, pero esto demuestra el ciclo de vida. En el Paso 8 se explica cómo mejorar esto.

4. **Prueba 2 — Marcar como completada:** Haz clic en el checkbox de la tarea "Implementar inyección de dependencias". El texto debe aparecer tachado y el fondo de la tarjeta debe cambiar a verde claro.

5. **Prueba 3 — Eliminar tarea:** Haz clic en el botón **✕** de cualquier tarea. La tarea debe desaparecer de la lista y el contador de "Total" debe decrementarse.

6. **Prueba 4 — Verificar el mensaje en consola:** Abre las DevTools del navegador (`F12`) y ve a la pestaña **Console**. Debes ver el mensaje `TaskService: instancia creada` apareciendo **una sola vez**, confirmando el patrón Singleton.

#### Salida esperada

```
TaskService: instancia creada
TaskService: Tarea agregada — "Explorar Angular DevTools"
TaskService: Tarea "Implementar inyección de dependencias" marcada como completada
```

#### Verificación

Confirma en la consola del navegador que el mensaje `"TaskService: instancia creada"` aparece **exactamente una vez**, independientemente de cuántos componentes usen el servicio. Esto confirma que Angular está creando una única instancia Singleton.

---

### Paso 8 — Mejorar la sincronización entre componentes (opcional pero recomendado)

**Objetivo:** Comprender una limitación del enfoque actual y aplicar una solución simple para sincronizar automáticamente la lista cuando se agrega una tarea desde el formulario.

#### Instrucciones

> **Contexto del problema:** En la implementación actual, cuando `TaskFormComponent` agrega una tarea, `TaskListComponent` no se entera automáticamente porque no existe un mecanismo de notificación. La solución más simple (sin Observables) es usar un `EventEmitter` a nivel de aplicación o hacer que `TaskListComponent` use un getter en lugar de un arreglo local.

1. Modifica `TaskListComponent` para que use directamente el servicio en el template, eliminando la necesidad de sincronización manual. Abre `task-list.component.ts` y **reemplaza** el método `loadTasks` y la propiedad `tasks`:

   ```typescript
   // src/app/components/task-list/task-list.component.ts
   // VERSIÓN MEJORADA — reemplaza el archivo completo

   import { Component, OnInit } from '@angular/core';
   import { TaskService } from '../../services/task.service';
   import { Task } from '../../models/task.model';

   @Component({
     selector: 'app-task-list',
     templateUrl: './task-list.component.html',
     styleUrl: './task-list.component.css'
   })
   export class TaskListComponent implements OnInit {

     /**
      * MEJORA: En lugar de copiar el arreglo a una variable local,
      * usamos un getter que consulta el servicio cada vez que Angular
      * evalúa el template. Esto garantiza que siempre se muestren
      * los datos más recientes.
      */
     get tasks(): Task[] {
       return this.taskService.getTasks();
     }

     constructor(private taskService: TaskService) { }

     ngOnInit(): void {
       // ngOnInit ya no necesita cargar tareas manualmente
       // el getter 'tasks' siempre retorna los datos actuales del servicio
       console.log('TaskListComponent: inicializado');
     }

     onDeleteTask(id: number): void {
       this.taskService.deleteTask(id);
     }

     onToggleTask(id: number): void {
       this.taskService.toggleTask(id);
     }

     get pendingCount(): number {
       return this.taskService.getPendingCount();
     }

     get totalCount(): number {
       return this.taskService.getTaskCount();
     }
   }
   ```

2. Guarda el archivo. La aplicación se recompilará automáticamente.

3. En el navegador, agrega una nueva tarea desde el formulario. Esta vez, la tarea debe aparecer **inmediatamente** en la lista sin necesidad de recargar la página.

#### Salida esperada

Al agregar una tarea desde `TaskFormComponent`, la lista en `TaskListComponent` se actualiza instantáneamente, demostrando que ambos componentes trabajan sobre el mismo estado centralizado en el servicio.

#### Verificación

Agrega 3 tareas consecutivas desde el formulario y verifica que el contador "Total" incrementa correctamente con cada adición.

---

### Paso 9 — Explorar la diferencia entre `providedIn: 'root'` y `providers` en el componente

**Objetivo:** Observar experimentalmente qué ocurre cuando un servicio se registra en el arreglo `providers` de un componente en lugar de usar `providedIn: 'root'`, generando múltiples instancias en lugar de una sola.

#### Instrucciones

1. Crea un servicio de contador simple para el experimento:

   ```bash
   ng generate service services/counter --type=service
   ```

2. Abre `src/app/services/counter.service.ts` y reemplaza su contenido:

   ```typescript
   // src/app/services/counter.service.ts

   import { Injectable } from '@angular/core';

   /**
    * EXPERIMENTO: Este servicio NO usa providedIn: 'root'.
    * Debe registrarse manualmente en providers[] de un módulo o componente.
    * Si se registra en dos componentes diferentes, cada uno tendrá
    * su PROPIA instancia (no Singleton).
    */
   @Injectable()   // ← Sin providedIn: 'root'
   export class CounterService {

     private count: number = 0;

     constructor() {
       console.log('CounterService: NUEVA instancia creada. ID único:', Math.random().toFixed(4));
     }

     increment(): void {
       this.count++;
     }

     getCount(): number {
       return this.count;
     }
   }
   ```

3. Modifica temporalmente `TaskListComponent` para registrar `CounterService` en su propio arreglo `providers`. Abre `task-list.component.ts` y agrega la importación y el decorador:

   ```typescript
   // Agrega esta importación al inicio del archivo:
   import { CounterService } from '../../services/counter.service';

   // Modifica el decorador @Component para agregar providers:
   @Component({
     selector: 'app-task-list',
     templateUrl: './task-list.component.html',
     styleUrl: './task-list.component.css',
     providers: [CounterService]   // ← Instancia EXCLUSIVA para este componente
   })
   ```

4. Modifica también `TaskFormComponent` de la misma manera (agrega la importación y `providers: [CounterService]` al decorador).

5. Guarda los cambios y observa la consola del navegador. Debes ver **dos mensajes** de "CounterService: NUEVA instancia creada" con IDs diferentes, confirmando que cada componente tiene su propia instancia.

6. **Reflexión:** Comenta brevemente en el código (o en tu cuaderno) cuándo sería útil tener instancias separadas versus una instancia compartida.

7. **Limpieza del experimento:** Una vez observado el comportamiento, elimina los cambios del experimento de `TaskListComponent` y `TaskFormComponent` (quita las importaciones de `CounterService` y los arreglos `providers` del decorador). El servicio `counter.service.ts` puede dejarse en el proyecto.

#### Salida esperada en la consola del navegador

```
CounterService: NUEVA instancia creada. ID único: 0.3421
CounterService: NUEVA instancia creada. ID único: 0.7893
TaskService: instancia creada
```

#### Verificación

Confirma que aparecen **dos** mensajes de `CounterService` con IDs diferentes, pero solo **un** mensaje de `TaskService`. Esto demuestra la diferencia entre el patrón Singleton (`providedIn: 'root'`) y las instancias por componente (`providers` en el decorador).

---

### Paso 10 — Inspeccionar el servicio con Angular DevTools

**Objetivo:** Utilizar la extensión Angular DevTools para visualizar el árbol de componentes e inspeccionar las instancias de los servicios inyectados en tiempo de ejecución.

#### Instrucciones

1. Asegúrate de que la aplicación esté ejecutándose en `http://localhost:4200`.

2. Abre las DevTools de Chrome presionando `F12`.

3. En la barra de pestañas de DevTools, busca la pestaña **Angular** (puede estar en el menú desplegable `»` si no es visible directamente).

4. Haz clic en la pestaña **Components** dentro de Angular DevTools. Debes ver el árbol de componentes de la aplicación:

   ```
   AppComponent
   ├── TaskFormComponent
   └── TaskListComponent (CommonModule)
   ```

5. Haz clic en **TaskFormComponent** en el árbol. En el panel derecho, busca la sección **Injector** o **Dependencies**. Debes ver `TaskService` listado como una dependencia inyectada.

6. Haz clic en **TaskListComponent** y verifica que también muestra `TaskService` como dependencia.

7. Haz clic en la pestaña **Profiler** dentro de Angular DevTools. Haz clic en el botón de grabación (círculo rojo), agrega una tarea desde el formulario y detén la grabación. Observa qué componentes se re-renderizaron.

8. Captura o anota tus observaciones para incluirlas en el reporte del laboratorio.

#### Salida esperada

Angular DevTools debe mostrar:
- El árbol de componentes con `AppComponent` como raíz.
- `TaskService` listado como dependencia en ambos componentes (`TaskFormComponent` y `TaskListComponent`).
- En el Profiler, ambos componentes deben mostrar actividad de detección de cambios cuando se agrega una tarea.

#### Verificación

Confirma que puedes ver `TaskService` en la sección de dependencias de **al menos uno** de los componentes en Angular DevTools. Si la pestaña Angular no aparece, verifica que la extensión esté instalada y habilitada en Chrome.

---

## Validación y Pruebas

### Lista de verificación final

Antes de considerar el laboratorio completo, verifica cada ítem:

| # | Criterio de validación | ✓ |
|---|---|---|
| 1 | El proyecto compila sin errores (`ng serve` no muestra errores en terminal) | ☐ |
| 2 | La aplicación se muestra correctamente en `http://localhost:4200` | ☐ |
| 3 | Las 3 tareas iniciales aparecen en la lista al cargar la página | ☐ |
| 4 | Se puede agregar una nueva tarea desde el formulario y aparece en la lista | ☐ |
| 5 | Se puede marcar/desmarcar una tarea como completada | ☐ |
| 6 | Se puede eliminar una tarea y el contador se actualiza | ☐ |
| 7 | La consola muestra `"TaskService: instancia creada"` exactamente una vez | ☐ |
| 8 | Al registrar `CounterService` en `providers[]` de dos componentes, aparecen dos mensajes de instancia creada | ☐ |
| 9 | Angular DevTools muestra `TaskService` como dependencia en los componentes | ☐ |
| 10 | No hay errores en la consola del navegador (excepto los mensajes de log intencionales) | ☐ |

### Prueba de integración manual

Ejecuta la siguiente secuencia de acciones y verifica el comportamiento esperado:

```
1. Cargar la página → Deben verse 3 tareas (2 completadas, 1 pendiente)
                       Contador: Total: 3 | Pendientes: 1

2. Agregar "Tarea de prueba" → Aparece en la lista
                                Contador: Total: 4 | Pendientes: 2

3. Marcar "Tarea de prueba" como completada → Texto tachado, fondo verde
                                               Contador: Total: 4 | Pendientes: 1

4. Eliminar "Tarea de prueba" → Desaparece de la lista
                                  Contador: Total: 3 | Pendientes: 1

5. Intentar agregar tarea vacía → Mensaje de advertencia en el formulario
                                    No se agrega ninguna tarea
```

---

## Resolución de Problemas

### Problema 1: `Can't bind to 'ngModel' since it isn't a known property of 'input'`

**Síntoma:** El navegador muestra un error en la consola similar a:
```
ERROR: Can't bind to 'ngModel' since it isn't a known property of 'input'.
```
La aplicación no carga y el formulario no se muestra.

**Causa:** `TaskFormComponent` usa `ngModel`, pero no incluyó `FormsModule` en los imports de su decorador standalone.

**Solución:**
1. Abre `src/app/components/task-form/task-form.component.ts`.
2. Verifica la importación:
   ```typescript
   import { FormsModule } from '@angular/forms';
   ```
3. Verifica el decorador standalone:
   ```typescript
   @Component({
     imports: [FormsModule]
   })
   ```

---

### Problema 2: La lista de tareas no se actualiza al agregar una nueva tarea desde el formulario

**Síntoma:** Al hacer clic en "+ Agregar Tarea", el mensaje de confirmación aparece en el formulario, pero la lista de tareas no muestra la nueva tarea. Solo se actualiza al recargar la página.

**Causa:** `TaskListComponent` está usando una variable local `tasks: Task[] = []` que se llena en `ngOnInit()` y no se vuelve a actualizar. Cuando `TaskFormComponent` agrega una tarea al servicio, el arreglo local del componente de lista no se entera del cambio.

**Solución:**
Reemplazar la variable local por un getter que consulte el servicio directamente en cada ciclo de detección de cambios de Angular:

```typescript
// ❌ INCORRECTO — variable local que no se actualiza automáticamente:
tasks: Task[] = [];

ngOnInit(): void {
  this.tasks = this.taskService.getTasks();
}

// ✅ CORRECTO — getter que siempre retorna los datos actuales del servicio:
get tasks(): Task[] {
  return this.taskService.getTasks();
}
```

Asegúrate de haber aplicado la versión mejorada del componente del Paso 8. Si el problema persiste, verifica que `TaskService.getTasks()` retorna `[...this.tasks]` (copia del arreglo) para que Angular detecte el cambio de referencia.

---

## Limpieza del Entorno

Una vez completado el laboratorio, puedes realizar las siguientes acciones de limpieza:

### Detener el servidor de desarrollo

Presiona `Ctrl+C` en la terminal donde se ejecuta `ng serve` para detener el servidor de desarrollo.

### Conservar el proyecto (recomendado)

Se recomienda **conservar** el proyecto `lab08-tareas` ya que será la base de referencia para los laboratorios posteriores sobre inyección de dependencias avanzada y comunicación entre componentes.

### Limpiar la caché de npm (opcional)

Si necesitas liberar espacio en disco:

```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules si no necesitas el proyecto
# (puedes regenerarlos con 'npm install' cuando lo necesites)
# Referencia secundaria — macOS/Linux: rm -rf lab08-tareas/node_modules
# En Windows PowerShell:
# Remove-Item -Recurse -Force lab08-tareas\node_modules
```

> **⚠️ Advertencia:** No elimines el directorio completo del proyecto si planeas continuar con laboratorios posteriores.

---

## Resumen

En este laboratorio implementaste una aplicación Angular de gestión de tareas que demuestra los conceptos fundamentales de los servicios e inyección de dependencias:

### Conceptos aplicados

| Concepto | Implementación en el laboratorio |
|---|---|
| **Decorador `@Injectable`** | Aplicado en `TaskService` para habilitarlo como clase inyectable |
| **`providedIn: 'root'`** | Registró `TaskService` en el inyector raíz, creando una instancia Singleton |
| **Inyección en constructor** | `TaskListComponent` y `TaskFormComponent` reciben `TaskService` automáticamente |
| **Patrón Singleton** | Una sola instancia de `TaskService` compartida por todos los componentes |
| **`providers` en componente** | `CounterService` demostró instancias múltiples cuando se registra por componente |
| **Angular CLI** | `ng generate service` generó la estructura correcta del servicio automáticamente |
| **Separación de responsabilidades** | Los componentes solo manejan presentación; el servicio maneja los datos |
| **Angular DevTools** | Inspección del árbol de inyectores y dependencias en tiempo de ejecución |

### Diagrama final de la arquitectura construida

```
AppComponent standalone (app-root)
│
├── TaskFormComponent (FormsModule)
│   └── inyecta → TaskService [instancia única en inyector raíz]
│
├── TaskListComponent (CommonModule)
│   └── inyecta → TaskService [MISMA instancia]
│
└── Inyector Raíz
    └── TaskService (Singleton)
        ├── getTasks()
        ├── addTask()
        ├── deleteTask()
        ├── toggleTask()
        ├── getTaskCount()
        └── getPendingCount()
```

### Recursos adicionales

- [Documentación oficial de Angular: Introducción a los servicios e inyección de dependencias](https://angular.dev/guide/di)
- [Documentación oficial de Angular: Creación de servicios inyectables](https://angular.dev/guide/di/creating-injectable-service)
- [Angular CLI: Referencia del comando `ng generate service`](https://angular.dev/cli/generate/service)
- [Angular DevTools: Guía de uso oficial](https://angular.dev/tools/devtools)
- [TypeScript: Decoradores — documentación oficial de Microsoft](https://www.typescriptlang.org/docs/handbook/decorators.html)

---
