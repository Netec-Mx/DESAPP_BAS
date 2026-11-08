 
# Práctica 6.2 Comunicando un componente hijo con su componente padre utilizando @Output()

<br/>
<br/>


## Objetivo

Implementar una salida con `@Output()` y `EventEmitter` para que el componente hijo `Usuario` comunique una selección al componente padre `App`, que recibirá el nombre emitido y actualizará un mensaje en pantalla.

<br/>
<br/>

## Prerrequisitos

- Tener completada la práctica 6.1 en el proyecto `decoradores`, con Angular 22.
- Conservar la entrada requerida `nombre` y los estilos creados anteriormente.
- Saber abrir la consola del navegador con `F12`.

Se reutiliza el componente `Usuario`. Los archivos mantienen los nombres `app.ts`, `app.html`, `app.css`, `usuario.ts`, `usuario.html` y `usuario.css`; las clases se llaman `App` y `Usuario`.

<br/>

En PowerShell, abre el proyecto existente:

```powershell
Set-Location "$env:USERPROFILE\angular-labs\decoradores"
code .
ng version
```

Confirma que Angular y Angular CLI pertenecen a la versión principal 22. Si `ng` no está disponible, utiliza `npx ng` seguido del comando correspondiente dentro del proyecto.


<br/>
<br/>

## Instrucciones

### Paso 1. Declarar y emitir el evento en el hijo

Reemplaza `src/app/usuario/usuario.ts` por:

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Usuario {
  @Input({ required: true }) nombre!: string;

  @Output() seleccionado = new EventEmitter<string>();

  seleccionar(): void {
    this.seleccionado.emit(this.nombre);
  }
}
```

Observa la función de cada elemento:

| Elemento | Responsabilidad |
| --- | --- |
| `@Input() nombre` | Recibe el nombre proporcionado desde el padre. |
| `@Output() seleccionado` | Expone un evento personalizado que el padre puede escuchar. |
| `EventEmitter<string>` | Permite emitir un valor de tipo `string`. |
| `seleccionar()` | Atiende la acción del usuario y emite el nombre. |
| `emit(this.nombre)` | Envía como dato del evento el nombre de esta instancia. |

El hijo comunica la selección mediante su salida. La decisión de qué hacer con el nombre recibido corresponde al padre.

<br/>
<br/>

### Paso 2. Agregar el botón a la tarjeta


Reemplaza `src/app/usuario/usuario.html` por:

```html
<article class="tarjeta">
  <p>Componente hijo: Usuario</p>
  <h2>{{ nombre }}</h2>
  <p>Este nombre se recibe desde el componente padre.</p>

  <button type="button" (click)="seleccionar()">
    Seleccionar usuario
  </button>
</article>
```

Agrega estas reglas al final de `src/app/usuario/usuario.css`, conservando los estilos anteriores:

```css
button {
  padding: 0.65rem 1rem;
  border: 0;
  border-radius: 6px;
  background: #2c75b9;
  color: white;
  font: inherit;
  cursor: pointer;
}

button:hover {
  background: #20598e;
}

button:focus-visible {
  outline: 3px solid #e7b82c;
  outline-offset: 3px;
}
```

Al pulsar el botón, `(click)` ejecuta `seleccionar()` en el hijo. Ese método emite el evento personalizado `seleccionado`.

<br/>
<br/>


### Paso 3. Recibir el evento y actualizar el mensaje en App

Reemplaza `src/app/app.ts` por:

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Usuario } from './usuario/usuario';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Usuario],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly nombreUsuario = 'Mariana López';
  readonly usuarioSeleccionado = signal('');

  procesarSeleccion(nombre: string): void {
    this.usuarioSeleccionado.set(nombre);
    console.log('El padre recibió:', nombre);
  }
}
```

`usuarioSeleccionado` guarda el nombre recibido en una señal. El método `set(nombre)` actualiza su valor y `usuarioSeleccionado()` permite leerlo en la plantilla. La señal mantiene sincronizado el mensaje con el estado del padre utilizando la estrategia `OnPush`.

El modificador `readonly` evita reasignar la referencia de la señal; su valor se puede actualizar con `set()`.

