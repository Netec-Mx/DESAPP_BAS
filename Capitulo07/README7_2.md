# Práctica 7.2 Uso de @if, @for y @switch

<br/><br/>

## Objetivo

Construir un catálogo interactivo para repetir productos con `@for`, seleccionar contenido con `@if` y presentar el estado de un pedido mediante `@switch`. Utilizar una clave estable de seguimiento, variables de contexto y mensajes alternativos para una colección vacía.

<br/><br/>

## Instrucciones

<br/>

### Paso 1. Crear el proyecto desde cero

Abrir PowerShell y comprobar el entorno:

```powershell
node --version
npm --version
code --version
```

Preparar la carpeta de trabajo:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\angular-labs" | Out-Null
Set-Location "$env:USERPROFILE\angular-labs"
```

Estar en `angular-labs`, no dentro de `practica-pipes`. Si ya existe `practica-control-flujo`, utilizar otra carpeta de trabajo para no sobrescribirla.

Ejecutar en **una sola línea**:

```powershell
npx --yes --package @angular/cli@22.2.6 ng new practica-control-flujo --routing=false --style=css --standalone --skip-git --skip-tests --file-name-style-guide=2016 --ssr=false --ai-config=none --defaults --package-manager=npm
```

El comando crea el proyecto e instala sus dependencias. No utiliza routing, SSR, Bootstrap ni archivos de prueba. Si aparece una pregunta sobre estadísticas de uso, puede responder **No**.

```powershell
Set-Location practica-control-flujo
code .
npx ng version
```

<br/>

### Archivos que se modificarán

| Archivo | Propósito |
|---|---|
| `src/main.ts` | Arrancar `AppComponent`. |
| `src/app/app.component.ts` | Definir datos y acciones. |
| `src/app/app.component.html` | Incorporar los bloques en tres etapas. |
| `src/app/app.component.css` | Presentar el catálogo y los estados. |
| `src/styles.css` | Definir estilos generales. |

<br/><br/>

### Paso 2. Definir datos y acciones

Reemplazar por completo `src/app/app.component.ts` con lo siguiente. Esta clase se conserva durante las tres etapas:

```typescript
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mostrarCatalogo: boolean = true;
  estadoPedido: string = 'pendiente';
  productos: Producto[] = this.crearProductos();

  invertirOrden(): void {
    this.productos = [...this.productos].reverse();
  }

  vaciarCatalogo(): void {
    this.productos = [];
  }

  restaurarCatalogo(): void {
    this.productos = this.crearProductos();
  }

  private crearProductos(): Producto[] {
    return [
      { id: 1, nombre: 'Teclado mecánico', precio: 1299.90, stock: 8 },
      { id: 2, nombre: 'Monitor de 24 pulgadas', precio: 4499, stock: 2 },
      { id: 3, nombre: 'Ratón inalámbrico', precio: 349.50, stock: 0 }
    ];
  }
}
```

<br/>

### Qué representa cada elemento

| Elemento | Función |
|---|---|
| `Producto` | Describe la estructura de cada producto. |
| `productos` | Colección que recorrerá `@for`. |
| `mostrarCatalogo` | Valor booleano que evaluará `@if`. |
| `estadoPedido` | Cadena que comparará `@switch`. |
| `invertirOrden()` | Reordena una copia del arreglo; conserva los productos y sus identificadores. |
| `vaciarCatalogo()` | Sustituye la colección por un arreglo vacío. |
| `restaurarCatalogo()` | Crea de nuevo los tres productos iniciales. |

La propiedad `productos` se inicializa llamando a `crearProductos()`. El método privado reúne los datos iniciales en un solo lugar para poder restaurarlos.

<br/>

Reemplazar `src/main.ts` por:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((error) => console.error(error));
```

**Importante:** la clase raíz de esta práctica se llama `AppComponent`. Aunque el CLI genere inicialmente una clase llamada `App`, `main.ts` debe importar y arrancar `AppComponent`, como se muestra arriba. Conservar el archivo `app.config.ts` generado por el CLI.

<br/><br/>

### Paso 3. Agregar la presentación

