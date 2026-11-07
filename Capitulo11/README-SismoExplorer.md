# Proyecto final · SismoExplorer

<br/> 
<br/> 

## Objetivo

Desarrollar una aplicación Angular 22 que consulte el servicio GeoJSON de USGS y permita explorar sismos recientes mediante un listado, búsqueda por ubicación, filtro por magnitud y una vista de detalle. Integrar componentes standalone, Signals, servicios, inyección de dependencias, HttpClient, pipes, control de flujo moderno, Bootstrap y enrutamiento.

<br/> 
<br/> 

## Resultado esperado

Al abrir la aplicación se consulta USGS y se muestran sismos de magnitud 2.5 o superior del periodo móvil de los últimos siete días. El usuario puede combinar la búsqueda y el filtro, consultar el detalle, abrir la fuente original y actualizar los datos.

El alcance obligatorio incluye:

- Listado ordenado del evento más reciente al más antiguo.
- Búsqueda por fragmento del texto de ubicación, sin distinguir mayúsculas y minúsculas.
- Filtro de magnitud mínima: 2.5, 3.0, 4.0 o 5.0.
- Detalle con identificador, magnitud, fecha, profundidad, latitud y longitud.
- Estados de carga, error, resultados disponibles y resultados vacíos.
- Diseño adaptable a móvil y escritorio.
- Navegación directa al detalle, incluso al recargar la página.

El mapa queda como ampliación opcional. La aplicación realiza consultas de lectura; no requiere desarrollar un backend ni una base de datos.

> Las cifras, ubicaciones y cantidad de resultados cambian con el catálogo de USGS. Una captura de ejemplo no define los datos que deben aparecer durante la evaluación.

<br/> 
<br/> 

## Instrucciones

### Paso 1. Entorno de desarrollo mínimo

| Herramienta o recurso | Requisito para esta práctica | Comprobación |
|---|---|---|
| Sistema operativo | Windows 11 con PowerShell; también puede usarse macOS o Linux | Abrir una terminal |
| Node.js | Rama 22: 22.22.3 o posterior dentro de 22.x. Alternativas compatibles: 24.15.0 o posterior dentro de 24.x, o 26.x | node --version |
| npm | La versión incluida con una instalación compatible de Node.js | npm --version |
| Angular CLI | 22.x; se puede ejecutar mediante npx sin instalación global | Comando de la sección 2 |
| Angular | 22.x en el proyecto | npx ng version |
| TypeScript | Lo administra el proyecto; para Angular 22.0.x el intervalo oficial es >=6.0.0 y <6.1.0 | npm ls typescript --depth=0 |
| Editor | Visual Studio Code y Angular Language Service, recomendados | code --version |
| Navegador | Chrome, Edge o Firefox actualizado, con herramientas de desarrollo | Abrir DevTools |
| Conexión | Acceso a npm y al servicio HTTPS de USGS | Abrir la liga del servicio |

**Importante:** tener “Node.js 22” no basta: comprueba también la versión menor y el parche. Consulta la tabla oficial si utilizas otra versión de Angular 22:

