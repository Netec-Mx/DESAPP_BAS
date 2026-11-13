# Práctica 8.1 Lista de tareas: servicios y proveedores
<!-- {% raw %} -->

<br/>

## Objetivos

Al completar la práctica podrás:

- Definir un servicio con `@Injectable` y separar sus responsabilidades de las de los componentes.
- Generar servicios y componentes mediante Angular CLI.
- Inyectar el servicio mediante `inject()` y reconocer la alternativa mediante constructor.
- Compartir estado reactivo con `signal`, `asReadonly()` y `computed()`.
- Consumir datos con `@if`, `@for`, `DatePipe` y formularios con `ngModel`.
- Comparar una instancia raíz con instancias proporcionadas por componente.
- Inspeccionar proveedores con Angular DevTools y comprobar el comportamiento de la aplicación.


<br/>

<br/>

## Prerrequisitos y herramientas

Conocimientos básicos de TypeScript, componentes standalone, interpolación, eventos, `@if`, `@for` y formularios con `ngModel`. Las señales necesarias se explican durante la práctica.

| Herramienta | Requisito para el laboratorio | Comprobación |
|---|---|---|
| Node.js | Rama 22, versión 22.22.3 o posterior de esa rama; también es compatible Node 24 desde 24.15.0 | `node --version` |
| npm | La versión incluida con la instalación compatible de Node.js | `npm --version` |
| Angular CLI | 22.x | `ng version` |
| VS Code | Versión actual compatible con el sistema | `code --version` |
| Angular Language Service | Extensión actual de VS Code | Panel Extensions |
| Chrome o Edge | Versión actual | Información del navegador |
| Angular DevTools | Extensión actual para el navegador elegido | Panel Angular de DevTools |

Referencia de compatibilidad: https://angular.dev/reference/versions. La referencia consultada para Angular 22.0.x establece TypeScript `>=6.0.0 <6.1.0`; deja que Angular CLI gestione las dependencias del proyecto.


<br/>
<br/>

### Verificar e instalar Angular CLI

Abre PowerShell:

```powershell
node --version
npm --version
ng version
code --version
```

Si necesitas instalar o actualizar Angular CLI:

```powershell
npm install -g @angular/cli@22
ng version
```

Si PowerShell bloquea `ng.ps1`, utiliza `ng.cmd` en lugar de `ng`. Para npm, puedes utilizar `npm.cmd`. Esto permite continuar sin cambiar la política de ejecución del equipo. Si el comando no existe, confirma la instalación y abre una terminal nueva.

Instala Angular DevTools siguiendo https://angular.dev/tools/devtools. La inspección de esta práctica se realiza con una compilación de desarrollo ejecutada mediante `ng serve`.


<br/>
<br/>

## Instrucciones

### Paso 1. Crear el proyecto standalone

Desde una carpeta de trabajo donde todavía no exista `lab08-tareas`, ejecuta:

```powershell
ng new lab08-tareas --standalone --routing=false --style=css --ssr=false --ai-config=none --skip-git --skip-tests=false --file-name-style-guide=2016 --interactive=false
cd lab08-tareas
code .
```

El estilo de nombres `2016` se utiliza intencionalmente para conservar `app.component.ts`, `.component.ts` y `.service.ts` en los ejemplos del curso. No significa que se utilice una versión antigua de Angular.

`--skip-tests=false` solicita archivos de pruebas y `--skip-git` evita depender de una configuración de Git para este ejercicio. Si aparece una pregunta de telemetría, puedes responder No.

**Verifica:** `ng version`, ejecutado dentro del proyecto, informa Angular 22.x. `src/main.ts` utiliza `bootstrapApplication` y el proyecto contiene `src/app/app.config.ts`. Conserva estos dos archivos generados; no necesitas un `AppModule` ni registrar manualmente `TaskService` en `app.config.ts`.


<br/>

<br/>

### Paso 2. Definir el modelo Task


```powershell
New-Item -ItemType Directory -Path src/app/models -Force
```

Crea el siguiente archivo en VS Code:

**Archivo: `src/app/models/task.model.ts`**

```typescript
export interface Task {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
  readonly createdAt: Date;
}
```


<br/>

`readonly` evita asignaciones directas a estas propiedades durante la comprobación de tipos. No congela objetos en ejecución ni impide por sí mismo modificar el interior de un `Date`.

