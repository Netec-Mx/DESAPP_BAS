# Práctica 6.1 Comunicación del padre al hijo con @Input()

<br/>
<br/>

## Objetivo

Crear un componente Usuario con una entrada requerida y proporcionar su valor desde el componente App, distinguiendo el texto literal del enlace de una propiedad del padre.

<br/>

## Prerrequisitos

- Node.js y npm instalados en versiones compatibles con Angular 22.
- VS Code disponible y conocimientos básicos de componentes standalone.

Esta práctica utiliza un proyecto nuevo y no depende de archivos de prácticas anteriores. Se utiliza la nomenclatura moderna: `app.ts`, `app.html`, `app.css`, `usuario.ts`, `usuario.html` y `usuario.css`. Las clases se llaman `App` y `Usuario`.

<br/>
<br/>

## Instrucciones

### Paso 1. Crear el proyecto con Angular 22

En PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\angular-labs" | Out-Null
Set-Location "$env:USERPROFILE\angular-labs"
npx --yes @angular/cli@22 new decoradores --routing=false --style=css --standalone --skip-git --skip-tests --file-name-style-guide=2025 --ssr=false --ai-config=none --package-manager=npm
Set-Location decoradores
code .
ng version
```

El comando de creación selecciona Angular CLI 22 y la convención moderna de nombres. Confirma que Angular y Angular CLI pertenecen a la versión principal 22.

Si `ng` no está disponible en la terminal, utiliza `npx ng version` y antepone `npx` a los comandos `ng` posteriores dentro del proyecto.

<br/>
<br/>

### Paso 2. Generar el componente hijo

Desde la carpeta `decoradores`, ejecuta:

```powershell
ng generate component usuario --standalone --skip-tests --add-type-to-class-name=false
```

Comprueba que se generaron estos archivos:

| Archivo | Responsabilidad |
| --- | --- |
| `src/app/usuario/usuario.ts` | Clase y configuración del hijo. |
| `src/app/usuario/usuario.html` | Plantilla de la tarjeta. |
| `src/app/usuario/usuario.css` | Estilos de la tarjeta. |

La clase del hijo se llama `Usuario`.

<br/>
<br/>

### Paso 3. Declarar la entrada requerida y crear la tarjeta

Reemplaza `src/app/usuario/usuario.ts` por:

```typescript
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
}
```

- `@Input()` permite recibir el valor que proporciona el padre.
- `required: true` exige proporcionar la entrada cuando el componente se utiliza en una plantilla. No comprueba que el texto sea distinto de una cadena vacía.
- `!` indica a TypeScript que la propiedad se asignará aunque no tenga un valor inicial. No asigna un valor ni valida el contenido; Angular establecerá la entrada.

Se conserva la estrategia `OnPush` utilizada por los componentes generados en Angular 22. No es necesario modificarla para recibir esta entrada.

<br/>

Reemplaza `src/app/usuario/usuario.html` por:

```html
<article class="tarjeta">
  <p>Componente hijo: Usuario</p>
  <h2>{{ nombre }}</h2>
  <p>Este nombre se recibe desde el componente padre.</p>
</article>
```

<br/>

Reemplaza `src/app/usuario/usuario.css` por:

```css
:host { display: block; }

.tarjeta {
  max-width: 480px;
  margin: 1rem 0;
  padding: 1.5rem;
  border: 1px solid #c8dcef;
  border-left: 6px solid #2c75b9;
  border-radius: 12px;
  background: #f5f9fd;
  color: #18334d;
}
```

<br/><br/>

### Paso 4. Proporcionar el valor desde App


Reemplaza `src/app/app.ts` por:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
}
```

La importación TypeScript permite referirse a la clase `Usuario`; su inclusión en `imports` permite utilizar el selector del hijo en la plantilla del padre.

<br/>

Reemplaza `src/app/app.html` por:

```html
<main>
  <h1>Comunicación con @Input()</h1>
  <p>Componente padre: App</p>
  <app-usuario [nombre]="nombreUsuario"></app-usuario>
</main>
```

<br/>

Reemplaza `src/app/app.css` por:

```css
:host {
  display: block;
  font-family: Arial, sans-serif;
}

main {
  max-width: 760px;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 { color: #00356b; }
```

| Parte del enlace | Significado |
| --- | --- |
| `[nombre]` | Entrada declarada en el hijo. |
| `nombreUsuario` | Propiedad que Angular evalúa en el padre. |

Los nombres de la propiedad del padre y de la entrada del hijo pueden ser diferentes. El enlace establece la relación entre ambas.

Conserva `src/main.ts` y `src/app/app.config.ts` como los generó el CLI. El archivo `app.ts` exporta la clase `App`, utilizada por el arranque de la aplicación.

<br/><br/>

### Paso 5. Ejecutar y distinguir texto literal de property binding

1. Ejecuta `ng serve --open`.

2. Comprueba que la tarjeta muestra **Mariana López**.

