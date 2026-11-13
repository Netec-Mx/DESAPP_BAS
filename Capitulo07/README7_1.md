# Práctica 7.1 Pipes integrados y creación de un pipe personalizado

<br/>
<br/>

## Objetivo

Aplicar pipes integrados para transformar la presentación de textos, fechas, números, moneda, porcentajes y objetos; utilizar parámetros y encadenamiento; y crear al final un pipe standalone llamado `resumen`, que acorte un texto sin modificar el dato original.

<br/>
<br/>
 
## Requisitos previos

- Node.js compatible con Angular 22: para la rama 22, utilizar **22.22.3 o superior dentro de 22.x**; alternativamente, Node.js 24.15.0 o superior dentro de 24.x.
- npm y conexión a Internet para instalar las dependencias.
- VS Code y un navegador.
- Conocer propiedades de TypeScript, interpolación y `[(ngModel)]`.

La guía utiliza Angular CLI **22.2.6**. No necesita instalarlo globalmente. El proyecto resuelto incluye `package-lock.json` para reproducir sus dependencias mediante `npm ci`.


<br/>
<br/>
  
## Verificar el entorno

En PowerShell:

```powershell
node --version
npm --version
code --version
```

Verificar la versión completa de Node.js: no basta con que comience en 22. Si no cumple el mínimo, actualizarlo antes de crear el proyecto.

<br/>
<br/>

## Instrucciones


### Paso 1. Crear el proyecto desde cero

Abrir PowerShell y preparar una carpeta de trabajo:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\angular-labs" | Out-Null
Set-Location "$env:USERPROFILE\angular-labs"
```

Ejecutar el siguiente comando en **una sola línea**. Si ya existe una carpeta llamada `practica-pipes`, elegir otro nombre o utilizar una carpeta de trabajo diferente.

```powershell
npx --yes --package @angular/cli@22.2.6 ng new practica-pipes --routing=false --style=css --standalone --skip-git --skip-tests --file-name-style-guide=2016 --ssr=false --ai-config=none --defaults --package-manager=npm
```

El comando crea la aplicación e instala sus dependencias. Desactiva routing, SSR y archivos de prueba; utiliza CSS, componentes standalone y nombres `app.component.*`. Si aparece una pregunta sobre estadísticas de uso, puede responder **No**.

```powershell
Set-Location practica-pipes
code .
npx ng version
```

Los archivos que se modificarán son:

| Archivo | Propósito |
|---|---|
| `src/main.ts` | Arrancar el componente raíz correcto. |
| `src/app/app.component.ts` | Importar los pipes y definir los datos. |
| `src/app/app.component.html` | Comparar resultados y recibir entradas. |
| `src/app/app.component.css` | Dar presentación al laboratorio. |
| `src/styles.css` | Establecer estilos generales. |
| `src/app/pipes/resumen.pipe.ts` | Implementar el pipe personalizado al final. |

<br/>
<br/>

### Paso 2. Preparar el componente para probar pipes integrados

Reemplazar **todo** el contenido de `src/app/app.component.ts` por:

```typescript
import { Component } from '@angular/core';
import {
  CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, LowerCasePipe,
  PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe
} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule, UpperCasePipe, LowerCasePipe, TitleCasePipe,
    DatePipe, CurrencyPipe, DecimalPipe, PercentPipe, SlicePipe, JsonPipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nombre: string = 'aNa gArCía';
  fecha: Date = new Date('2026-11-05T12:30:00Z');
  precio: number = 1234.5;
  cantidad: number = 1234.567;
  avance: number = 0.756;
  codigo: string = 'ANG-2026-001';
  producto = { id: 1, nombre: 'Teclado', disponible: true };
}
```

<br/>

**Observaciones:**

- El nombre del pipe en la plantilla no siempre coincide con el de su clase: `number` corresponde a `DecimalPipe`.
- Los pipes utilizados deben aparecer en `imports` del componente standalone.
- `FormsModule` permite editar `nombre` mediante `[(ngModel)]`; la transformación visual la realizan los pipes.
- Los datos están elegidos para obtener resultados comprobables. Los formatos numéricos de esta práctica utilizan el locale predeterminado de Angular, `en-US`. Cambiar el idioma del navegador no cambia automáticamente `LOCALE_ID`.

<br/>

Reemplazar `src/main.ts` por:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((error) => console.error(error));
```