Reemplazar `src/app/app.component.css` por:

```css
:host { display: block; color: #173653; }
main { max-width: 1120px; margin: 0 auto; padding: 36px 20px; }
header { margin-bottom: 28px; }
h1 { font-size: clamp(1.8rem, 4vw, 2.7rem); line-height: 1.2; margin: 8px 0 12px; }
h2 { margin-top: 0; font-size: 1.4rem; }
h3 { font-size: 1.15rem; }
.etiqueta { color: #526c82; font-weight: bold; }
.panel { padding: 24px; margin-bottom: 24px; border: 1px solid #d8e3ed; border-radius: 14px; background: white; }
.acciones { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0; }
button { font: inherit; font-weight: 600; border: 1px solid #a4b8c9; color: #173653; background: white; border-radius: 8px; padding: 10px 14px; cursor: pointer; }
button:hover { background: #eaf3fa; }
button:focus-visible { outline: 3px solid #2389bd; outline-offset: 3px; }
button.activo { color: white; background: #173653; border-color: #173653; }
.cuadricula { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.producto { border: 1px solid #cfdae4; border-radius: 10px; padding: 20px; background: white; }
.producto.par { background: #f0f6fb; }
.posicion { font-size: .85rem; color: #526c82; }
.precio { font-size: 1.4rem; font-weight: bold; margin-bottom: 12px; }
.etiqueta-stock { display: inline-block; border-radius: 6px; padding: 6px 10px; font-weight: bold; }
.disponible { background: #dff3e7; color: #195938; }
.pocas { background: #fff0c2; color: #744b00; }
.agotado { background: #fce6e6; color: #8b2828; }
.contexto { font-size: .85rem; color: #526c82; margin-bottom: 0; }
.aviso { padding: 18px; background: #edf3f8; border-left: 4px solid #527a9a; border-radius: 6px; }
.estado { padding: 18px; border-radius: 8px; font-weight: 600; }
.pendiente { background: #fff0c2; color: #744b00; }
.enviado { background: #dceefa; color: #174d73; }
.entregado { background: #dff3e7; color: #195938; }
.revision { background: #fce6e6; color: #8b2828; }
.nota { color: #526c82; font-size: .95rem; }
@media (max-width: 780px) { .cuadricula { grid-template-columns: 1fr; } .panel { padding: 18px; } }
```

<br/>

Reemplazar `src/styles.css` por:

```css
body { margin: 0; background: #f5f8fb; font-family: Arial, sans-serif; line-height: 1.5; }
```

Los estilos no realizan las condiciones de la práctica: solo dan color y distribución a los elementos que Angular renderiza. `[class.par]="$even"` aplica la clase `par` según la posición de cada producto; no necesita `NgClass`.

<br/><br/>

### Paso 4. Primera etapa: repetir productos con @for

Reemplazar todo `src/app/app.component.html` por:

```html
<main>
  <header>
    <p class="etiqueta">Práctica 7.2 · Angular</p>
    <h1>Catálogo interactivo</h1>
    <p>Controla qué contenido aparece, repite tarjetas y cambia la vista del pedido.</p>
  </header>
  <section class="panel">
    <h2>1. Catálogo de productos</h2>
    <p>Total de productos: {{ productos.length }}</p>
    <div class="acciones">
      <button id="invertir" type="button" (click)="invertirOrden()">Invertir orden</button>
      <button id="vaciar" type="button" (click)="vaciarCatalogo()">Vaciar catálogo</button>
      <button id="restaurar" type="button" (click)="restaurarCatalogo()">Restaurar catálogo</button>
    </div>
    <div class="cuadricula">
      @for (producto of productos; track producto.id;
            let i = $index, primero = $first, ultimo = $last) {
            <article class="producto" [class.par]="$even" [id]="'producto-' + producto.id">
              <p class="posicion">Producto {{ i + 1 }} · ID {{ producto.id }}</p>
              <h3>{{ producto.nombre }}</h3>
              <p class="precio">{{ producto.precio | currency:'MXN':'symbol-narrow':'1.2-2' }}</p>
              <p>Existencias: {{ producto.stock }}</p>
              <p class="contexto">Primero: {{ primero }} · Último: {{ ultimo }}</p>
            </article>
      } @empty {
        <p id="catalogo-vacio" class="aviso">No hay productos en el catálogo.</p>
      }
    </div>
  </section>
</main>
```