**Verifica:** el archivo exporta `Task` con los cuatro campos y VS Code no muestra errores de sintaxis.


<br/>
<br/>

### Paso 3. Generar e implementar TaskService

Ejecuta **una** de estas alternativas equivalentes:

```powershell
ng generate service services/task --type=service --injectable --skip-tests=false
```

```powershell
ng g s services/task --type=service --injectable --skip-tests=false
```

El comando genera `src/app/services/task.service.ts` y `src/app/services/task.service.spec.ts`. `--type=service` fija el sufijo del archivo; `--injectable` solicita el decorador utilizado en este curso. El código inicial exacto puede variar entre versiones de CLI; reemplázalo por el siguiente:


<br/>

**Archivo: `src/app/services/task.service.ts`**

```typescript
import { Injectable, computed, signal } from '@angular/core';
import type { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private nextId = 4;

  private readonly _tasks = signal<readonly Task[]>([
    {
      id: 1,
      title: 'Estudiar el decorador @Injectable',
      completed: true,
      createdAt: new Date(2026, 10, 1)
    },
    {
      id: 2,
      title: 'Crear el primer servicio con Angular CLI',
      completed: true,
      createdAt: new Date(2026, 10, 2)
    },
    {
      id: 3,
      title: 'Implementar inyección de dependencias',
      completed: false,
      createdAt: new Date(2026, 10, 3)
    }
  ]);

  // La vista puede leer el estado; los métodos del servicio lo actualizan.
  readonly tasks = this._tasks.asReadonly();
  readonly totalCount = computed(() => this.tasks().length);
  readonly pendingCount = computed(
    () => this.tasks().filter(task => !task.completed).length
  );

  constructor() {
    console.log('TaskService: instancia creada');
  }

  // Consulta síncrona: devuelve una instantánea independiente.
  getTasks(): Task[] {
    return this.tasks().map(task => ({
      ...task,
      createdAt: new Date(task.createdAt.getTime())
    }));
  }

  addTask(title: string): boolean {
    const cleanTitle = title.trim();
    if (cleanTitle.length === 0 || cleanTitle.length > 100) {
      return false;
    }

    const newTask: Task = {
      id: this.nextId++,
      title: cleanTitle,
      completed: false,
      createdAt: new Date()
    };

    this._tasks.update(tasks => [...tasks, newTask]);
    return true;
  }

  deleteTask(id: number): void {
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  toggleTask(id: number): void {
    this._tasks.update(tasks => tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  getTaskCount(): number {
    return this.totalCount();
  }

  getPendingCount(): number {
    return this.pendingCount();
  }
}
```



<br/>

| Elemento | Función |
|---|---|
| `providedIn: 'root'` | Registra el servicio en el inyector raíz. La instancia se crea cuando se solicita. |
| `_tasks` | Señal privada que almacena las tareas. |
| `tasks` | Señal pública de lectura; refleja los cambios de `_tasks`. |
| `computed()` | Obtiene los totales a partir del estado actual. |
| `update()` | Calcula un nuevo estado y notifica a los consumidores. |
| `getTasks()` | Devuelve una instantánea con copias de las tareas y sus fechas. |
| `addTask()` | Valida el título, asigna el identificador y agrega la tarea. |
| `toggleTask()` / `deleteTask()` | Cambian el estado mediante el identificador de la tarea. |


<br/>

**Precisiones:** `asReadonly()` impide llamar a `set()` o `update()` a través de la señal pública; no realiza una copia profunda ni congela sus datos. En este laboratorio los componentes realizan las modificaciones exclusivamente mediante los métodos del servicio. La señal expone un arreglo de solo lectura y `Task` declara propiedades `readonly` para apoyar esa disciplina en TypeScript.

`getTasks()` permite practicar una consulta síncrona, pero la interfaz utilizará la señal `tasks` para seguir las actualizaciones. Una instantánea no se actualiza automáticamente después de obtenerla.


<br/>

**Verifica:** VS Code reconoce la importación de `Task`. Todavía no necesitas ver el mensaje del constructor: el servicio se creará cuando algún consumidor lo solicite.


<br/>
<br/>

### Paso 4. Construir TaskListComponent

```powershell
ng generate component components/task-list --standalone --type=component --add-type-to-class-name --skip-tests=false
```

`--add-type-to-class-name` asegura que la clase generada y su prueba se llamen `TaskListComponent`, además de conservar el sufijo del archivo.

