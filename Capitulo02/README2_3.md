# Práctica 2.3 Personalización Inicial

## Objetivo

Personalizar el componente raíz de una aplicación Angular 22 modificando sus datos, plantilla y estilos, y comprobar cómo se presenta una propiedad TypeScript mediante interpolación.

<br/>

## Instrucciones

Abre el proyecto hola-mundo en VS Code. Desde una terminal ubicada en la carpeta del proyecto, ejecuta ng serve --open y mantenlo activo durante la práctica. Al guardar cambios, Angular recompila o actualiza la aplicación en el navegador.

### Paso 1. Editar la clase

Reemplaza el contenido de `src/app/app.component.ts` por:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly nombre = 'Escribe aquí tu nombre';
}
```

<br/>

### Paso 2. Editar la plantilla

Reemplaza `src/app/app.component.html` por:

```html
<main class="contenedor">
  <h1>Hola Angular</h1>
  <p>{{ nombre }}, tu aplicación Angular funciona correctamente.</p>
</main>
```

<br/>

### Paso 3. Aplicar un estilo mínimo

Reemplaza `src/app/app.component.css` por:

```css
.contenedor {
  max-width: 720px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
  font-family: Arial, sans-serif;
  border-top: 8px solid #fbb000;
  box-shadow: 0 4px 18px #0002;
}

h1 {
  color: #003b71;
}
```

Guarda los tres archivos. El servidor debe recompilar y actualizar el navegador automáticamente.

<br/>
<br/>

### Paso 4. Verificar el nombre del componente raíz

Antes de ejecutar la aplicación, comprueba que el nombre de la clase del componente raíz coincida con el utilizado en `main.ts`.

1. Abre **`src/app/app.component.ts`** e identifica el nombre declarado después de `export class`, por ejemplo, **`AppComponent`**.

2. Abre **`src/main.ts`** y verifica que ese mismo nombre aparezca en la importación y en la llamada a `bootstrapApplication`:

   ```typescript
   import { AppComponent } from './app/app.component';

   bootstrapApplication(AppComponent, appConfig)
     .catch((err) => console.error(err));
   ```

   Conserva los demás imports y la configuración existente. Si la clase exportada se llama `App`, utiliza `App` en ambos lugares.

3. Guarda los archivos y ejecuta desde la raíz de `hola-mundo`:

   ```powershell
   ng serve -o
   ```

   Si el servidor ya está activo, guarda los cambios y espera la recompilación automática.

 
 <br/>

### Paso 5. Verificar

- [ ] La terminal no muestra errores de compilación.
- [ ] El navegador muestra **Hola Angular**.
- [ ] Aparece tu nombre mediante interpolación `{{ nombre }}`.
- [ ] La página responde en `localhost:4200` o en el puerto alternativo indicado.
- [ ] La captura no contiene información personal ajena a la práctica.


<br/>
<br/>

## Solución de problemas

| Situación | Acción |
| --- | --- |
| `ng` no se reconoce | Reabre PowerShell y verifica `ng version`. |
| La creación se interrumpe | Confirma la conexión y vuelve a ejecutar el comando desde `angular-labs`. |
| El puerto 4200 está ocupado | Usa `ng serve --open --port 4201`. |
| La página no cambia | Guarda los archivos y revisa el primer error mostrado en la terminal. |
| No existe `app.component.ts` | Confirma que utilizaste `--file-name-style-guide=2016`. |

<br/>
<br/>

## Comprueba lo aprendido

1. ¿En qué archivo cambiaste el nombre que aparece en la página?
2. ¿Cómo obtiene la plantilla HTML el valor de la propiedad `nombre`?
3. ¿En qué archivo modificarías el color del encabezado?
4. ¿Qué indica `readonly` en la declaración de la propiedad `nombre`?
5. ¿Qué ocurre en el navegador cuando modificas y guardas los archivos mientras `ng serve` permanece activo?


<br/><br/>

## Bibliografía adicional

- https://angular.dev/guide/components — Explica la relación entre clase, plantilla y estilos, y las propiedades de @Component.

- https://angular.dev/guide/templates/binding — Consultar principalmente la sección de interpolación para comprender {{ nombre }}. 

- https://angular.dev/guide/components/styling — Explica cómo se asocian los estilos CSS al componente mediante styleUrl. 

- https://angular.dev/cli/serve — Referencia de ng serve, actualización al guardar y opciones como --open y --port. 