<br/>

Iniciar la aplicación:

```powershell
npm start -- --open
```

Abrir `http://localhost:4200` si el navegador no lo hace automáticamente. Mantener la terminal en ejecución y abrir una segunda terminal para otros comandos.

<br/>

### Interpretar el bloque

```html
@for (producto of productos; track producto.id;
      let i = $index, primero = $first, ultimo = $last) {
  <!-- Contenido que se repite por cada producto -->
} @empty {
  <!-- Contenido alternativo cuando la colección está vacía -->
}
```


- `producto` representa el elemento de la iteración actual.
- `productos` es la colección.
- `track producto.id` identifica de manera única y estable cada producto y permite reutilizar su vista cuando cambia de posición.
- `i`, `primero` y `ultimo` son alias de variables de contexto.
- `$even` es `true` cuando el índice es par, comenzando en 0.
- `@empty` se muestra si la colección no tiene elementos; se escribe después del bloque `@for`.

`producto` y sus variables de contexto se utilizan dentro de la iteración; no deben consultarse en `@empty` ni fuera de ese ámbito.

<br/>

### Comprobar la primera etapa

| Producto inicial | Índice ($index) | Primero ($first) | Último ($last) | Par ($even) |
|---|---:|---|---|---|
| Teclado mecánico | 0 | true | false | true |
| Monitor de 24 pulgadas | 1 | false | false | false |
| Ratón inalámbrico | 2 | false | true | true |

<br/>

La página presenta la posición como `i + 1`, para mostrar 1, 2 y 3 al usuario; el índice real comienza en 0.

1. Pulsar **Invertir orden**. El ratón pasa al principio y el teclado al final. Los ID siguen siendo 3 y 1; cambian los valores de primero y último según la nueva posición.
2. Pulsar **Vaciar catálogo**. Debe aparecer `No hay productos en el catálogo.` y no debe quedar ninguna tarjeta.
3. Pulsar **Restaurar catálogo**. Deben volver los tres productos en su orden inicial.

**Punto de control:** diferenciar la identidad estable de un producto (`id`) de su posición actual (`$index`).

<br/>
<br/>

### Paso 5. Segunda etapa: agregar @if, @else if y @else

Reemplazar **todo** `src/app/app.component.html` por esta nueva versión. Conserva lo realizado con `@for` y añade dos usos de `@if`:

```html
<main>
  <header>
    <p class="etiqueta">Práctica 7.2 · Angular</p>
    <h1>Catálogo interactivo</h1>
    <p>Controla qué contenido aparece, repite tarjetas y cambia la vista del pedido.</p>
  </header>
  <section class="panel">
    <h2>1. Catálogo y disponibilidad</h2>
    <p id="total">Total de productos: {{ productos.length }}</p>
    <div class="acciones">
      <button id="visibilidad" type="button" (click)="mostrarCatalogo = !mostrarCatalogo">
        {{ mostrarCatalogo ? 'Ocultar catálogo' : 'Mostrar catálogo' }}
      </button>
      <button id="invertir" type="button" (click)="invertirOrden()">Invertir orden</button>
      <button id="vaciar" type="button" (click)="vaciarCatalogo()">Vaciar catálogo</button>
      <button id="restaurar" type="button" (click)="restaurarCatalogo()">Restaurar catálogo</button>
    </div>

    @if (mostrarCatalogo) {
      <div class="cuadricula">
          @for (producto of productos; track producto.id;
                let i = $index, primero = $first, ultimo = $last) {
            <article class="producto" [class.par]="$even" [id]="'producto-' + producto.id">
              <p class="posicion">Producto {{ i + 1 }} · ID {{ producto.id }}</p>
              <h3>{{ producto.nombre }}</h3>
              <p class="precio">{{ producto.precio | currency:'MXN':'symbol-narrow':'1.2-2' }}</p>
              <p>Existencias: {{ producto.stock }}</p>
              @if (producto.stock > 3) {
                <span class="etiqueta-stock disponible">Disponible</span>
              } @else if (producto.stock > 0) {
                <span class="etiqueta-stock pocas">Últimas piezas</span>
              } @else {
                <span class="etiqueta-stock agotado">Agotado</span>
              }
              <p class="contexto">Primero: {{ primero }} · Último: {{ ultimo }}</p>
            </article>
          } @empty {
            <p id="catalogo-vacio" class="aviso">No hay productos en el catálogo.</p>
          }
      </div>
    } @else {
      <p id="catalogo-oculto" class="aviso">El catálogo está oculto.</p>
    }
    <p class="nota">El fondo alterno corresponde a los índices pares: 0, 2, 4…</p>
  </section>
</main>
```