Reemplaza los archivos del componente por estos contenidos:


<br/>

**Archivo: `src/app/components/task-list/task-list.component.ts`**

```typescript
import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  imports: [DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  private readonly taskService = inject(TaskService);

  readonly tasks = this.taskService.tasks;
  readonly totalCount = this.taskService.totalCount;
  readonly pendingCount = this.taskService.pendingCount;

  onDeleteTask(id: number): void {
    this.taskService.deleteTask(id);
  }

  onToggleTask(id: number): void {
    this.taskService.toggleTask(id);
  }
}
```


<br/>

`inject(TaskService)` obtiene la dependencia. Las propiedades `tasks`, `totalCount` y `pendingCount` conservan las señales del servicio; no son instantáneas de sus valores. No se necesita `ngOnInit` ni un método `loadTasks()`.


<br/>

**Archivo: `src/app/components/task-list/task-list.component.html`**

```html
<section class="task-list-container" aria-labelledby="task-list-title">
  <h2 id="task-list-title">Lista de tareas</h2>

  <div class="task-summary" aria-live="polite">
    <span class="badge-total">Total: {{ totalCount() }}</span>
    <span class="badge-pending">Pendientes: {{ pendingCount() }}</span>
  </div>

  @if (tasks().length === 0) {
    <p class="empty-message">No hay tareas registradas. ¡Agrega una nueva tarea!</p>
  } @else {
    <ul class="task-list">
      @for (task of tasks(); track task.id) {
        <li class="task-item" [class.completed]="task.completed">
          <input type="checkbox"
            [id]="'task-' + task.id"
            [checked]="task.completed"
            (change)="onToggleTask(task.id)">

          <label [for]="'task-' + task.id" class="task-title">
            {{ task.title }}
          </label>

          <span class="task-date">{{ task.createdAt | date:'dd/MM/yyyy' }}</span>

          <button type="button" class="btn-delete"
            [attr.aria-label]="'Eliminar ' + task.title"
            (click)="onDeleteTask(task.id)">✕</button>
        </li>
      }
    </ul>
  }
</section>
```


<br/>

`@if` y `@for` forman parte de la sintaxis de plantillas y no requieren `CommonModule`. El pipe `date` sí necesita `DatePipe` en `imports`. `track task.id` conserva la identidad visual de cada tarea.


<br/>
<br/>

**Archivo: `src/app/components/task-list/task-list.component.css`**

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

@media (max-width: 520px) {
  .task-item { flex-wrap: wrap; }
  .task-date { margin-left: 24px; }
}
```


<br/>

**Verifica:** el componente importa `DatePipe`, lee las señales con paréntesis y delega las modificaciones en `TaskService`.


<br/>
<br/>

### Paso 5. Construir TaskFormComponent

```powershell
ng generate component components/task-form --standalone --type=component --add-type-to-class-name --skip-tests=false
```

Reemplaza los archivos del componente:


<br/>

**Archivo: `src/app/components/task-form/task-form.component.ts`**

```typescript
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  private readonly taskService = inject(TaskService);

  newTaskTitle = '';
  readonly feedbackMessage = signal('');
  feedbackIsError = false;

  onSubmit(): void {
    const title = this.newTaskTitle.trim();
    const added = this.taskService.addTask(title);
    this.feedbackIsError = !added;

    if (!added) {
      this.feedbackMessage.set('Ingresa un título de entre 1 y 100 caracteres.');
      return;
    }

    this.feedbackMessage.set(`Tarea "${title}" agregada correctamente.`);
    this.newTaskTitle = '';
  }
}
```


<br/>

El servicio valida el título y el formulario muestra el resultado. El mensaje se borra al volver a escribir y no utiliza temporizadores. La señal `feedbackMessage` notifica sus cambios a la plantilla.


<br/>

**Archivo: `src/app/components/task-form/task-form.component.html`**

```html
<section class="task-form-container" aria-labelledby="task-form-title">
  <h3 id="task-form-title">Agregar nueva tarea</h3>

  <form (ngSubmit)="onSubmit()" class="task-form">
    <div class="form-group">
      <label for="taskTitle">Título de la tarea:</label>
      <input type="text" id="taskTitle" name="taskTitle"
        [(ngModel)]="newTaskTitle"
        (ngModelChange)="feedbackMessage.set('')"
        placeholder="Ej: Revisar documentación de Angular"
        class="form-input" maxlength="100" autocomplete="off">
    </div>
    <button type="submit" class="btn-submit">+ Agregar tarea</button>
  </form>

  @if (feedbackMessage()) {
    <p class="feedback-message" [class.error]="feedbackIsError" role="status">
      {{ feedbackMessage() }}
    </p>
  }