[https://angular.dev/reference/versions](https://angular.dev/reference/versions)

No es necesario instalar TypeScript globalmente. El CLI creará las dependencias compatibles del proyecto.

<br/> 
<br/> 

### Paso 2. Verificación mínima del ambiente

En PowerShell ejecuta:

~~~powershell
node --version
npm --version
code --version
npx --yes --package @angular/cli@22 ng version
~~~

La primera ejecución de npx puede descargar Angular CLI. Antes de crear el proyecto, la salida debe identificar el CLI 22.x y una versión compatible de Node.js. Aún no aparecerá una aplicación Angular local; eso es normal.

Si ya tienes el CLI global, también puedes consultar:

~~~powershell
ng version
~~~

Para esta guía se usará el CLI 22 mediante npx, aunque el CLI global tenga otra versión.


**Evidencia 1:** captura de las versiones. Si el comando code no está disponible, comprueba la versión desde Ayuda → Acerca de Visual Studio Code.

Puedes instalar la extensión del editor desde la terminal:

~~~powershell
code --install-extension Angular.ng-template
~~~

<br/> 
<br/> 

### Paso 3. Crear y comprobar el proyecto

Ubica la terminal en la carpeta donde guardas tus prácticas y ejecuta el siguiente comando en una sola línea:

~~~powershell
npx --yes --package @angular/cli@22 ng new sismoexplorer --routing --style=css --standalone --skip-git --skip-tests --file-name-style-guide=2016 --ssr=false --ai-config=none --defaults
cd sismoexplorer
code .
npx ng version
npx ng serve --open
~~~

<br/> 

Comprueba que se abre [http://localhost:4200](http://localhost:4200). Para detener el servidor utiliza Ctrl+C.

| Opción | Propósito |
|---|---|
| --routing | Crear la configuración inicial de navegación |
| --style=css | Utilizar hojas de estilo CSS |
| --standalone | Crear una aplicación con componentes standalone |
| --file-name-style-guide=2016 | Mantener nombres como app.component.ts, usados en el curso |
| --ssr=false | Ejecutar esta práctica como aplicación del navegador |
| --skip-tests | Omitir archivos de pruebas generados; se realizará la validación indicada al final |
| --ai-config=none | Omitir configuración adicional de herramientas de IA |
| --skip-git | Omitir la inicialización de un repositorio en esta práctica |
| --defaults | Utilizar los valores predeterminados para las opciones restantes |

A partir de este punto, ejecuta los comandos dentro de la carpeta sismoexplorer. El comando npx ng utilizará el CLI instalado en el proyecto.

<br/> 
<br/> 

### Paso 4. Incorporar Bootstrap

Instala la hoja de estilos de Bootstrap:

~~~powershell
npm install bootstrap@5.3.8
~~~

Se utilizarán su cuadrícula, tarjetas, botones, formularios, alertas y spinner. Esta solución sólo requiere CSS de Bootstrap; la interacción se maneja desde Angular.

<br/> 

### Archivo: src/styles.css

Reemplaza su contenido completo por el siguiente código:

~~~css
@import 'bootstrap/dist/css/bootstrap.min.css';

:root {
  --bs-primary: #087f8c;
  --bs-primary-rgb: 8, 127, 140;
}

body {
  background: #f5f8fa;
  color: #183044;
}

.card { border-color: #dae3e9; }
a, button, input, select { touch-action: manipulation; }
~~~

**Comprueba:** la importación de Bootstrap debe ser la primera regla del archivo. Mantén src/styles.css en la configuración de estilos generada por el CLI.

<br/> 
<br/> 

### Paso 5. Componentes standalone y organización de la solución

Genera los cuatro componentes de funcionalidad:

~~~powershell
npx ng generate component pages/listado-sismos --standalone --skip-tests --type=component
npx ng generate component pages/detalle-sismo --standalone --skip-tests --type=component
npx ng generate component components/filtros-sismos --standalone --skip-tests --type=component
npx ng generate component components/tarjeta-sismo --standalone --skip-tests --type=component
~~~

La opción --type=component mantiene los nombres de archivo utilizados en esta guía.

| Elemento | Responsabilidad |
|---|---|
| AppComponent | Encabezado, pie de página y espacio de navegación |
| ListadoSismosComponent | Mostrar el catálogo y coordinar los filtros |
| FiltrosSismosComponent | Capturar texto y magnitud; emitir cambios al padre |
| TarjetaSismoComponent | Mostrar un evento recibido como entrada |
| DetalleSismoComponent | Resolver el identificador de la ruta y presentar el evento |
| SismosService | Consultar HTTP, transformar datos y compartir el estado |
| MagnitudEtiquetaPipe | Convertir la magnitud en una etiqueta de rango |
| Sismo | Definir los datos que utiliza la interfaz |

Crea las carpetas models, services y pipes dentro de src/app desde el explorador de VS Code. Crea en ellas los archivos indicados en las siguientes secciones.

Los archivos CSS individuales que genera el CLI pueden permanecer vacíos. Los componentes de esta guía usan la hoja global y las clases de Bootstrap.

**Cómo se usa standalone:** cada componente importa directamente en su propiedad imports los componentes, pipes y elementos de navegación que utiliza su plantilla. Se declara standalone: true de forma explícita para hacer visible esta decisión.

<br/> 
<br/> 

### Paso 6. Consultar el servicio y definir el modelo

Servicio de datos:

[https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson)

Abre la liga en el navegador y localiza features. Cada elemento representa un evento con properties y geometry. En esta consulta pública no se envían credenciales ni una API key.

| Dato de la aplicación | Campo de USGS | Consideración |
|---|---|---|
| Identificador | id | Es una cadena |
| Magnitud | properties.mag | Puede ser null |
| Ubicación | properties.place | Texto publicado por USGS, generalmente en inglés |
| Fecha | properties.time | Marca temporal en milisegundos desde Unix epoch |
| Longitud | geometry.coordinates[0] | Primer elemento |
| Latitud | geometry.coordinates[1] | Segundo elemento |
| Profundidad | geometry.coordinates[2] | Kilómetros |
| Liga de origen | properties.url | Página del evento |

La búsqueda funciona sobre el texto original; no traduce nombres de lugares. Para probarla, copia una palabra visible en el listado.

<br/> 

### Archivo: src/app/models/sismo.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
export interface Sismo {
  id: string;
  magnitud: number | null;
  ubicacion: string;
  fecha: number | null;
  longitud: number | null;
  latitud: number | null;
  profundidad: number | null;
  url: string | null;
}

export interface EventoGeoJson {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number | null;
    url: string | null;
    type: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number | null, number | null, number | null];
  };
}

export interface RespuestaUSGS {
  type: 'FeatureCollection';
  features: EventoGeoJson[];
}
~~~

Las interfaces separan la respuesta de transporte del modelo que utiliza la aplicación. La geometría conserva el orden longitud, latitud y profundidad.

El tipado de HttpClient ayuda al compilador, pero no valida por sí mismo la estructura JSON durante la ejecución.

<br/> 
<br/> 

### Paso 7. Servicio HTTP, inyección de dependencias y estado con Signals

Crea el servicio siguiente. Sus Signals privados guardan datos y estado; las versiones públicas de sólo lectura permiten consultarlos desde las vistas.

### Archivo: src/app/services/sismos.service.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, timeout } from 'rxjs';
import { RespuestaUSGS, Sismo } from '../models/sismo';

export type EstadoConsulta = 'inicial' | 'cargando' | 'listo' | 'error';

@Injectable({ providedIn: 'root' })
export class SismosService {
  private readonly http = inject(HttpClient);
  private readonly endpoint =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';

  private readonly datos = signal<Sismo[]>([]);
  private readonly estadoInterno = signal<EstadoConsulta>('inicial');
  private readonly mensajeInterno = signal('');
  private readonly ultimaConsultaInterna = signal<number | null>(null);

  readonly sismos = this.datos.asReadonly();
  readonly estado = this.estadoInterno.asReadonly();
  readonly error = this.mensajeInterno.asReadonly();
  readonly ultimaConsulta = this.ultimaConsultaInterna.asReadonly();

  cargar(forzar = false): void {
    // Reutiliza los datos al navegar; Actualizar fuerza otra petición.
    if (this.estado() === 'cargando') return;
    if (!forzar && this.estado() === 'listo') return;

    this.estadoInterno.set('cargando');
    this.mensajeInterno.set('');

    this.http.get<RespuestaUSGS>(this.endpoint).pipe(
      timeout({ first: 15000 }),
      map(respuesta => respuesta.features
        .filter(evento => evento.properties.type === 'earthquake')
        .map((evento): Sismo => ({
          id: evento.id,
          magnitud: evento.properties.mag,
          ubicacion: evento.properties.place?.trim() || 'Ubicación no disponible',
          fecha: evento.properties.time,
          longitud: evento.geometry.coordinates[0],
          latitud: evento.geometry.coordinates[1],
          profundidad: evento.geometry.coordinates[2],
          url: evento.properties.url
        }))
        .sort((a, b) => (b.fecha ?? 0) - (a.fecha ?? 0)))
    ).subscribe({
      next: sismos => {
        this.datos.set(sismos);
        this.ultimaConsultaInterna.set(Date.now());
        this.estadoInterno.set('listo');
      },
      error: () => {
        this.datos.set([]);
        this.mensajeInterno.set(
          'No fue posible consultar USGS. Revisa tu conexión e intenta de nuevo.'
        );
        this.estadoInterno.set('error');
      }
    });
  }
}
~~~

<br/> 

**Qué debes reconocer en el servicio:**

- @Injectable con providedIn: 'root' proporciona una instancia compartida para la aplicación.
- inject(HttpClient) obtiene la dependencia que realiza la consulta.
- get<RespuestaUSGS>() crea un Observable; subscribe() inicia la solicitud.
- map() transforma la respuesta GeoJSON en un arreglo de objetos Sismo.
- Se seleccionan los registros cuyo type es earthquake y se ordenan por fecha.
- timeout() limita la espera a quince segundos.
- signal() guarda el estado y set() publica los cambios.
- asReadonly() expone la lectura de las señales sin exponer sus métodos de escritura.
- cargar() reutiliza el catálogo durante la navegación; cargar(true) solicita una actualización.
- El bloqueo durante el estado cargando evita solicitudes simultáneas desde los botones.

El servicio público actualiza su catálogo periódicamente, pero nuestra interfaz realiza consultas al entrar por primera vez y al pulsar Actualizar. La última consulta indica cuándo se descargó la respuesta, no la fecha del último sismo.

La respuesta queda temporalmente en Signals para compartirla entre vistas; el origen de los datos es la API.

<br/> 
<br/> 

### Paso 8. Configuración de la aplicación

Configura las dependencias de HTTP y navegación. También registra la configuración regional es-MX para los pipes de fechas y números.

<br/> 

### Archivo: src/app/app.config.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

registerLocaleData(localeEsMx);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    provideHttpClient(),
    provideRouter(routes)
  ]
};
~~~