<br/>
<br/>

### Paso 6. Mostrar u ocultar el catálogo

```html
@if (mostrarCatalogo) {
  <!-- Se renderiza la lista de productos -->
} @else {
  <p>El catálogo está oculto.</p>
}
```

El botón cambia un booleano con `mostrarCatalogo = !mostrarCatalogo`.

| Valor | Vista renderizada |
|---|---|
| `true` | Cuadrícula de productos o mensaje `@empty`. |
| `false` | Mensaje `El catálogo está oculto.` |

Aquí se utiliza una condición booleana explícita. Cuando es falsa, Angular retira la vista del catálogo; no se trata solamente de cambiar su visibilidad con CSS. El arreglo `productos` permanece en el componente.

<br/>
<br/>


### Paso 7. Mostrar la disponibilidad de cada producto

```html
@if (producto.stock > 3) {
  <span class="etiqueta-stock disponible">Disponible</span>
} @else if (producto.stock > 0) {
  <span class="etiqueta-stock pocas">Últimas piezas</span>
} @else {
  <span class="etiqueta-stock agotado">Agotado</span>
}
```

Las condiciones se evalúan en orden y se renderiza la primera rama que corresponde.

| Existencias | Rama | Texto |
|---|---|---|
| Más de 3 | `@if` | Disponible |
| De 1 a 3 | `@else if` | Últimas piezas |
| 0 | `@else` | Agotado |

La práctica utiliza existencias no negativas.

<br/>

### Comprobar la segunda etapa

1. Confirmar las etiquetas iniciales: teclado **Disponible**, monitor **Últimas piezas** y ratón **Agotado**.
2. Pulsar **Ocultar catálogo**. Las tarjetas desaparecen y aparece el mensaje alternativo.
3. Pulsar **Mostrar catálogo**. Las tarjetas vuelven y los datos conservan sus valores.
4. Ocultar el catálogo y pulsar **Vaciar catálogo**. Mientras está oculto, debe mantenerse el mensaje de catálogo oculto.
5. Pulsar **Mostrar catálogo**. Ahora debe aparecer el mensaje de colección vacía de `@empty`.
6. Pulsar **Restaurar catálogo**.

**Diferencia importante:** `@if` decide si se renderiza la vista del catálogo; `@empty` decide el contenido alternativo del `@for` cuando su colección está vacía. Ocultar no equivale a vaciar.

<br/>
<br/>

### Paso 8. Tercera etapa: seleccionar una vista con @switch

Conservar la plantilla de la segunda etapa y añadir lo siguiente **inmediatamente antes de `</main>`**:

```html
  <section class="panel">
    <h2>2. Estado del pedido</h2>
    <p>Selecciona un estado para cambiar el mensaje mostrado.</p>
    <div class="acciones">
      <button id="pendiente" type="button" [class.activo]="estadoPedido === 'pendiente'" (click)="estadoPedido = 'pendiente'">Pendiente</button>
      <button id="enviado" type="button" [class.activo]="estadoPedido === 'enviado'" (click)="estadoPedido = 'enviado'">Enviado</button>
      <button id="entregado" type="button" [class.activo]="estadoPedido === 'entregado'" (click)="estadoPedido = 'entregado'">Entregado</button>
      <button id="otro" type="button" [class.activo]="estadoPedido === 'desconocido'" (click)="estadoPedido = 'desconocido'">Otro estado</button>
    </div>
    <p>Valor actual: <strong id="estado-actual">{{ estadoPedido }}</strong></p>

    @switch (estadoPedido) {
      @case ('pendiente') {
        <p id="estado-mensaje" class="estado pendiente">Pendiente de envío.</p>
      }
      @case ('enviado') {
        <p id="estado-mensaje" class="estado enviado">El pedido está en camino.</p>
      }
      @case ('entregado') {
        <p id="estado-mensaje" class="estado entregado">El pedido fue entregado.</p>
      }
      @default {
        <p id="estado-mensaje" class="estado revision">El estado requiere revisión.</p>
      }
    }
  </section>
```

<br/>

### Interpretar el bloque

| Elemento | Función |
|---|---|
| `@switch (estadoPedido)` | Obtiene el valor que se comparará. |
| `@case ('pendiente')` | Presenta su bloque cuando el estado coincide con esa cadena. |
| `@case ('enviado')` | Presenta el mensaje de envío. |
| `@case ('entregado')` | Presenta el mensaje de entrega. |
| `@default` | Presenta la alternativa cuando ningún caso coincide. |

Las comparaciones utilizan igualdad estricta (`===`). `@default` es opcional. Sin coincidencia ni `@default`, no se renderiza ningún bloque del `@switch`. No se escribe `break`.

Los botones cambian `estadoPedido` mediante enlace de eventos. La clase `activo` destaca la opción seleccionada; no realiza la selección del bloque.

<br/>

### Comprobar la tercera etapa

| Botón | Valor de estadoPedido | Resultado esperado |
|---|---|---|
| Pendiente | `pendiente` | Pendiente de envío. |
| Enviado | `enviado` | El pedido está en camino. |
| Entregado | `entregado` | El pedido fue entregado. |
| Otro estado | `desconocido` | El estado requiere revisión. |

Debe mostrarse un solo mensaje de estado a la vez.

<br/>
<br/>

### Paso 9. Experimentar con los bloques

Realizar los cambios uno por uno y observar el resultado:

1. En `crearProductos()`, cambiar el `stock` del monitor a 3: seguirá mostrando **Últimas piezas**. Cambiarlo a 4: mostrará **Disponible**. Restaurarlo a 2 al terminar.
2. Ocultar el catálogo y volver a mostrarlo. Explicar por qué el arreglo no queda vacío.
3. Pulsar **Otro estado** y quitar temporalmente el bloque `@default`: el valor actual se mantiene en `desconocido`, pero no aparece un mensaje de estado. Restaurar `@default`.
4. Comparar los contextos antes y después de invertir el orden: cambia la posición, no el identificador del producto.

No reemplazar `track producto.id` por una clave repetida. Cada producto necesita un ID único.

<br/>

### Observación opcional en las herramientas del navegador

Para comprobar la reutilización de un nodo con `track`, restaurar primero el catálogo y ejecutar en la consola del navegador:

```javascript
const tarjetaTeclado = document.getElementById('producto-1');
```

Pulsar **Invertir orden** y ejecutar:

```javascript
tarjetaTeclado === document.getElementById('producto-1')
```

El resultado esperado es `true`: la tarjeta cambió de posición y conserva el mismo nodo. Si se oculta y se vuelve a mostrar el catálogo mediante `@if`, se destruye y se crea esa vista; entonces la comparación con la referencia anterior será `false`.

<br/>
<br/>

### Paso 10. Verificación final

Restaurar los valores iniciales: tres productos, catálogo visible y estado pendiente. Compilar desde la segunda terminal:

```powershell
npm run build
```

**Resultado esperado:** compilación correcta, sin errores de TypeScript ni de plantilla.

<br/>

### Aspecto inicial de la aplicación

| Producto | Precio (MXN) | Existencias | Disponibilidad |
|---|---|---:|---|
| Teclado mecánico | $1,299.90 | 8 | Disponible |
| Monitor de 24 pulgadas | $4,499.00 | 2 | Últimas piezas |
| Ratón inalámbrico | $349.50 | 0 | Agotado |