</section>
```


<br/>

`FormsModule` proporciona `ngModel` y `ngSubmit`. El atributo `name` permite registrar el campo dentro del formulario. Se permite enviar el formulario vacío para observar la validación del servicio.

**Archivo: `src/app/components/task-form/task-form.component.css`**


<br/>

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

.feedback-message.error {
  background-color: #fff3cd;
  border-color: #ffe69c;
  color: #664d03;
}
```


<br/>

**Verifica:** `TaskFormComponent` importa `FormsModule` y solicita `TaskService`. No agregues `TaskService` a `providers` en ninguno de los dos componentes: queremos que ambos utilicen el proveedor raíz.


<br/>
<br/>

### Paso 6. Integrar la aplicación en AppComponent

Reemplaza **una sola vez** el componente raíz y sus archivos relacionados:

**Archivo: `src/app/app.component.ts`**

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
  readonly title = 'Gestión de tareas — Lab 08';
}
```


<br/>

**Archivo: `src/app/app.component.html`**

```html
<div class="app-container">
  <header class="app-header">
    <h1>📋 {{ title }}</h1>
    <p class="app-subtitle">Organiza tus tareas pendientes</p>
  </header>

  <main class="app-main">
    <app-task-form></app-task-form>
    <app-task-list></app-task-list>
  </main>

  <footer class="app-footer">
    <p>Los cambios se conservan durante esta sesión y se reinician al recargar.</p>
  </footer>
</div>
```


<br/>

**Archivo: `src/app/app.component.css`**

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


<br/>

Reemplaza también los estilos globales:

**Archivo: `src/styles.css`**

```css
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; }
button, input { font: inherit; }
```


<br/>

Actualiza también el punto de entrada. Algunas versiones de CLI generan una clase raíz llamada `App` incluso al conservar el nombre de archivo `app.component.ts`. Como en este laboratorio la clase se llama `AppComponent`, ambos nombres deben coincidir:

**Archivo: `src/main.ts`**

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch(error => console.error(error));
```


<br/>

Conserva el archivo `src/app/app.config.ts` generado por el CLI.

**Verifica:** `AppComponent` contiene ambos componentes en `imports`. `src/main.ts` importa y arranca esa misma clase. El servicio no se incluye en los `imports` del componente; sus consumidores lo solicitan mediante DI.


<br/>
<br/>

### Paso 7. Ejecutar y comprobar la aplicación

```powershell
ng serve --open
```

Mantén esa terminal abierta. Si el navegador no se abre, visita http://localhost:4200. Para otros comandos utiliza una segunda terminal dentro de `lab08-tareas`.


<br/>

### Prueba manual de integración

Empieza con una recarga limpia. Después realiza las acciones en el orden indicado:

| Acción | Resultado esperado | Total | Pendientes |
|---|---|---:|---:|
| Abrir la aplicación | Tres tareas iniciales: dos completadas y una pendiente | 3 | 1 |
| Agregar `Tarea de prueba` | Aparece inmediatamente en la lista; el campo se vacía | 4 | 2 |
| Completar `Tarea de prueba` | Se marca la casilla y el texto aparece tachado | 4 | 1 |
| Eliminar `Tarea de prueba` | Desaparece de la lista | 3 | 1 |
| Enviar un título vacío o solo espacios | Aparece el mensaje de validación; no se agrega nada | 3 | 1 |
| Eliminar las tres tareas iniciales | Aparece el mensaje de lista vacía | 0 | 0 |
| Agregar una tarea a la lista vacía | Desaparece el mensaje y se muestra la nueva tarea | 1 | 1 |

**No recargues para sincronizar la lista.** La nueva tarea debe aparecer sin F5. Si recargas, reiniciarás los datos; esto es esperado porque no hay persistencia.


<br/>

### Comprobar la instancia compartida

Abre la consola del navegador. Desactiva temporalmente **Preserve log**, limpia la consola y recarga una sola vez sin editar archivos. Debe aparecer una sola creación de `TaskService` para ese arranque:

```text
TaskService: instancia creada
```

Editar código, recargar o reiniciar el servidor puede generar nuevas creaciones; el recuento no debe acumular registros de sesiones anteriores. La presencia de un mensaje es evidencia del arranque observado, no una garantía de que toda clase de servicio sea singleton.


<br/>
<br/>

### Paso 8. Explicar y comprobar la sincronización con signals

La aplicación ya debe funcionar. Este paso explica su mecanismo, sin reemplazar los componentes por una segunda implementación.

1. En el formulario identifica `inject(TaskService)` y la llamada a `addTask()`.
2. En el servicio identifica `_tasks.update(...)`. Se produce un nuevo arreglo al agregar, completar o eliminar.
3. En la lista identifica `readonly tasks = this.taskService.tasks`.
4. En la plantilla identifica `tasks()`, `totalCount()` y `pendingCount()`. Angular sigue esas lecturas y actualiza la vista cuando cambia el estado.
5. Agrega tres tareas seguidas y comprueba que la lista y ambos contadores cambian sin recargar.
6. Compara el uso reactivo con la consulta `getTasks()`: esta última devuelve una instantánea que no cambia cuando después se agregan tareas.


<br/>

| Concepto | Qué demuestra esta aplicación |
|---|---|
| Instancia compartida | Formulario y lista acceden al mismo `TaskService` raíz. |
| Estado reactivo | La señal comunica los cambios a las plantillas que la leen. |
| Estado derivado | `computed()` mantiene total y pendientes a partir de las tareas. |
| Encapsulación | Los métodos del servicio concentran las modificaciones. |
| Consulta síncrona | `getTasks()` devuelve de inmediato una copia del estado actual. |
| Persistencia | No se implementa; recargar restablece los datos iniciales. |


<br/>

**Alternativa de inyección conocida:** también puedes solicitar el servicio con `constructor(private taskService: TaskService) {}`. Es válida; este laboratorio usa `inject()` y evita combinar ambas formas para la misma dependencia. Si necesitas inicializar propiedades desde un servicio recibido por constructor, hazlo cuando esa dependencia ya esté disponible.

**Reflexión:** ¿por qué compartir el mismo objeto de servicio no bastaba para actualizar automáticamente una copia local del arreglo? Respuesta esperada: compartir una instancia da acceso a los mismos datos, pero una instantánea local necesita recargarse o sustituirse; la señal aporta el seguimiento reactivo que utiliza la vista.


<br/>
<br/>

### Paso 9. Comparar proveedores raíz y proveedores por componente

#### 9.1 Crear el servicio de diagnóstico

```powershell
ng generate service services/counter --type=service --injectable --skip-tests=false
```

Reemplaza su implementación:


<br/>

**Archivo: `src/app/services/counter.service.ts`**

```typescript
import { Injectable, signal } from '@angular/core';

// Sin registro automático: el experimento lo proporciona en cada componente.
@Injectable()
export class CounterService {
  private static nextInstanceId = 1;
  readonly instanceId = CounterService.nextInstanceId++;

  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();

  constructor() {
    console.log('CounterService: instancia creada', this.instanceId);
  }

  increment(): void {
    this._count.update(value => value + 1);
  }
}
```


El contador no tiene `providedIn`. El número `instanceId` es un identificador de diagnóstico secuencial de esta ejecución; puede reiniciarse al recargar o reconstruir la aplicación.


<br/>

#### 9.2 Agregar el proveedor y solicitarlo en ambos componentes

Realiza los mismos tres cambios en `task-list.component.ts` y `task-form.component.ts`:

1. Agrega esta importación; ambos archivos están a la misma profundidad:

```typescript
import { CounterService } from '../../services/counter.service';
```

2. Añade esta propiedad **dentro del decorador `@Component` existente**, conservando `imports`, `selector`, `templateUrl` y `styleUrl`:

```typescript
providers: [CounterService],
```

3. Añade esta propiedad **dentro de cada clase**, junto a las demás propiedades:

```typescript
readonly counter = inject(CounterService);
```

Registrar el proveedor no basta para observar el constructor: cada componente debe solicitar la dependencia. `inject` ya está importado en ambos archivos.


<br/>

<br/>

### 9.3 Mostrar y comparar los estados

Agrega temporalmente este bloque al final de **cada** plantilla, fuera de cualquier `<form>`:

```html
<section class="scope-demo">
  <p>Contador de diagnóstico — instancia {{ counter.instanceId }}:
    {{ counter.count() }}</p>
  <button type="button" (click)="counter.increment()">Incrementar este contador</button>
</section>
```

Limpia la consola y recarga una vez. Debes observar:

- Dos identificadores de `CounterService` diferentes, uno por componente.
- Dos contadores inicialmente en cero.
- Al incrementar el contador del formulario, el de la lista permanece igual, y viceversa.
- Las tareas siguen compartiéndose a través de la instancia raíz de `TaskService`.
- Una creación de `TaskService` y dos de `CounterService` en ese arranque. El orden de los mensajes no es parte del criterio.

**Interpretación:** el proveedor local obtiene una instancia por instancia del componente. Sus descendientes también pueden utilizarla si no hay otro proveedor aplicable más cercano. `providedIn: 'root'` permite compartir la instancia raíz; no impide que un proveedor local proporcione otra instancia de la misma clase.


<br/>
<br/>

### 9.4 Ajustar la prueba del contador

Como el contador no está registrado en la raíz, reemplaza la prueba generada por esta comprobación de inyectores independientes:

**Archivo: `src/app/services/counter.service.spec.ts`**

```typescript
import { Injector } from '@angular/core';
import { describe, expect, it } from 'vitest';
import { CounterService } from './counter.service';

describe('CounterService: proveedores independientes', () => {
  it('mantiene una instancia y un estado independientes por inyector', () => {
    const injectorA = Injector.create({ providers: [CounterService] });
    const injectorB = Injector.create({ providers: [CounterService] });
    try {
      const a = injectorA.get(CounterService);
      const b = injectorB.get(CounterService);
      expect(a).toBe(injectorA.get(CounterService));
      expect(a).not.toBe(b);
      a.increment();
      expect(a.count()).toBe(1);
      expect(b.count()).toBe(0);
    } finally {
      injectorA.destroy();
      injectorB.destroy();
    }
  });
});
```


<br/>
<br/>

### 9.5 Retirar el experimento visual y recuperar la aplicación de tareas

**Resultado final:** el formulario y la lista siguen funcionando con `TaskService`, pero ya no muestran ni solicitan el contador de diagnóstico. La limpieza afecta tanto al TypeScript como al HTML de los dos componentes.

Realiza los cambios en el siguiente orden:


<br/>

#### A. Retirar el bloque del HTML de los dos componentes

Abre cada uno de estos archivos:

- `src/app/components/task-list/task-list.component.html`
- `src/app/components/task-form/task-form.component.html`

En **cada archivo**, elimina **todo** el bloque temporal siguiente, desde `<section class="scope-demo">` hasta su `</section>` correspondiente:

```html
<section class="scope-demo">
  <p>Contador de diagnóstico — instancia {{ counter.instanceId }}:
    {{ counter.count() }}</p>
  <button type="button" (click)="counter.increment()">Incrementar este contador</button>
</section>
```

Elimina únicamente esta sección del contador. Conserva la sección original que contiene el formulario o la lista de tareas.

**Si aparece `Property 'counter' does not exist`:** el TypeScript ya no declara `counter`, pero quedó alguna de estas referencias en el HTML: `counter.instanceId`, `counter.count()` o `counter.increment()`. Completa este apartado A en el archivo indicado por el error. No necesitas volver a agregar el contador para resolverlo.


<br/>

#### B. Retirar el contador del TypeScript de los dos componentes

Abre cada uno de estos archivos:

- `src/app/components/task-list/task-list.component.ts`
- `src/app/components/task-form/task-form.component.ts`

En **cada archivo**, retira los tres elementos agregados para el experimento:

1. La importación:

```typescript
import { CounterService } from '../../services/counter.service';
```

2. La entrada del decorador `@Component`:

```typescript
providers: [CounterService],
```

Si agregaste otros proveedores propios, quita solo `CounterService` de ese arreglo. Conserva el resto de la configuración del componente.

3. La propiedad de la clase:

```typescript
readonly counter = inject(CounterService);
```

**Conserva** las importaciones y la inyección de `TaskService`, así como la importación de `inject`: ambos componentes todavía las utilizan para gestionar las tareas.

| Componente | Dependencias que deben permanecer en `imports` |
|---|---|
| `TaskListComponent` | `DatePipe` |
| `TaskFormComponent` | `FormsModule` |