3. Cambia el valor de `nombreUsuario` en `app.ts`, guarda y comprueba que el nuevo nombre aparece en el hijo. Estás editando el código fuente; no se requiere lógica adicional para cambiarlo desde la interfaz.

4. En `app.html`, sustituye temporalmente el enlace por:

   ```html
   <app-usuario nombre="nombreUsuario"></app-usuario>
   ```

5. Guarda y observa que aparece literalmente **nombreUsuario**: sin corchetes, el atributo proporciona texto literal.

6. Restaura el enlace y guarda:

   ```html
   <app-usuario [nombre]="nombreUsuario"></app-usuario>
   ```

**Pregunta:** ¿qué diferencia hay entre `nombre="Mariana López"` y `[nombre]="nombreUsuario"`?

**Respuesta esperada:** el primero envía texto escrito directamente en la plantilla; el segundo evalúa la propiedad del padre y envía su valor.

<br/><br/>

### Paso 6. Comprobar la entrada requerida

1. Retira temporalmente la entrada en `app.html` y guarda:

   ```html
   <app-usuario></app-usuario>
   ```

2. Observa en la terminal el error de compilación que informa que falta la entrada requerida `nombre`.

3. Restaura `[nombre]="nombreUsuario"`, guarda y comprueba que la aplicación vuelve a compilar.

**Pregunta:** ¿`nombre=""` cumple con proporcionar la entrada?

**Respuesta esperada:** sí. La entrada está proporcionada, aunque contenga una cadena vacía. Una regla de contenido necesitaría validación adicional.

<br/><br/>

## Resultado esperado

La aplicación muestra el encabezado «Comunicación con @Input()» y una tarjeta con el nombre definido en `App`. El componente `Usuario` recibe ese dato mediante `@Input()` y lo presenta con `{{ nombre }}`.

La comprobación se realiza durante la ejecución. 


<br/><br/>

## Verificación final

- [ ] El proyecto `decoradores` utiliza Angular 22.
- [ ] Se utilizan `app.ts`, `app.html`, `usuario.ts` y `usuario.html`.
- [ ] Las clases se llaman `App` y `Usuario`, y sus importaciones coinciden.
- [ ] El hijo declara `@Input({ required: true }) nombre!: string;`.
- [ ] La plantilla del hijo presenta `{{ nombre }}`.
- [ ] El padre importa `Usuario` y lo incluye en `imports`.
- [ ] El padre define `nombreUsuario` y utiliza `[nombre]="nombreUsuario"`.
- [ ] Se distingue el texto literal del valor de una propiedad.
- [ ] Se comprobó el error al omitir la entrada y se restauró el enlace.
- [ ] La aplicación termina compilando sin errores.

<br/><br/>

## Ampliación opcional. Reutilizar el componente

 
Agrega una segunda tarjeta en `app.html`, junto a la existente:

```html
<app-usuario [nombre]="nombreUsuario"></app-usuario>
<app-usuario nombre="Carlos Ramírez"></app-usuario>
```


Comprueba que aparecen dos tarjetas con nombres diferentes, sin modificar el código del hijo. Ambas proporcionan la entrada requerida: una mediante property binding y otra mediante texto literal.

**Pregunta:** si cambias `nombreUsuario` en `app.ts` y guardas, ¿cuál tarjeta reflejará el cambio?

Al terminar, detén el servidor con `Ctrl+C`.

<br/><br/>

## Solución de problemas

| Situación | Acción |
| --- | --- |
| El comando `ng` no se reconoce. | Dentro del proyecto, utiliza `npx ng` seguido del comando correspondiente. |
| TypeScript no reconoce `Input`. | Confirma su importación desde `@angular/core` en `usuario.ts`. |
| Falta la entrada requerida `nombre`. | Proporciona `[nombre]="nombreUsuario"` o un texto literal en cada uso del componente. |
| Aparece `Can't bind to 'nombre'` o no se reconoce `app-usuario`. | Revisa el selector, la entrada y `imports: [Usuario]` en el padre. |
| Se muestra literalmente `nombreUsuario`. | Utiliza `[nombre]="nombreUsuario"`. |
| La tarjeta muestra un nombre escrito directamente en su HTML. | Sustituye ese texto por `{{ nombre }}` en `usuario.html`. |
| No existe `nombreUsuario`. | Declara la propiedad dentro de `App` y verifica su escritura. |
| No se encuentra `Usuario` o su archivo. | Confirma `export class Usuario` y la ruta `./usuario/usuario` en `app.ts`. |
| El arranque no encuentra `App`. | Confirma que `app.ts` exporta `App` y conserva la importación de `main.ts` generada por el CLI. |

<br/><br/>


## Bibliografía adicional

- Angular. Entradas y decorador `@Input()`: https://angular.dev/guide/components/inputs
- Angular. Importación de componentes: https://angular.dev/guide/components/importing
- Angular. Enlace de texto y propiedades: https://angular.dev/guide/templates/binding
- Angular CLI. Creación de proyectos: https://angular.dev/cli/new
- Angular CLI. Generación de componentes: https://angular.dev/cli/generate/component