En Angular 22 HttpClient está disponible por defecto. Aquí se incluye provideHttpClient() explícitamente para mostrar su configuración en app.config.ts.

<br/> 
<br/> 

### Paso 9. Pipes existentes y pipe personalizado

Se utilizarán dos pipes de Angular:

| Pipe | Uso en el proyecto |
|---|---|
| date | Presentar fecha y hora a partir de milisegundos |
| number | Mostrar magnitud, profundidad y coordenadas con un número definido de decimales |

Además, crea el siguiente pipe standalone:

<br/> 

### Archivo: src/app/pipes/magnitud-etiqueta.pipe.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'magnitudEtiqueta', standalone: true })
export class MagnitudEtiquetaPipe implements PipeTransform {
  transform(magnitud: number | null | undefined): string {
    if (magnitud == null) return 'Sin dato';
    if (magnitud >= 5) return '5.0 o más';
    if (magnitud >= 4) return 'De 4.0 a menos de 5.0';
    return 'Menor de 4.0';
  }
}
~~~

Las etiquetas agrupan magnitudes para esta interfaz; no representan una clasificación de daños o riesgo.

**Comprueba:** null y undefined producen “Sin dato”, mientras que 0 es un valor numérico válido.

<br/> 
<br/> 

### Paso 10. Comunicación entre componentes: filtros y tarjetas

### 10.1 Filtros: entradas y salidas modernas

El padre conserva los filtros. El componente hijo los recibe con input() y notifica cambios con output(). Así puede reutilizarse sin conocer el servicio HTTP.

<br/> 

### Archivo: src/app/components/filtros-sismos/filtros-sismos.component.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filtros-sismos',
  standalone: true,
  templateUrl: './filtros-sismos.component.html'
})
export class FiltrosSismosComponent {
  readonly texto = input('');
  readonly minima = input(2.5);
  readonly textoCambiado = output<string>();
  readonly minimaCambiada = output<number>();
}
~~~

<br/> 

### Archivo: src/app/components/filtros-sismos/filtros-sismos.component.html

Reemplaza su contenido completo por el siguiente código:

~~~html
<section class="card card-body mb-4" aria-label="Filtros del catálogo">
  <div class="row g-3">
    <div class="col-12 col-md-8">
      <label for="busqueda" class="form-label">Buscar por ubicación</label>
      <input #busqueda id="busqueda" type="search" class="form-control"
        placeholder="Escribe parte de la ubicación"
        [value]="texto()" (input)="textoCambiado.emit(busqueda.value)">
    </div>
    <div class="col-12 col-md-4">
      <label for="minima" class="form-label">Magnitud mínima</label>
      <select #magnitud id="minima" class="form-select"
        [value]="minima()" (change)="minimaCambiada.emit(+magnitud.value)">
        <option value="2.5">2.5 o superior</option>
        <option value="3">3.0 o superior</option>
        <option value="4">4.0 o superior</option>
        <option value="5">5.0 o superior</option>
      </select>
    </div>
  </div>
  <p class="small text-body-secondary mt-3 mb-0">
    La búsqueda utiliza el texto de ubicación publicado por USGS.
  </p>
</section>
~~~

Observa las referencias de plantilla #busqueda y #magnitud. La propiedad value del select es texto; el operador + la convierte a número antes de emitir el cambio.