No retires `templateUrl`, `styleUrl`, `selector`, las señales, los métodos de tareas ni sus controles HTML.


<br/>

#### C. Verificar que la limpieza quedó completa

Guarda los **cuatro archivos**. En una segunda terminal PowerShell, ubicada en `lab08-tareas`, ejecuta:

```powershell
Get-ChildItem src/app/components -Recurse -File | Select-String -Pattern 'CounterService|\bcounter\b|scope-demo'
```

Con los archivos de este laboratorio, el comando no debe mostrar coincidencias. Si muestra alguna, revisa si corresponde a un elemento temporal del experimento que todavía debes retirar.

Después ejecuta:

```powershell
ng build
```

Si dejaste `ng serve` activo, la aplicación también se recompilará al guardar. Comprueba que puedes agregar, completar y eliminar tareas y que ya no aparecen contadores de diagnóstico.

**Archivos que se conservan:** `src/app/services/counter.service.ts` y `src/app/services/counter.service.spec.ts`. Su prueba registra proveedores propios y sigue siendo válida aunque el contador ya no se utilice en la interfaz.



<br/>
<br/>

### Paso 10. Inspeccionar con Angular DevTools

1. Mantén `ng serve` activo y abre http://localhost:4200 en un navegador con Angular DevTools instalada.
2. Abre DevTools con F12 y selecciona **Angular**.
3. En **Components**, localiza `AppComponent`, `TaskFormComponent` y `TaskListComponent`. Los módulos y pipes importados no se representan como componentes hijos.
4. Abre **Injector Tree**. Explora las jerarquías de inyectores de entorno y de elemento.
5. Selecciona el inyector raíz/de entorno de la aplicación y localiza `TaskService` en sus proveedores. Si la herramienta permite registrar el proveedor en consola, utilízalo para inspeccionarlo.
6. Si aún tienes activo el experimento del paso 9, selecciona los inyectores de elemento del formulario y de la lista: cada uno debe tener su proveedor local de `CounterService`.
7. En **Profiler**, inicia una grabación, agrega una tarea y detén la grabación. Observa qué vistas se comprobaron. No se exige que todos los componentes tengan siempre la misma actividad: depende de las lecturas y las estrategias de detección de cambios.

Guía de inspección: https://angular.dev/tools/devtools/injectors.


<br/>
<br/>

## Lista de verificación final

- [ ] El proyecto utiliza Angular 22 y componentes standalone.
- [ ] `ng build` termina sin errores.
- [ ] Se muestran las tres tareas iniciales y los contadores 3 / 1.
- [ ] Agregar una tarea actualiza inmediatamente la lista y los contadores.
- [ ] Completar y eliminar tareas conserva la consistencia de los contadores.
- [ ] Un título vacío o solo espacios no se agrega.
- [ ] El estado vacío se muestra correctamente.
- [ ] El experimento de proveedores locales demuestra dos instancias y dos estados independientes.
- [ ] Angular DevTools permite localizar el proveedor de `TaskService` en el inyector raíz.
- [ ] Al recargar se restablecen los datos iniciales; el participante identifica que no hay persistencia.
- [ ] Se retiraron los cambios visuales temporales del experimento y no hay errores en la consola.


<br/>
<br/>

## Resolución de problemas