Los importes usan `CurrencyPipe` con moneda MXN y el locale predeterminado de Angular (`en-US`). No se realiza conversión de divisas. El fondo alterno se aplica a los índices pares 0 y 2.

<br/>
<br/>

### Preguntas de reflexión

1. ¿Por qué conviene seguir los productos mediante su ID cuando el orden puede cambiar?
2. ¿Qué diferencia hay entre ocultar el catálogo y vaciar el arreglo?
3. ¿Qué cambia en `$first` y `$last` al invertir la colección?
4. Si un producto tiene 3 existencias, ¿qué rama se renderiza y por qué?
5. ¿Qué sucede con `@switch` cuando el valor no coincide con un caso y no existe `@default`?
6. ¿Es necesario importar `CommonModule` para estos bloques? ¿Por qué aparece `CurrencyPipe` en `imports`?

<br/>
<br/>

### Criterios de logro

| Criterio | Cumplido |
|---|---|
| Crea una aplicación Angular en un proyecto independiente. | ☐ |
| Repite tarjetas mediante @for y una clave estable. | ☐ |
| Interpreta las variables de contexto. | ☐ |
| Utiliza @empty para una colección vacía. | ☐ |
| Diferencia @if, @else if y @else. | ☐ |
| Distingue ocultar la vista de modificar los datos. | ☐ |
| Selecciona estados con @switch, @case y @default. | ☐ |
| Compila  | ☐ |

<br/>
<br/>

## Reto opcional

1. Agregar un cuarto producto con ID único y observar automáticamente su tarjeta y el nuevo valor de `$last`.
2. Agregar el estado `cancelado`: incorporar un botón, un `@case ('cancelado')` y el mensaje `El pedido fue cancelado.`.
3. Mantener **Otro estado** para comprobar que `@default` sigue funcionando.

<br/>
<br/>


## Problemas frecuentes

| Situación | Revisión |
|---|---|
| Error de bloque incompleto o llaves | Verificar el cierre de cada `@if`, `@for`, `@case` y `@switch`. |
| Se escribieron comillas en el lugar incorrecto | Las cadenas de los casos deben escribirse como `@case ('pendiente')`. |
| Angular pide una expresión track | Incluir `track producto.id` dentro de `@for`. |
| Aviso de claves duplicadas | Asignar un ID único a cada producto. |
| No se encuentra el pipe currency | Importar `CurrencyPipe` y agregarlo a `imports`. |
| No se encuentra la exportación App | Sustituir `main.ts` por el código de la práctica, que usa `AppComponent`. |
| Se intenta acceder a producto fuera del bucle | La variable pertenece al ámbito de la iteración; mover ese acceso dentro del bloque. |
| @empty no aparece aunque la lista está vacía | Confirmar que `mostrarCatalogo` sea `true`. |
| El puerto 4200 está ocupado por la práctica anterior | Detener el servidor anterior o usar `npm start -- --port 4201 --open`. |
| ng new indica que está dentro de un workspace | Volver a la carpeta `angular-labs`, fuera de cualquier proyecto Angular. |

<br/>
<br/>


## Referencias oficiales

- Control de flujo en plantillas: https://angular.dev/guide/templates/control-flow
- Creación de un proyecto: https://angular.dev/cli/new
- Compatibilidad de versiones: https://angular.dev/reference/versions
- CurrencyPipe: https://angular.dev/api/common/CurrencyPipe

<br/>

## Uso del proyecto resuelto descargable

El ZIP contiene el proyecto final y esta guía. No incluye `node_modules`, cachés ni resultados de compilación.

Después de extraerlo, abrir PowerShell en `practica-control-flujo`:

```powershell
npm ci
npm start -- --open
```

Si el puerto 4200 está ocupado:

```powershell
npm start -- --port 4201 --open
```

Para compilar:

```powershell
npm run build
```

Utilizar `npm ci` reproduce las versiones registradas en `package-lock.json`. El proyecto resuelto sirve como referencia; para desarrollar la práctica, comenzar desde el paso 1.