**Importante:** algunas versiones del CLI generan la clase raíz con el nombre `App`, incluso cuando los archivos se llaman `app.component.*`. En esta práctica la clase se llama `AppComponent`; por eso `main.ts` debe importar y arrancar `AppComponent`. Conservar el `app.config.ts` generado por el CLI.

<br/>
<br/>


### Paso 3. Crear la plantilla de los pipes integrados

Reemplazar todo `src/app/app.component.html` por:

{% raw %}
```html
<main>
  <header>
    <p class="etiqueta">Práctica 7.1 · Angular</p>
    <h1>Laboratorio de pipes</h1>
    <p>Observa el dato original y compara sus distintas presentaciones.</p>
  </header>

  <section>
    <h2>1. Pipes integrados</h2>
    <label for="nombre">Nombre para transformar:</label>
    <input id="nombre" type="text" [(ngModel)]="nombre">
    <p>Dato original: <strong id="nombre-original">{{ nombre }}</strong></p>
    <div class="tabla-contenedor">
      <table>
        <thead><tr><th>Pipe</th><th>Expresión</th><th>Resultado</th></tr></thead>
        <tbody>
          <tr><td>uppercase</td><td>nombre | uppercase</td><td id="mayusculas">{{ nombre | uppercase }}</td></tr>
          <tr><td>lowercase</td><td>nombre | lowercase</td><td id="minusculas">{{ nombre | lowercase }}</td></tr>
          <tr><td>titlecase</td><td>nombre | titlecase</td><td id="titulo">{{ nombre | titlecase }}</td></tr>
          <tr><td>date</td><td>fecha | date:'dd/MM/yyyy':'UTC'</td><td id="fecha">{{ fecha | date:'dd/MM/yyyy':'UTC' }}</td></tr>
          <tr><td>currency</td><td>precio | currency:'MXN':'symbol-narrow':'1.2-2'</td><td id="moneda">{{ precio | currency:'MXN':'symbol-narrow':'1.2-2' }}</td></tr>
          <tr><td>number</td><td>cantidad | number:'1.2-2'</td><td id="numero">{{ cantidad | number:'1.2-2' }}</td></tr>
          <tr><td>percent</td><td>avance | percent:'1.1-1'</td><td id="porcentaje">{{ avance | percent:'1.1-1' }}</td></tr>
          <tr><td>slice</td><td>codigo | slice:0:3</td><td id="fragmento">{{ codigo | slice:0:3 }}</td></tr>
        </tbody>
      </table>
    </div>
    <h3>json: observar la estructura de un objeto</h3>
    <pre id="objeto-json">{{ producto | json }}</pre>
    <h3>Encadenamiento: titlecase y después slice</h3>
    <p>Primeros tres caracteres del nombre formateado: <strong id="cadena">{{ nombre | titlecase | slice:0:3 }}</strong></p>
    <p class="nota">Los pipes cambian la presentación. El dato original conserva su valor.</p>
  </section>
</main>
```
{% endraw %}


<br/>

La sintaxis general es:

```html
{{ valor | nombreDelPipe:parametro1:parametro2 }}
```

Los parámetros se separan mediante `:`. Los pipes encadenados se ejecutan de izquierda a derecha:

```html
{{ nombre | titlecase | slice:0:3 }}
```

Primero se aplica `titlecase`; después `slice` toma los caracteres de los índices 0, 1 y 2. El extremo final 3 no se incluye.

<br/>
<br/>


### Paso 4. Agregar estilos al laboratorio

Reemplazar `src/app/app.component.css` por:

```css
:host { display: block; color: #16324f; }
main { max-width: 1100px; margin: 0 auto; padding: 32px 20px; }
header { margin-bottom: 28px; }
h1 { font-size: clamp(1.8rem, 4vw, 2.7rem); margin: 8px 0; }
h2 { margin-top: 0; }
h3 { font-size: 1.05rem; margin-top: 24px; }
.etiqueta { color: #526c82; font-weight: 700; }
section { background: white; border: 1px solid #d7e3ed; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
label { display: block; font-weight: 600; margin: 16px 0 8px; }
input, textarea { box-sizing: border-box; width: 100%; max-width: 640px; border: 1px solid #849db3; border-radius: 6px; padding: 10px 12px; font: inherit; color: inherit; background: white; }
input[type=number] { max-width: 140px; }
textarea { min-height: 96px; resize: vertical; }
input:focus, textarea:focus { outline: 3px solid #aed9ee; outline-offset: 2px; }
.tabla-contenedor { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; text-align: left; margin: 16px 0; }
th, td { padding: 12px; border-bottom: 1px solid #d7e3ed; vertical-align: top; }
th { background: #eaf3fa; }
td:nth-child(2) { font-family: Consolas, monospace; font-size: .9rem; }
pre { background: #edf3f8; padding: 16px; border-radius: 8px; overflow-x: auto; }
.nota { background: #eef7f3; border-left: 4px solid #348166; padding: 12px; }
.resultado { overflow-wrap: anywhere; }
```