Reemplaza `src/app/app.html` por:

```html
<main>
  <h1>Comunicación con &#64;Output()</h1>
  <p>Selecciona un usuario para comunicar su nombre al padre.</p>

  <app-usuario
    [nombre]="nombreUsuario"
    (seleccionado)="procesarSeleccion($event)">
  </app-usuario>

  <app-usuario
    nombre="Carlos Ramírez"
    (seleccionado)="procesarSeleccion($event)">
  </app-usuario>

  <section class="resultado" aria-live="polite">
    <h2>Resultado en el componente padre</h2>

    @if (usuarioSeleccionado()) {
      <p>Usuario seleccionado: <strong>{{ usuarioSeleccionado() }}</strong></p>
    } @else {
      <p>Ningún usuario seleccionado.</p>
    }
  </section>
</main>
```

Se muestran dos instancias del mismo componente. La primera recibe un nombre mediante property binding y la segunda recibe texto literal, como se revisó en la práctica 6.1. Ambas comunican su selección al mismo método del padre.

En el encabezado HTML se utiliza `&#64;` para mostrar el símbolo `@`, que tiene un significado especial en las plantillas de Angular. En pantalla se verá «Comunicación con @Output()».

Si ya realizaste la ampliación de la práctica 6.1, reemplaza la plantilla por el código anterior para mantener exactamente dos tarjetas.

Agrega al final de `src/app/app.css`, conservando sus estilos anteriores:

```css
.resultado {
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border: 1px solid #badbcc;
  border-radius: 10px;
  background: #eff8f3;
  color: #204c36;
}
```

<br/>

### Lectura del enlace de eventos

| Parte del enlace | Significado |
| --- | --- |
| `(seleccionado)` | Evento personalizado expuesto por el hijo. |
| `procesarSeleccion(...)` | Método del padre que atiende el evento. |
| `$event` | Valor enviado por `emit()`: en este caso, el nombre de tipo `string`. |

El `$event` de `(click)` corresponde al evento del navegador. El `$event` de `(seleccionado)` corresponde al valor emitido por el hijo. En esta práctica, el padre recibe un nombre, por lo que el parámetro de su método se declara como `string`.

<br/>
<br/>

### Paso 4. Ejecutar y comprobar la comunicación

1. Si el servidor no está activo, ejecuta:

   ```powershell
   ng serve --open
   ```

2. Abre la consola del navegador con `F12` y selecciona **Console**.

3. Comprueba que aparecen las dos tarjetas y el mensaje inicial **Ningún usuario seleccionado.**

4. En la tarjeta de Mariana López, pulsa **Seleccionar usuario**. El padre debe mostrar:

   ```text
   Usuario seleccionado: Mariana López
   ```

   En la consola debe aparecer:

   ```text
   El padre recibió: Mariana López
   ```

5. Pulsa el botón de Carlos Ramírez. El mensaje debe cambiar a:

   ```text
   Usuario seleccionado: Carlos Ramírez
   ```

6. Alterna entre ambas tarjetas y comprueba que el padre presenta el último nombre recibido. Los nombres mostrados dentro de las tarjetas permanecen iguales.

Si conservaste un nombre diferente en la primera tarjeta, el mensaje debe mostrar ese mismo nombre.

<br/>

## Resultado esperado

La aplicación presenta dos tarjetas del componente hijo `Usuario`, cada una con un botón. Antes de seleccionar, el padre muestra un mensaje inicial. Al pulsar un botón, el hijo emite su nombre y `App` actualiza el resultado con el último usuario seleccionado.

Cada dirección se establece de forma explícita:

| Dirección | Mecanismo utilizado |
| --- | --- |
| Padre → hijo | `@Input()` proporciona el nombre de cada tarjeta. |
| Hijo → padre | `@Output()` comunica la selección con `EventEmitter<string>`. |

La verificación se realiza durante la ejecución. 

<br/>
<br/>

## Verificación final