| Síntoma | Causa probable | Acción |
|---|---|---|
| Angular CLI rechaza Node.js | Versión incompatible con Angular 22 | Comprueba la rama y versión de Node con la tabla oficial. |
| No se puede ejecutar `ng.ps1` | Restricción de ejecución de scripts de PowerShell | Usa `ng.cmd`; para npm, `npm.cmd`. |
| Los archivos se llaman `app.ts` o `task.ts` | Proyecto creado con otra convención de nombres | Usa los comandos explícitos del README o ajusta todas las importaciones y los nombres de clase de forma consistente. |
| No se genera un `.spec.ts` | Configuración `skipTests` del proyecto | Comprueba `angular.json`; los comandos del README incluyen `--skip-tests=false`. |
| `app-task-form` o `app-task-list` no es conocido | Faltan los componentes en `AppComponent.imports` | Conserva la única implementación del paso 6. |
| `No matching export` para `App` | `main.ts` sigue importando el nombre inicial de la clase raíz | Actualiza `src/main.ts` con el contenido del paso 6 y utiliza `AppComponent`. |
| `ngModel` no es conocido | Falta `FormsModule` | Importa el módulo y agrégalo a `imports` de `TaskFormComponent`; conserva `name="taskTitle"`. |
| No se encuentra el pipe `date` | Falta `DatePipe` | Impórtalo y añádelo a `imports` de `TaskListComponent`. |
| La lista no se actualiza al agregar | Se guardó una instantánea o hay proveedores locales de tareas | Conserva la señal en el componente, léela con `tasks()` y elimina registros locales de `TaskService`. |
| La señal no notifica al modificar | Se mutó el arreglo con `push()` sin actualizar la señal | Utiliza los métodos mostrados, que producen un nuevo estado con `update()`. |
| `No provider found` para `CounterService` | Se inyectó el contador sin un proveedor accesible | Agrega el proveedor en cada componente durante el experimento, o retira también su inyección al terminar. |
| No aparecen mensajes de `CounterService` | Solo se registró el proveedor | Añade `readonly counter = inject(CounterService)` en cada componente. |
| La consola muestra varias creaciones | Se acumulan recargas o hubo reconstrucciones | Desactiva Preserve log y evalúa una sola carga limpia. Comprueba también que no duplicaste proveedores. |
| DevTools no detecta Angular | Extensión deshabilitada, página incorrecta o build de producción | Abre la aplicación de `ng serve` y recarga con la extensión activa. |
| Falla la prueba del título inicial | Sigue la prueba de bienvenida del CLI | Sustituye `app.component.spec.ts` por las pruebas de este README. |
| Las fechas iniciales se desplazan un día | Se sustituyeron las fechas locales por cadenas UTC | Conserva los constructores locales mostrados; el mes 10 representa noviembre. |


<br/>
<br/>

## Limpieza y conservación

Detén el servidor con Ctrl+C. Conserva el proyecto para futuras prácticas. No es necesario limpiar la caché de npm ni eliminar dependencias para completar el laboratorio. Retira solo el experimento visual del paso 9 como se indicó.


<br/>

<br/>

## Resumen de conceptos aplicados

| Concepto | Aplicación |
|---|---|
| Servicio | Centraliza las tareas y sus operaciones. |
| `@Injectable` | Configura la clase para participar en DI. |
| Proveedor raíz | Permite compartir la instancia de `TaskService` entre los consumidores de ese proveedor. |
| `inject()` | Solicita una dependencia al sistema de Angular. |
| Señales | Representan el estado actual y notifican cambios a los consumidores. |
| `computed()` | Calcula total y pendientes a partir del estado. |
| Proveedor por componente | Proporciona una instancia para cada instancia del componente y sus descendientes aplicables. |
| Consulta síncrona | `getTasks()` devuelve una instantánea inmediata. |
| Encapsulación | Las operaciones de escritura se concentran en el servicio. |
| Pruebas | Verifican reglas y sincronización real entre formulario y lista. |



<br/>
<br/>

## Referencias bibliográficas

- **Compatibilidad de versiones:** requisitos de Node.js, TypeScript y RxJS.  
  https://angular.dev/reference/versions

- **Creación de proyectos:** opciones de `ng new` y convenciones de nombres.  
  https://angular.dev/cli/new

- **Generación de servicios:** argumentos y opciones del generador.  
  https://angular.dev/cli/generate/service

- **Inyección de dependencias:** servicios, consumidores e inyectores.  
  https://angular.dev/guide/di

- **Jerarquía de inyectores:** ámbitos y resolución de proveedores.  
  https://angular.dev/guide/di/hierarchical-dependency-injection

- **Signals:** señales escribibles, señales de lectura y valores calculados.  
  https://angular.dev/guide/signals

- **Control de flujo:** `@if`, `@for` y seguimiento por identificador.  
  https://angular.dev/guide/templates/control-flow

- **Formularios con plantilla:** uso de `FormsModule` y `ngModel`.  
  https://angular.dev/guide/forms/template-driven-forms

- **Angular DevTools:** instalación e inspección de aplicaciones.  
  https://angular.dev/tools/devtools

- **Inspección de inyectores:** jerarquías, proveedores y rutas de resolución.  
  https://angular.dev/tools/devtools/injectors

- **Pruebas de Angular:** entorno de pruebas y Vitest.  
  https://angular.dev/guide/testing

<!-- {% endraw %} -->