<br/>

Reemplazar `src/styles.css` por:

```css
body { margin: 0; background: #f5f8fb; font-family: Arial, sans-serif; line-height: 1.5; }
```

<br/><br/>

### Paso 5. Ejecutar y observar los pipes integrados

En la terminal del proyecto:

```powershell
npm start -- --open
```

Abrir `http://localhost:4200` si el navegador no se abre automáticamente. Mantener la terminal en ejecución. Para otros comandos, abrir una segunda terminal en la misma carpeta; también puede detener el servidor con **Ctrl+C** y volver a iniciarlo después.

<br/>
<br/>


### Paso 6. Comprobar los resultados iniciales

| Pipe | Valor de entrada | Resultado esperado |
|---|---|---|
| `uppercase` | `aNa gArCía` | `ANA GARCÍA` |
| `lowercase` | `aNa gArCía` | `ana garcía` |
| `titlecase` | `aNa gArCía` | `Ana García` |
| `date` | Fecha definida en el componente | `05/11/2026` |
| `currency` | `1234.5` | `$1,234.50` (MXN) |
| `number` | `1234.567` | `1,234.57` |
| `percent` | `0.756` | `75.6%` |
| `slice` | `ANG-2026-001` | `ANG` |
| `json` | Objeto `producto` | Texto JSON legible, con sus tres propiedades. |

<br/>

El JSON debe mostrar:

```json
{
  "id": 1,
  "nombre": "Teclado",
  "disponible": true
}
```

<br/>

**Interpretación de los parámetros:**

- `date:'dd/MM/yyyy':'UTC'` fija el formato y la zona horaria de presentación.
- `currency:'MXN':'symbol-narrow':'1.2-2'` presenta moneda mexicana con símbolo y dos decimales. No convierte divisas.
- `number:'1.2-2'` muestra al menos un dígito entero y exactamente dos decimales; redondea para presentar.
- `percent:'1.1-1'` muestra un decimal. El dato `0.756` representa 75.6 %.
- `slice:0:3` toma desde el índice 0 hasta antes del índice 3.

<br/>
<br/>

### Paso 7. Experimentar con parámetros y entradas

Realizar los cambios de uno en uno y registrar qué se observa:

1. Escribir `lUiSa péRez` en el campo. Deben aparecer `LUISA PÉREZ`, `luisa pérez`, `Luisa Pérez` y `Lui` en el encadenamiento. El dato original mostrado debe conservar exactamente `lUiSa péRez`.
2. Cambiar temporalmente `number:'1.2-2'` por `number:'1.0-0'`. Con el dato inicial debe verse `1,235`.
3. Cambiar `slice:0:3` aplicado a `codigo` por `slice:4:8`. Debe verse `2026`.
4. Cambiar el formato de fecha por `date:'yyyy-MM-dd':'UTC'`. Debe verse `2026-11-05`.
5. Restaurar los parámetros originales antes de pasar a la siguiente etapa.

**Punto de control:** identificar qué pipe utiliza cada resultado y explicar por qué formatear un dato no significa modificar el valor almacenado.

<br/>
<br/>

### Paso 8. Crear el pipe personalizado

En la segunda terminal, dentro de `practica-pipes`, ejecutar:

```powershell
npx ng generate pipe pipes/resumen --standalone --skip-tests --type-separator=.
```

Se crea `src/app/pipes/resumen.pipe.ts`. La opción `--type-separator=.` fija ese nombre con punto, para evitar que el CLI genere `resumen-pipe.ts` con otra convención.

<br/>

### Regla de transformación

El pipe `resumen`:

- Recibe un texto y un límite opcional de caracteres.
- Utiliza 40 como límite predeterminado.
- Si el texto cabe, lo devuelve completo.
- Si excede el límite, conserva el inicio del texto y agrega `…`.
- Si recibe un texto vacío, `null` o `undefined`, devuelve una cadena vacía.
- Si el límite no es finito o es menor que 1, devuelve una cadena vacía; los límites decimales se truncan.