- [ ] Se utiliza el proyecto `decoradores` de la práctica 6.1, con Angular 22.
- [ ] Se conservan los nombres de archivos modernos y las clases `App` y `Usuario`.
- [ ] El hijo conserva la entrada requerida `nombre`.
- [ ] El hijo importa `Output` y `EventEmitter`.
- [ ] La salida se llama `seleccionado` y emite un `string`.
- [ ] El botón del hijo ejecuta `seleccionar()`.
- [ ] El método del hijo llama a `this.seleccionado.emit(this.nombre)`.
- [ ] El padre escucha `(seleccionado)` en ambas tarjetas.
- [ ] El padre recibe `$event` mediante `procesarSeleccion(nombre: string)`.
- [ ] La plantilla lee la señal mediante `usuarioSeleccionado()`.
- [ ] Seleccionar cada tarjeta actualiza el mensaje con el nombre correspondiente.
- [ ] La terminal y la consola no muestran errores.

<br/>
<br/>

## Ampliación opcional. Comprobar el papel del enlace de eventos

 
1. Retira temporalmente `(seleccionado)="procesarSeleccion($event)"` únicamente de la segunda tarjeta.

2. Guarda y vuelve a seleccionar a Mariana López para establecer un resultado conocido.

3. Pulsa el botón de Carlos Ramírez y observa que el resultado del padre permanece en Mariana López.

4. Restaura el enlace de la segunda tarjeta, guarda y comprueba nuevamente ambos botones.

**Pregunta:** ¿por qué el padre deja de actualizarse desde la segunda tarjeta?

**Respuesta esperada:** el hijo sigue ejecutando `emit()`, pero el padre ya no tiene un enlace que atienda esa salida en la segunda instancia.

<br/>
<br/>

### Preguntas de comprensión

| Pregunta | Respuesta esperada |
| --- | --- |
| ¿Dónde se declara `@Output()`? | En el componente hijo que expone el evento. |
| ¿Qué información recibe el padre en `$event`? | El nombre enviado por `emit(this.nombre)`. |
| ¿Por qué el parámetro del padre es `string`? | Porque la salida utiliza `EventEmitter<string>`. |
| ¿Cuándo se emite el nombre? | Cuando se pulsa el botón y se ejecuta `seleccionar()`. |
| ¿Por qué pueden reutilizarse las dos tarjetas? | Cada instancia recibe su nombre y emite su propia selección mediante la misma interfaz. |

Al terminar, detén el servidor con `Ctrl+C`.

<br/>
<br/>

## Solución de problemas

| Situación | Acción |
| --- | --- |
| TypeScript no reconoce `Output` o `EventEmitter`. | Confirma sus importaciones desde `@angular/core` en `usuario.ts`. |
| El botón no realiza la acción. | Verifica `(click)="seleccionar()"` y la existencia del método en el hijo. |
| El padre no recibe el nombre. | Revisa `emit(this.nombre)` y `(seleccionado)="procesarSeleccion($event)"`. |
| El parámetro del padre tiene un error de tipo. | Comprueba `EventEmitter<string>` y `procesarSeleccion(nombre: string)`. |
| Falta la entrada requerida `nombre`. | Proporciona `[nombre]="nombreUsuario"` o `nombre="Carlos Ramírez"` según la tarjeta. |
| No se reconoce `app-usuario`. | Revisa `import { Usuario } from './usuario/usuario'` e `imports: [Usuario]` en `app.ts`. |
| La plantilla no muestra el nombre de la señal. | Lee su valor con `usuarioSeleccionado()`, incluidos los paréntesis. |
| TypeScript rechaza una asignación a `usuarioSeleccionado`. | Actualiza el valor con `this.usuarioSeleccionado.set(nombre)` en lugar de reasignar la referencia. |
| Aparecen más de dos tarjetas. | Reemplaza `app.html` por la plantilla del paso 3 en lugar de agregarla debajo de la anterior. |

<br/>
<br/>


## Bibliografía adicional

- Angular. Eventos personalizados y `@Output()`: https://angular.dev/guide/components/outputs
- Angular. API de `EventEmitter`: https://angular.dev/api/core/EventEmitter
- Angular. Escucha de eventos: https://angular.dev/guide/templates/event-listeners
- Angular. Señales: https://angular.dev/guide/signals