No se modifica directamente una entrada. El hijo emite el valor y el padre actualiza su Signal.

<br/> 
<br/> 

### 10.2 Tarjeta: entrada obligatoria y pipes

### Archivo: src/app/components/tarjeta-sismo/tarjeta-sismo.component.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
import { Component, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Sismo } from '../../models/sismo';
import { MagnitudEtiquetaPipe } from '../../pipes/magnitud-etiqueta.pipe';

@Component({
  selector: 'app-tarjeta-sismo',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, MagnitudEtiquetaPipe],
  templateUrl: './tarjeta-sismo.component.html'
})
export class TarjetaSismoComponent {
  readonly sismo = input.required<Sismo>();
}
~~~

<br/> 

### Archivo: src/app/components/tarjeta-sismo/tarjeta-sismo.component.html

Reemplaza su contenido completo por el siguiente código:

~~~html
<article class="card h-100 shadow-sm">
  <div class="card-body d-flex flex-column">
    <p class="mb-2">
      <span class="badge text-bg-primary fs-6">
        M {{ sismo().magnitud === null ? 'No disponible'
          : (sismo().magnitud | number:'1.1-1') }}
      </span>
      <span class="small ms-2">{{ sismo().magnitud | magnitudEtiqueta }}</span>
    </p>
    <h2 class="h5">{{ sismo().ubicacion }}</h2>
    <p class="text-body-secondary">
      {{ sismo().fecha === null ? 'Fecha no disponible'
        : (sismo().fecha | date:'dd/MM/yyyy HH:mm') }}
    </p>
    <p>
      Profundidad:
      @if (sismo().profundidad !== null) {
        {{ sismo().profundidad | number:'1.1-1' }} km
      } @else {
        No disponible
      }
    </p>
    <a [routerLink]="['/sismos', sismo().id]"
      class="btn btn-outline-primary mt-auto"
      [attr.aria-label]="'Ver detalle de ' + sismo().ubicacion">
      Ver detalle
    </a>
  </div>
</article>
~~~


<br/> 

input.required<Sismo>() establece que el padre debe proporcionar el evento. Para leerlo se invoca sismo().

La tarjeta importa sólo DatePipe, DecimalPipe, RouterLink y el pipe personalizado que necesita. El enlace de detalle usa el id real del evento.

<br/> 
<br/> 

### 11. Signals y control de flujo moderno en el listado

#### 11.1 Estado y valores derivados

En el listado:

- busqueda y minima son Signals editables.
- filtrados es un computed() que depende del catálogo y de ambos filtros.
- total es otro computed() que obtiene la cantidad de coincidencias.
- ngOnInit() solicita la carga inicial.
- limpiarFiltros() actualiza ambos Signals con set().

<br/> 

### Archivo: src/app/pages/listado-sismos/listado-sismos.component.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SismosService } from '../../services/sismos.service';
import { FiltrosSismosComponent } from '../../components/filtros-sismos/filtros-sismos.component';
import { TarjetaSismoComponent } from '../../components/tarjeta-sismo/tarjeta-sismo.component';

@Component({
  selector: 'app-listado-sismos',
  standalone: true,
  imports: [DatePipe, FiltrosSismosComponent, TarjetaSismoComponent],
  templateUrl: './listado-sismos.component.html'
})
export class ListadoSismosComponent implements OnInit {
  readonly servicio = inject(SismosService);
  readonly busqueda = signal('');
  readonly minima = signal(2.5);

  readonly filtrados = computed(() => {
    const texto = this.busqueda().trim().toLocaleLowerCase('es');
    const minima = this.minima();
    return this.servicio.sismos().filter(sismo =>
      sismo.ubicacion.toLocaleLowerCase('es').includes(texto) &&
      sismo.magnitud !== null && sismo.magnitud >= minima
    );
  });

  readonly total = computed(() => this.filtrados().length);

  ngOnInit(): void {
    this.servicio.cargar();
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.minima.set(2.5);
  }
}
~~~

computed() deriva los resultados sin mantener una segunda copia editable del arreglo. Cambiar los filtros recalcula la vista y no genera nuevas solicitudes HTTP.

Se excluyen del filtro numérico los registros cuya magnitud sea null; sus datos pueden consultarse por identificador si están presentes en el catálogo descargado.

<br/> 
<br/> 

### 11.2 Plantilla con notación moderna

### Archivo: src/app/pages/listado-sismos/listado-sismos.component.html

Reemplaza su contenido completo por el siguiente código:

~~~html
<div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
  <div>
    <h1 class="h2">Sismos recientes</h1>
    <p class="text-body-secondary mb-0">
      Magnitud 2.5 o superior · Últimos siete días
    </p>
  </div>
  <button type="button" class="btn btn-primary"
    [disabled]="servicio.estado() === 'cargando'"
    (click)="servicio.cargar(true)">
    Actualizar
  </button>
</div>

<app-filtros-sismos
  [texto]="busqueda()" [minima]="minima()"
  (textoCambiado)="busqueda.set($event)"
  (minimaCambiada)="minima.set($event)" />

<section aria-live="polite" [attr.aria-busy]="servicio.estado() === 'cargando'">
  @switch (servicio.estado()) {
    @case ('cargando') {
      <p role="status" class="alert alert-info">
        <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
        Consultando USGS…
      </p>
    }
    @case ('error') {
      <div class="alert alert-danger" role="alert">
        <p>{{ servicio.error() }}</p>
        <button type="button" class="btn btn-outline-danger"
          (click)="servicio.cargar(true)">Reintentar</button>
      </div>
    }
    @case ('listo') {
      <p>
        Resultados: <strong>{{ total() }}</strong>
        @if (servicio.ultimaConsulta(); as fecha) {
          <span class="text-body-secondary">
            · Última consulta: {{ fecha | date:'dd/MM/yyyy HH:mm:ss' }}
          </span>
        }
      </p>
      <div class="row g-3">
        @for (sismo of filtrados(); track sismo.id) {
          <div class="col-12 col-md-6 col-lg-4">
            <app-tarjeta-sismo [sismo]="sismo" />
          </div>
        } @empty {
          <div class="col-12">
            <div class="alert alert-secondary">
              @if (servicio.sismos().length === 0) {
                <p>USGS no devolvió sismos para este periodo.</p>
              } @else {
                <p>No hay sismos que coincidan con los filtros.</p>
                <button type="button" class="btn btn-outline-secondary"
                  (click)="limpiarFiltros()">Limpiar filtros</button>
              }
            </div>
          </div>
        }
      </div>
    }
    @default {
      <p role="status">Preparando consulta…</p>
    }
  }