El límite cuenta los caracteres conservados **antes** de agregar `…`. Si el recorte termina en un espacio, ese espacio se quita. No se está calculando el ancho visual en píxeles ni preservando palabras completas.

<br/>

Reemplazar todo `src/app/pipes/resumen.pipe.ts` por:

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resumen',
  standalone: true
})
export class ResumenPipe implements PipeTransform {
  transform(valor: string | null | undefined, limite: number = 40): string {
    const texto = valor ?? '';

    if (!Number.isFinite(limite) || limite < 1) {
      return '';
    }

    const maximo = Math.trunc(limite);

    if (texto.length <= maximo) {
      return texto;
    }

    return texto.slice(0, maximo).trimEnd() + '…';
  }
}
```

<br/>

| Elemento | Función |
|---|---|
| `@Pipe` | Declara la clase como un pipe de Angular. |
| `name: 'resumen'` | Establece el nombre que se escribe en el HTML. |
| `standalone: true` | Permite importarlo directamente en el componente. |
| `PipeTransform` | Describe el contrato del método de transformación. |
| `transform(valor, limite)` | Recibe el dato y el parámetro y devuelve la presentación. |
| `valor ?? ''` | Sustituye `null` y `undefined` por una cadena vacía. |
| `slice(0, maximo)` | Obtiene el inicio del texto sin modificar el original. |

El pipe conserva el comportamiento puro predeterminado. No necesita `pure: false`: en esta práctica cambian un texto y un número, que son valores primitivos.

<br/>
<br/>

### Paso 9. Importar y utilizar el pipe personalizado

Reemplazar `src/app/app.component.ts` por esta **versión final completa**. Incluye la importación de `ResumenPipe`, su incorporación a `imports` y las propiedades `descripcion` y `limite`:

```typescript
import { Component } from '@angular/core';
import {
  CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, LowerCasePipe,
  PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumenPipe } from './pipes/resumen.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule, UpperCasePipe, LowerCasePipe, TitleCasePipe,
    DatePipe, CurrencyPipe, DecimalPipe, PercentPipe, SlicePipe, JsonPipe,
    ResumenPipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nombre: string = 'aNa gArCía';
  fecha: Date = new Date('2026-11-05T12:30:00Z');
  precio: number = 1234.5;
  cantidad: number = 1234.567;
  avance: number = 0.756;
  codigo: string = 'ANG-2026-001';
  producto = { id: 1, nombre: 'Teclado', disponible: true };
  descripcion: string = 'Angular permite transformar datos antes de mostrarlos en la vista.';
  limite: number = 30;
}
```

<br/>

En `app.component.html`, conservar la primera sección y añadir la siguiente **inmediatamente antes de `</main>`**:

```html
  <section>
    <h2>2. Pipe personalizado: resumen</h2>
    <label for="descripcion">Descripción original:</label>
    <textarea id="descripcion" [(ngModel)]="descripcion"></textarea>
    <label for="limite">Límite de caracteres:</label>
    <input id="limite" type="number" min="1" step="1" [(ngModel)]="limite">
    <p class="resultado">Original: <span id="descripcion-original">{{ descripcion }}</span></p>
    <p class="resultado">Resumen con límite {{ limite }}: <strong id="resumen">{{ descripcion | resumen:limite }}</strong></p>
    <p class="resultado">Resumen predeterminado (40): <strong id="resumen-default">{{ descripcion | resumen }}</strong></p>
    <p class="resultado">Resumen en mayúsculas: <strong id="resumen-mayusculas">{{ descripcion | resumen:limite | uppercase }}</strong></p>
    <p class="nota">El límite cuenta los caracteres del texto conservado. El signo … se añade después del recorte. Si el texto cabe, se devuelve completo.</p>
  </section>