</section>
~~~

<br/> 
<br/> 

| Construcción | Aplicación |
|---|---|
| @switch, @case y @default | Seleccionar la vista según el estado de consulta |
| @if y @else | Mostrar datos opcionales y mensajes alternativos |
| @for (...; track sismo.id) | Crear una tarjeta por registro con identidad estable |
| @empty | Presentar un mensaje si no hay elementos para recorrer |
| [propiedad] | Enviar valores al hijo y deshabilitar el botón |
| (evento) | Responder a botones y cambios de los filtros |
| {{ expresión }} | Interpolar datos y leer Signals |

@if, @for y @switch son bloques integrados de control de flujo de la plantilla. Se utiliza esta notación moderna en todo el proyecto.

El listado muestra el total después de aplicar ambos filtros. Una respuesta vacía del servicio se diferencia de una búsqueda sin coincidencias.

<br/> 
<br/> 

### Paso 12. Vista de detalle y lectura del parámetro de ruta

El identificador es una cadena y se obtiene de ActivatedRoute. toSignal() convierte el flujo de parámetros de la ruta en una señal; así el detalle también responde a cambios de identificador.

<br/> 

### Archivo: src/app/pages/detalle-sismo/detalle-sismo.component.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
import { Component, OnInit, computed, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SismosService } from '../../services/sismos.service';
import { MagnitudEtiquetaPipe } from '../../pipes/magnitud-etiqueta.pipe';

@Component({
  selector: 'app-detalle-sismo',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, MagnitudEtiquetaPipe],
  templateUrl: './detalle-sismo.component.html'
})
export class DetalleSismoComponent implements OnInit {
  readonly servicio = inject(SismosService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly parametros = toSignal(this.ruta.paramMap, {
    initialValue: this.ruta.snapshot.paramMap
  });

  readonly sismo = computed(() =>
    this.servicio.sismos().find(sismo => sismo.id === this.parametros().get('id'))
  );

  ngOnInit(): void {
    // También funciona al pegar la URL de detalle o recargar el navegador.
    this.servicio.cargar();
  }
}
~~~

<br/> 

### Archivo: src/app/pages/detalle-sismo/detalle-sismo.component.html

Reemplaza su contenido completo por el siguiente código:

~~~html
<a routerLink="/sismos" class="btn btn-outline-secondary mb-3">
  Volver al listado
</a>
<h1 class="h2 mb-3">Detalle del sismo</h1>

<section aria-live="polite" [attr.aria-busy]="servicio.estado() === 'cargando'">
  @switch (servicio.estado()) {
    @case ('cargando') {
      <p role="status" class="alert alert-info">Consultando USGS…</p>
    }
    @case ('error') {
      <div class="alert alert-danger" role="alert">
        <p>{{ servicio.error() }}</p>
        <button type="button" class="btn btn-outline-danger"
          (click)="servicio.cargar(true)">Reintentar</button>
      </div>
    }
    @case ('listo') {
      @if (sismo(); as evento) {
        <article class="card shadow-sm">
          <div class="card-body">
            <h2 class="h4">{{ evento.ubicacion }}</h2>
            <p class="badge text-bg-primary">
              Rango: {{ evento.magnitud | magnitudEtiqueta }}
            </p>
            <dl class="row mb-0">
              <dt class="col-sm-4">Identificador</dt>
              <dd class="col-sm-8">{{ evento.id }}</dd>
              <dt class="col-sm-4">Magnitud</dt>
              <dd class="col-sm-8">
                {{ evento.magnitud === null ? 'No disponible'
                  : (evento.magnitud | number:'1.1-1') }}
              </dd>
              <dt class="col-sm-4">Fecha y hora local</dt>
              <dd class="col-sm-8">
                {{ evento.fecha === null ? 'No disponible'
                  : (evento.fecha | date:'dd/MM/yyyy HH:mm:ss') }}
              </dd>
              <dt class="col-sm-4">Profundidad</dt>
              <dd class="col-sm-8">
                @if (evento.profundidad !== null) {
                  {{ evento.profundidad | number:'1.1-1' }} km
                } @else { No disponible }
              </dd>
              <dt class="col-sm-4">Latitud</dt>
              <dd class="col-sm-8">
                @if (evento.latitud !== null) {
                  {{ evento.latitud | number:'1.3-3' }}°
                } @else { No disponible }
              </dd>
              <dt class="col-sm-4">Longitud</dt>
              <dd class="col-sm-8">
                @if (evento.longitud !== null) {
                  {{ evento.longitud | number:'1.3-3' }}°
                } @else { No disponible }
              </dd>
            </dl>
            @if (evento.url; as enlace) {
              <a [href]="enlace" target="_blank" rel="noopener noreferrer"
                class="btn btn-primary mt-3">
                Consultar en USGS (nueva pestaña)
              </a>
            }
          </div>
        </article>
      } @else {
        <p class="alert alert-warning">
          El evento no se encuentra en el catálogo consultado.
          Verifica el identificador; puede haber salido del periodo de siete días.
        </p>
      }
    }
    @default {
      <p role="status">Preparando consulta…</p>
    }
  }
</section>
~~~

Esta vista utiliza el catálogo compartido. Cuando se abre directamente su URL y todavía no hay datos, carga el servicio antes de buscar el identificador.

Si un evento salió del periodo móvil de siete días, su detalle puede dejar de estar disponible en esta aplicación aunque su página de USGS siga existiendo. Se muestra un mensaje en lugar de una vista vacía.

Los valores nulos se representan como “No disponible”; un valor de 0 se conserva.

<br/> 
<br/> 

### Paso 13. Enrutamiento, componente raíz y arranque

### 13.1 Rutas

| Ruta | Comportamiento |
|---|---|
| / | Redirigir a /sismos |
| /sismos | Mostrar el listado |
| /sismos/:id | Mostrar el detalle del evento |
| Cualquier otra ruta | Redirigir al listado |

<br/> 

### Archivo: src/app/app.routes.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sismos' },
  {
    path: 'sismos',
    loadComponent: () => import('./pages/listado-sismos/listado-sismos.component')
      .then(m => m.ListadoSismosComponent)
  },
  {
    path: 'sismos/:id',
    loadComponent: () => import('./pages/detalle-sismo/detalle-sismo.component')
      .then(m => m.DetalleSismoComponent)
  },
  { path: '**', redirectTo: 'sismos' }
];
~~~