```

<br/>

Cada uso se interpreta así:

| Expresión | Comportamiento |
|---|---|
| `descripcion | resumen` | Utiliza el límite predeterminado de 40. |
| `descripcion | resumen:limite` | Envía el límite escrito en el campo numérico. |
| `descripcion | resumen:limite | uppercase` | Acorta el texto y después lo presenta en mayúsculas. |

**Recuerda:** el primer argumento de `transform` llega desde la izquierda de `|`; el segundo llega después de `:`.

<br/>
<br/>

### Paso 10. Probar el pipe personalizado

Comprobar estos casos con la descripción inicial:

`Angular permite transformar datos antes de mostrarlos en la vista.`

| Acción | Resultado esperado |
|---|---|
| Mantener el límite inicial de 30 | `Angular permite transformar da…` |
| Observar el resumen predeterminado de 40 | `Angular permite transformar datos antes…` |
| Cambiar el límite a 10 | `Angular pe…` |
| Observar el encadenamiento con límite 10 | `ANGULAR PE…` |
| Cambiar la descripción por `Hola` con límite 10 | `Hola` — sin puntos suspensivos. |
| Vaciar la descripción | Resultado vacío, sin errores. |
| Volver al texto inicial y poner límite 100 | Descripción completa, sin puntos suspensivos. |

Verificar que la descripción original sigue completa aunque el resumen esté recortado.

<br/>
<br/>

### Paso 11. Comprobar la compilación final

Detener el servidor con **Ctrl+C** o utilizar la segunda terminal:

```powershell
npm run build
```

**Resultado esperado:** compilación finalizada correctamente y sin errores de plantilla o TypeScript.

No se requiere ejecutar pruebas unitarias en esta práctica; se omitieron sus archivos para concentrarse en el uso y la construcción del pipe.


<br/>
<br/>

## Preguntas de reflexión

1. ¿El pipe `uppercase` cambia el valor de `nombre` almacenado en el componente? Justificarlo con lo observado.
2. ¿Por qué la clase `DecimalPipe` se utiliza con el nombre `number` en la plantilla?
3. ¿Qué dato representa 75.6 % antes de aplicar `percent`?
4. ¿Qué sucede si se escribe `descripcion | resumen` sin parámetro?
5. ¿Qué diferencia hay entre `resumen:10 | uppercase` y el uso de un solo pipe?

<br/>
<br/>

## Criterios de logro

| Criterio | Cumplido |
|---|---|
| Crea y ejecuta el proyecto Angular desde cero. | ☐ |
| Identifica y prueba los nueve pipes integrados. | ☐ |
| Modifica parámetros y explica los resultados. | ☐ |
| Utiliza encadenamiento en la plantilla. | ☐ |
| Implementa e importa el pipe standalone `resumen`. | ☐ |
| Maneja texto corto y vacío sin errores. | ☐ |
| Conserva los datos originales. | ☐ |
| Compila el proyecto | ☐ |

<br/>
<br/>

## Reto opcional

Agregar un tercer parámetro `sufijo` al pipe, con valor predeterminado `'…'`, para permitir una presentación como:

```html
{{ descripcion | resumen:20:' [ver más]' }}
```

<br/>

Si el texto no se recorta, no debe agregarse el sufijo. Mantener los casos de texto vacío y límite no válido. Este cambio es un ejercicio adicional y no forma parte del proyecto resuelto base.

<br/><br/>

## Problemas frecuentes

| Mensaje o situación | Revisión |
|---|---|
| `No pipe found with name ...` | Verificar que la clase correcta esté en `imports` de `AppComponent`. |
| `Can't bind to ngModel` | Agregar `FormsModule` al import de TypeScript y al arreglo `imports`. |
| `No matching export ... App` | Revisar que `main.ts` importe y arranque `AppComponent`, como indica el paso 3. |
| No se encuentra `resumen.pipe` | Generar con `--type-separator=.` y verificar la carpeta `src/app/pipes`. |
| La compilación se interrumpe al generar el pipe | El código inicial puede no realizar ninguna transformación útil; reemplazarlo por el del paso 7 antes de importarlo. |
| El formato no coincide con la tabla | Verificar datos, parámetros y `LOCALE_ID`; la guía parte del locale predeterminado `en-US`. |
| El puerto 4200 está ocupado | Usar `npm start -- --port 4201 --open`. |
| `npx` no descarga el CLI | Verificar acceso a npm y la configuración de red del equipo. |

<br/>
<br/>


## Referencias oficiales

- Pipes y pipes personalizados: https://angular.dev/guide/templates/pipes
- Generar un proyecto: https://angular.dev/cli/new
- Generar un pipe: https://angular.dev/cli/generate/pipe
- Compatibilidad de versiones: https://angular.dev/reference/versions
- CurrencyPipe: https://angular.dev/api/common/CurrencyPipe