loadComponent() permite cargar la vista de cada ruta cuando se necesita.

<br/> 

### 13.2 Componente raíz

### Archivo: src/app/app.component.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent {}
~~~

<br/> 

### Archivo: src/app/app.component.html

Reemplaza su contenido completo por el siguiente código:

~~~html
<header class="border-bottom bg-white">
  <nav class="container py-3" aria-label="Navegación principal">
    <a routerLink="/sismos" class="h3 text-decoration-none text-primary">
      SismoExplorer
    </a>
    <p class="text-body-secondary mb-0">
      Sismos de los últimos 7 días · Fuente: USGS
    </p>
  </nav>
</header>

<main class="container py-4">
  <router-outlet />
</main>

<footer class="container border-top py-3 small text-body-secondary">
  Información consultada en el catálogo de USGS.
  Las fechas se muestran en la zona horaria del navegador.
</footer>
~~~

RouterLink genera los enlaces de navegación y RouterOutlet indica dónde se presenta la vista correspondiente.

<br/> 

### 13.3 Punto de entrada

### Archivo: src/main.ts

Reemplaza su contenido completo por el siguiente código:

~~~typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch(console.error);
~~~

Verifica que main.ts importe AppComponent desde app.component.ts y que el nombre exportado coincida. No debe conservar un import de App si la clase se llama AppComponent.

<br/> 

### 13.4 Documento principal

### Archivo: src/index.html

Reemplaza su contenido completo por el siguiente código:

~~~html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>SismoExplorer</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <app-root></app-root>
</body>
</html>
~~~

<br/> 
<br/> 

### Paso 14. Ejecutar y comprobar las dependencias

Una vez guardados todos los archivos:

~~~powershell
npm ls @angular/core @angular/cli typescript rxjs bootstrap --depth=0
npx ng serve --open
~~~

Confirma Angular y CLI 22.x, Bootstrap 5.3.8 y dependencias sin errores de resolución.

Abre:

[http://localhost:4200/sismos](http://localhost:4200/sismos)

Para comprobar la compilación de producción, ejecuta en otra terminal dentro del proyecto:

~~~powershell
npx ng build
~~~

<br/> 

**Resultado esperado:** finalización sin errores y archivos generados dentro de dist/sismoexplorer. Una compilación correcta comprueba el código y las plantillas; la conducta de la aplicación se revisa en la siguiente sección.

<br/> 
<br/> 

### Verificación del código de referencia

El código incluido en esta guía se compiló sin errores con Node.js 24.22.1, Angular CLI 22.2.6, Angular 22.2.5, TypeScript 6.0.3, RxJS 7.8.2 y Bootstrap 5.3.8. También se comprobó la respuesta pública del servicio USGS y la estructura utilizada para transformar sus eventos.

La matriz siguiente describe las comprobaciones funcionales que deben ejecutarse en el navegador; la compilación no las sustituye.

<br/> 

### Paso 15. Validación funcional

No utilices un número fijo de resultados o una ubicación predeterminada como condición de aprobación. Los eventos cambian con el tiempo.

| Caso | Acción | Resultado esperado |
|---|---|---|
| Carga inicial | Abrir /sismos | Aparece el estado de carga y luego los resultados o el mensaje de catálogo vacío |
| Consulta HTTP | Abrir DevTools → Network y pulsar Actualizar | Se solicita 2.5_week.geojson y se procesa su respuesta |
| Identidad de datos | Comparar una tarjeta y la respuesta del servicio | Coinciden id, ubicación y valores numéricos; el formato visible puede redondear |
| Orden | Comparar las fechas de varias tarjetas | Los eventos más recientes aparecen primero |
| Búsqueda | Copiar parte de una ubicación visible y escribirla en el filtro | Sólo aparecen coincidencias con ese texto |
| Mayúsculas | Repetir la búsqueda cambiando mayúsculas y minúsculas | Se conservan las coincidencias |
| Magnitud | Elegir 5.0 o superior | Todos los resultados tienen magnitud >=5.0 |
| Filtros combinados | Buscar una ubicación y cambiar la magnitud mínima | Se cumplen ambos criterios simultáneamente |
| Filtro local | Escribir y cambiar la magnitud observando Network | Los filtros no generan consultas HTTP adicionales |
| Sin coincidencias | Buscar zz_sin_coincidencias_123 | Se muestra el mensaje y la opción Limpiar filtros |
| Restablecer | Pulsar Limpiar filtros | Se borra la búsqueda y la magnitud vuelve a 2.5 |
| Detalle | Pulsar Ver detalle | La URL contiene el id y se muestran los datos de ese evento |
| Acceso directo | Copiar una URL válida de detalle, pegarla en otra pestaña y recargar | Se consulta el servicio y se recupera el evento si continúa en el periodo |
| Id inexistente | Abrir /sismos/id-inexistente-123 | Se muestra el mensaje de evento no encontrado |
| Fuente original | Pulsar Consultar en USGS | Se abre la página del evento en otra pestaña |
| Actualización | Pulsar Actualizar | Se realiza otra consulta y cambia la hora de última consulta |
| Error de red | Con la app abierta, activar Offline en DevTools y pulsar Actualizar | Aparece un mensaje de error y el botón Reintentar |
| Recuperación | Desactivar Offline y pulsar Reintentar | Vuelve a consultarse el servicio |
| Carga lenta | Activar una conexión lenta en DevTools y pulsar Actualizar | Se observa el mensaje de carga; Actualizar queda deshabilitado |
| Diseño adaptable | Probar anchos de 375 px y 1280 px | Los filtros y tarjetas se acomodan y pueden utilizarse |
| Teclado | Recorrer la interfaz con Tab y activar botones/enlaces | Es posible operar los controles principales |
| Compilación | Ejecutar npx ng build | El proceso termina sin errores |

Para comprobar una respuesta vacía o campos nulos de manera controlada, el instructor puede usar una respuesta de prueba mediante las herramientas de sustitución de respuestas del navegador. Conserva la liga real en el código entregado y no esperes a que el servicio público produzca esos casos.

<br/> 
<br/> 

### Registro de validación

Completa este registro con tus resultados:

| Caso evaluado | Aprobado / Pendiente | Evidencia u observación |
|---|---|---|
| Carga y consulta HTTP | | |
| Búsqueda y filtro combinado | | |
| Detalle y recarga directa | | |
| Resultados vacíos y errores | | |
| Bootstrap y diseño adaptable | | |
| Compilación de producción | | |

<br/> 
<br/> 

### Paso 16. Checklist de conocimientos repasados y entendidos

Marca una casilla cuando puedas explicar el concepto y señalar dónde lo aplicaste. Copiar el código o conseguir una captura no basta para marcar comprensión.

<br/> 

### Ambiente y TypeScript

- [ ] Comprobé la versión completa de Node.js y su compatibilidad con Angular 22.
- [ ] Distingo Node.js, npm, Angular CLI y Angular.
- [ ] Puedo explicar por qué se usa el CLI local mediante npx ng dentro del proyecto.
- [ ] Identifico las funciones de package.json, app.config.ts y main.ts.
- [ ] Distingo las interfaces de la API y el modelo Sismo.
- [ ] Comprendo las uniones con null y por qué un dato faltante no se reemplaza por cero.
- [ ] Puedo explicar filter(), map(), sort(), find() e includes() dentro de esta solución.


<br/> 

### Componentes modernos y standalone

- [ ] Identifico la clase, la plantilla y los estilos de un componente.
- [ ] Explico la responsabilidad de cada componente del proyecto.
- [ ] Comprendo standalone: true y las dependencias declaradas en imports.
- [ ] Puedo explicar input(), input.required() y output().
- [ ] Distingo la lectura de una entrada de la emisión de un evento.
- [ ] Identifico interpolación, property binding, event binding y referencias de plantilla.
- [ ] Explico por qué se inicia la consulta desde ngOnInit().

<br/> 

### Signals

- [ ] Sé crear y leer una señal con signal() y su llamada como función.
- [ ] Sé cambiar el estado con set().
- [ ] Distingo una señal editable de la lectura expuesta mediante asReadonly().
- [ ] Explico cuándo se recalcula computed() y de qué señales depende.
- [ ] Comprendo por qué no se mantiene un segundo arreglo editable para los resultados filtrados.
- [ ] Distingo el estado local de los filtros del estado compartido del catálogo.

<br/> 

### Templates y pipes

- [ ] Puedo utilizar @if y @else para contenido condicional.
- [ ] Puedo utilizar @for con track y explicar la elección de sismo.id.
- [ ] Puedo utilizar @empty para una colección sin elementos.
- [ ] Puedo utilizar @switch, @case y @default para los estados.
- [ ] Distingo los bloques modernos de control de flujo de los bindings de propiedades y eventos.
- [ ] Sé importar DatePipe y DecimalPipe en un componente standalone.
- [ ] Comprendo el patrón de decimales 1.1-1 y el formato de fecha usado.
- [ ] Puedo explicar PipeTransform y la función del pipe magnitudEtiqueta.
- [ ] Entiendo que los pipes de presentación no modifican el dato original.

<br/> 

### Servicios, inyección y HTTP

- [ ] Explico @Injectable, providedIn: 'root' e inject().
- [ ] Sé dónde está configurado provideHttpClient().
- [ ] Identifico el endpoint y el método HTTP GET.
- [ ] Comprendo que el Observable de HttpClient inicia su solicitud al suscribirse.
- [ ] Distingo el Observable de la consulta de los Signals usados por la vista.
- [ ] Explico la transformación GeoJSON → Sismo y el orden de las coordenadas.
- [ ] Comprendo que el tipo genérico de get<T>() no valida el JSON en ejecución.
- [ ] Puedo explicar el timeout y el manejo de next y error.
- [ ] Distingo filtrar datos descargados de consultar nuevamente el servidor.

<br/> 

### Bootstrap y navegación

- [ ] Sé dónde se instala e importa el CSS de Bootstrap.
- [ ] Reconozco container, row, col-*, card, form-control, btn y alert.
- [ ] Puedo explicar cómo la cuadrícula cambia entre móvil y escritorio.
- [ ] Distingo una ruta, un parámetro y una vista.
- [ ] Identifico las funciones de provideRouter, RouterLink y RouterOutlet.
- [ ] Explico cómo ActivatedRoute y toSignal permiten leer el identificador.
- [ ] Comprendo qué sucede al abrir directamente una URL de detalle.
- [ ] Distingo un error de consulta de un evento que no está en el catálogo.

<br/> 

### Comprensión integradora

- [ ] Puedo seguir el recorrido de los datos desde USGS hasta una tarjeta.
- [ ] Puedo explicar cómo el cambio de un filtro actualiza el total y el listado.
- [ ] Puedo localizar y corregir un import o nombre de clase incorrecto.
- [ ] Puedo demostrar la recuperación después de un error de red.
- [ ] Puedo ejecutar el proyecto y explicar su estructura sin depender de esta guía.

<br/> 
<br/> 

### Paso 17. Evidencias y entrega

Entrega una carpeta o archivo ZIP con:

1. Código del proyecto y este README.
2. package.json y package-lock.json para reproducir las dependencias.
3. Captura de versiones de Node.js, npm, Angular y CLI.
4. Captura del listado y de una búsqueda con filtro de magnitud.
5. Captura de la vista de detalle con su URL.
6. Captura del estado de error o de una búsqueda sin coincidencias.
7. Evidencia de npx ng build finalizado correctamente.
8. Registro de validación y checklist completados.

No incluyas node_modules, dist ni .angular en el ZIP. El proyecto debe poder restaurarse y ejecutarse con:

~~~powershell
npm ci
npx ng serve --open
~~~

<br/> 
<br/> 

### Preguntas para la demostración final

- ¿Por qué las consultas HTTP están en un servicio?
- ¿Qué señales cambian cuando escribes una ubicación?
- ¿Por qué los filtros no envían una petición por cada tecla?
- ¿Cómo sabe Angular qué tarjeta corresponde a cada registro?
- ¿Qué diferencia existe entre un catálogo vacío y un error de red?
- ¿Cómo se obtiene el detalle cuando se recarga directamente su ruta?
- ¿Qué partes de la aplicación tendrías que adaptar para consumir otra API?

<br/> 
<br/> 

### Paso 18. Problemas frecuentes

| Síntoma | Revisión o corrección |
|---|---|
| Angular CLI informa que Node no es compatible | Revisa la versión completa y el intervalo de la tabla oficial |
| El CLI global es de otra versión | Usa el comando de creación con @angular/cli@22 y npx ng dentro del proyecto |
| Could not resolve ./app.routes | Comprueba que exista src/app/app.routes.ts y exporte routes |
| No matching export ... App | Alinea main.ts con la clase AppComponent incluida en esta guía |
| El pipe o componente no se reconoce | Revisa su exportación, ruta de importación y el arreglo imports del componente consumidor |
| No se ven estilos de Bootstrap | Verifica la instalación y el @import al principio de src/styles.css |
| La búsqueda de un país no devuelve resultados | Busca el texto que publica USGS; los nombres pueden aparecer en inglés |
| El servicio muestra un error | Abre la liga pública, revisa Network, la conexión y si quedó activado Offline |
| El detalle no encuentra un evento | Comprueba el id y si sigue en el catálogo de los últimos siete días |
| La fecha parece distinta a USGS | Esta interfaz usa la zona horaria del navegador; compara el instante y la zona usada |
| El puerto 4200 está ocupado | Ejecuta npx ng serve --port 4201 --open |
| Al publicar falla la recarga de /sismos/:id | Configura el servidor de alojamiento para devolver index.html en las rutas de la aplicación |

<br/> 
<br/> 

### Paso 19. Referencias bibliográficas

- **Angular: compatibilidad de versiones.** Requisitos de Node.js, TypeScript y RxJS.  
  [https://angular.dev/reference/versions](https://angular.dev/reference/versions)

- **Angular CLI: creación de aplicaciones.** Opciones del comando ng new.  
  [https://angular.dev/cli/new](https://angular.dev/cli/new)

- **Componentes Angular.** Configuración, plantillas y responsabilidades.  
  [https://angular.dev/guide/components](https://angular.dev/guide/components)

- **Entradas de componentes.** Declaración y uso de input().  
  [https://angular.dev/guide/components/inputs](https://angular.dev/guide/components/inputs)

- **Salidas de componentes.** Comunicación de eventos con output().  
  [https://angular.dev/guide/components/outputs](https://angular.dev/guide/components/outputs)

- **Signals.** Estado editable y valores derivados.  
  [https://angular.dev/guide/signals](https://angular.dev/guide/signals)

- **Control de flujo en templates.** Bloques @if, @for y @switch.  
  [https://angular.dev/guide/templates/control-flow](https://angular.dev/guide/templates/control-flow)

- **Pipes.** Transformaciones de presentación y pipes personalizados.  
  [https://angular.dev/guide/templates/pipes](https://angular.dev/guide/templates/pipes)

- **Inyección de dependencias.** Servicios y obtención de dependencias.  
  [https://angular.dev/guide/di](https://angular.dev/guide/di)

- **Configuración de HttpClient.** Configuración HTTP en la aplicación.  
  [https://angular.dev/guide/http/setup](https://angular.dev/guide/http/setup)

- **Solicitudes HTTP.** Consultas y respuestas con HttpClient.  
  [https://angular.dev/guide/http/making-requests](https://angular.dev/guide/http/making-requests)

- **Enrutamiento.** Navegación y rutas de la aplicación.  
  [https://angular.dev/guide/routing](https://angular.dev/guide/routing)

- **USGS: formato GeoJSON.** Estructura de la respuesta y servicios por periodo.  
  [https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)

- **Bootstrap 5.3.** Cuadrícula, componentes y utilidades visuales.  
  [https://getbootstrap.com/docs/5.3/getting-started/introduction/](https://getbootstrap.com/docs/5.3/getting-started/introduction/)

