# Práctica 9.1 Implementando ruteo en Angular 22

<br/>
<br/>

## Objetivos

- Configurar `provideRouter(routes)` con rutas que mapeen URLs a componentes específicos, incluyendo redirección y ruta comodín (`**`).
- Diferenciar carga inicial y diferida mediante `component`, `loadComponent` y `loadChildren`.
- Implementar navegación declarativa con `routerLink` y `routerLinkActive` en la barra de navegación.
- Implementar navegación programática usando `Router.navigate()` y `Router.navigateByUrl()` desde la clase del componente.
- Leer parámetros de ruta y de consulta con `ActivatedRoute.paramMap` y `queryParamMap`, y responder a sus cambios.
- Comparar el comportamiento visual de `PathLocationStrategy` versus `HashLocationStrategy` modificando `provideRouter` en `app.config.ts`.

<br/>
<br/>


## Prerrequisitos

### Conocimiento Previo
- Haber completado la Práctica 8 o tener conocimiento equivalente de servicios Angular e inyección de dependencias.
- Comprensión de la estructura de componentes Angular (decorador `@Component`, plantilla, clase).
- Familiaridad con componentes standalone, `imports`, signals y los bloques `@if` y `@for`.
- Conocimiento básico de URLs, parámetros de ruta y parámetros de consulta HTTP.

### Acceso y Herramientas
- Node.js 22.22.3 o posterior de la rama 22.x, instalado y disponible en el PATH.
- Angular CLI 22.x instalado globalmente (`ng version` debe responder sin errores).
- Visual Studio Code con la extensión **Angular Language Service** activa.
- Google Chrome con la extensión **Angular DevTools** instalada.
- Conexión a Internet para instalar dependencias npm.

<br/>
<br/>


## Intrucciones

> **Nota sobre la sintaxis:** Se utilizan componentes standalone, `provideRouter`, `@if` y `@for`. Las signals notifican los cambios de datos a la vista; el foco de la práctica es el Router. No necesitas crear un `AppRoutingModule`.


<br/>

### Paso 1. Crear el Proyecto Base y los Componentes

1. Abre una terminal en el directorio donde deseas crear el proyecto.

2. Crea el proyecto standalone sin generar rutas automáticamente, porque se configurarán en el paso siguiente:

```bash
ng new catalogo-productos --standalone --routing=false --style=css --file-name-style-guide=2016 --ssr=false --skip-tests --skip-git
```

> `--routing=false` evita generar la configuración de rutas; la crearás manualmente. `--ssr=false` mantiene esta práctica en el navegador. Si se solicita integración con herramientas de IA, selecciona **None**. `--skip-tests` evita generar pruebas unitarias: aquí realizarás las comprobaciones funcionales del apartado final.

3. Accede al directorio del proyecto:

```bash
cd catalogo-productos
```

4. Genera los cinco componentes que actuarán como páginas de la aplicación:

```bash
ng generate component components/home --type=component --add-type-to-class-name
ng generate component components/product-list --type=component --add-type-to-class-name
ng generate component components/product-detail --type=component --add-type-to-class-name
ng generate component components/about --type=component --add-type-to-class-name
ng generate component components/not-found --type=component --add-type-to-class-name
```

5. Verifica que los componentes se hayan creado correctamente:

```bash
# En Windows (PowerShell)
Get-ChildItem src/app/components

# En macOS / Linux
ls src/app/components
```

<br/>

**Salida Esperada:**

```
about/
home/
not-found/
product-detail/
product-list/
```

**Verificación:** confirma que existen las cinco carpetas y que las clases se llaman `HomeComponent`, `ProductListComponent`, `ProductDetailComponent`, `AboutComponent` y `NotFoundComponent`. `--add-type-to-class-name` asegura el sufijo `Component`; `--type=component` establece el sufijo del archivo. Cada componente es standalone. Se referenciarán directamente desde `app.routes.ts`.

<br/>
<br/>

### Paso 2. Crear `app.routes.ts` y registrar `provideRouter`

1. Crea `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'products/:id',
    loadComponent: () => import('./components/product-detail/product-detail.component')
      .then(m => m.ProductDetailComponent)
  },
  { path: 'products', component: ProductListComponent },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component')
      .then(m => m.AboutComponent)
  },
  { path: '**', component: NotFoundComponent }
];
```

<br/>

2. Abre `src/app/app.config.ts` y registra las rutas:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)]
};
```

**Carga inicial y diferida:** `HomeComponent` y `ProductListComponent` se importan directamente. En cambio, `loadComponent` usa `import()` para cargar el detalle y la página informativa al navegar a ellas. No agregues imports estáticos de esos dos componentes en `app.routes.ts`, porque perderías la separación buscada.

<br/>

3. Para observar también `loadChildren`, crea `src/app/about.routes.ts`:

```typescript
// src/app/about.routes.ts
import { Routes } from '@angular/router';

export const ABOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/about/about.component')
      .then(m => m.AboutComponent)
  }
];
```

<br/>

4. En `app.routes.ts`, sustituye **solo** el objeto de la ruta `about` por el siguiente. No agregues una segunda ruta `about`:

```typescript
// Sustituye el objeto about dentro del arreglo routes.
{
  path: 'about',
  loadChildren: () => import('./about.routes').then(m => m.ABOUT_ROUTES)
},
```

La URL sigue siendo `/about`: `loadChildren` carga un arreglo de rutas y el `path: ''` de ese arreglo conserva la misma dirección. Se mantiene `loadComponent` en el detalle y dentro del grupo informativo. En standalone, `loadChildren` también puede cargar rutas, sin crear un NgModule.

**Salida Esperada:** VS Code no muestra errores de TypeScript.

**Verificación:** ejecuta `ng build` para comprobar que el proyecto compila antes de continuar.

<br/>
<br/>

### Paso 3. Agregar `router-outlet` y la Barra de Navegación

1. Reemplaza el contenido de `src/app/app.component.html` con el siguiente código:

```html
<!-- src/app/app.component.html -->

<!-- Barra de navegación principal -->
<nav class="navbar">
  <div class="navbar-brand">
    <span>🛍️ Catálogo de Productos</span>
  </div>

  <ul class="navbar-links">
    <!-- routerLink: navegación declarativa -->
    <!-- routerLinkActive: agrega la clase CSS "active-link" cuando la ruta coincide -->
    <li>
      <a routerLink="/home"
         routerLinkActive="active-link">
        Inicio
      </a>
    </li>
    <li>
      <a routerLink="/products"
         routerLinkActive="active-link">
        Productos
      </a>
    </li>
    <li>
      <a routerLink="/about"
         routerLinkActive="active-link">
        Acerca de
      </a>
    </li>
  </ul>
</nav>

<!-- Punto de inserción: aquí Angular renderiza el componente activo -->
<main class="content">
  <router-outlet></router-outlet>
</main>
```


2. Abre `src/app/app.component.ts` y declara las dependencias de navegación:

```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { }
```

<br/>

**Importante: actualiza también `src/main.ts`.** El estilo de nombres 2016 define el nombre del archivo, pero el CLI puede generar la clase raíz como `App`. Como acabas de reemplazarla por `AppComponent`, reemplaza el contenido de `src/main.ts` por:

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch(error => console.error(error));
```

<br/>

3. Agrega los estilos básicos en `src/app/app.component.css`:

```css
/* src/app/app.component.css */

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3f51b5;
  color: white;
  padding: 0.75rem 1.5rem;
}

.navbar-brand span {
  font-size: 1.25rem;
  font-weight: bold;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.navbar-links a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Clase aplicada por routerLinkActive cuando la ruta está activa */
.navbar-links a.active-link {
  background-color: rgba(255, 255, 255, 0.35);
  font-weight: bold;
  border-bottom: 2px solid white;
}

.content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
```

<br/>

4. Inicia el servidor de desarrollo:

```bash
ng serve --open
```

**Salida Esperada:** El navegador abre `http://localhost:4200/` y redirige automáticamente a `http://localhost:4200/home`. La barra de navegación es visible con los tres enlaces. El enlace "Inicio" aparece resaltado (clase `active-link`).

**Verificación:** Haz clic en cada enlace de la barra de navegación y confirma que:
- La URL en la barra del navegador cambia sin recargar la página.
- El enlace activo recibe el estilo diferenciado (fondo semitransparente y subrayado blanco).
- El contenido del `<router-outlet>` cambia mostrando el template por defecto de cada componente.

<br/>
<br/>

### Paso 4. Preparar los Datos y el Template de ProductListComponent


1. Reemplaza el contenido de `src/app/components/product-list/product-list.component.ts`:

```typescript
// src/app/components/product-list/product-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Interfaz para tipar los productos
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  // Lista completa de productos
  products: Product[] = [
    { id: 1, name: 'Laptop Pro 15"',      price: 1299.99, category: 'Electrónica'  },
    { id: 2, name: 'Teclado Mecánico',    price:   89.99, category: 'Periféricos'  },
    { id: 3, name: 'Monitor 4K 27"',      price:  449.99, category: 'Electrónica'  },
    { id: 4, name: 'Mouse Inalámbrico',   price:   39.99, category: 'Periféricos'  },
    { id: 5, name: 'Auriculares BT Pro',  price:  199.99, category: 'Audio'        },
    { id: 6, name: 'Webcam HD 1080p',     price:   79.99, category: 'Periféricos'  },
  ];

  // Lista filtrada que se muestra en la plantilla
  readonly filteredProducts = signal<Product[]>([]);

  // Término de búsqueda ligado al input
  searchTerm: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Al iniciar, mostramos todos los productos
    this.filteredProducts.set([...this.products]);
  }

  // Filtra la lista según el término ingresado
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts.set(this.products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    ));

    // Navegación programática: actualiza los query params sin recargar
    this.router.navigate(['/products'], {
      queryParams: term ? { search: term } : {}
    });
  }

  // Navegación programática al detalle del producto
  onVerDetalle(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
}
```

<br/>

2. Reemplaza el contenido de `src/app/components/product-list/product-list.component.html`:

```html
<!-- src/app/components/product-list/product-list.component.html -->

<div class="product-list-container">
  <h2>Catálogo de Productos</h2>

  <!-- Campo de búsqueda con query params -->
  <div class="search-bar">
    <input
      type="text"
      placeholder="Buscar por nombre o categoría..."
      [(ngModel)]="searchTerm"
      (ngModelChange)="onSearch()"
      class="search-input"
    />
    <span class="result-count">
      {{ filteredProducts().length }} resultado(s)
    </span>
  </div>

  <!-- Listado de productos -->
  <div class="product-grid">
    @for (product of filteredProducts(); track product.id) {
    <div class="product-card">
      <h3>{{ product.name }}</h3>
      <p class="category">{{ product.category }}</p>
      <p class="price">${{ product.price | number:'1.2-2' }}</p>

      <!-- Navegación declarativa con segmento dinámico -->
      <a [routerLink]="['/products', product.id]" class="btn-link">
        Ver detalle →
      </a>

      <!-- Navegación programática desde botón -->
      <button (click)="onVerDetalle(product.id)" class="btn-primary">
        Ver detalle (con Router)
      </button>
    </div>
    }
  </div>

  <!-- Mensaje cuando no hay resultados -->
  @if (filteredProducts().length === 0) {
  <div class="no-results">
    <p>No se encontraron productos para "<strong>{{ searchTerm }}</strong>".</p>
    <button (click)="searchTerm=''; onSearch()" class="btn-secondary">
      Limpiar búsqueda
    </button>
  </div>
  }
</div>
```

<br/>

3. Agrega los estilos en `src/app/components/product-list/product-list.component.css`:

```css
/* src/app/components/product-list/product-list.component.css */

.product-list-container { font-family: sans-serif; }

.search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 300px;
}

.result-count { color: #666; font-size: 0.9rem; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.product-card h3 { margin: 0; font-size: 1rem; }
.category { color: #888; font-size: 0.85rem; margin: 0; }
.price { font-size: 1.2rem; font-weight: bold; color: #3f51b5; margin: 0; }

.btn-link {
  color: #3f51b5;
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-primary {
  background: #3f51b5;
  color: white;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-secondary {
  background: #e0e0e0;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
}
```

<br/>

4. Verifica que `ProductListComponent` incluya `FormsModule`, `CommonModule` y `RouterLink` en su decorador standalone:

```typescript
imports: [CommonModule, FormsModule, RouterLink]
```

**Salida Esperada:** Al navegar a `/products` se muestra una cuadrícula de seis tarjetas de producto. Al escribir en el campo de búsqueda la URL se actualiza con el query param `?search=...`. Al hacer clic en "Ver detalle →" la URL cambia a `/products/1` (o el ID correspondiente).

**Verificación:** Escribe "audio" en el buscador y confirma que solo aparece "Auriculares BT Pro" y que la URL muestra `?search=audio`.

<br/>
<br/>

### Paso 5. Leer Parámetros de Ruta en ProductDetailComponent


1. Reemplaza el contenido de `src/app/components/product-detail/product-detail.component.ts`:

```typescript
// src/app/components/product-detail/product-detail.component.ts
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
}

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  // Catálogo de referencia (en una app real vendría de un servicio)
  private readonly catalog: Product[] = [
    { id: 1, name: 'Laptop Pro 15"',     price: 1299.99, category: 'Electrónica', description: 'Procesador Intel i7, 16 GB RAM, SSD 512 GB.', stock: 8  },
    { id: 2, name: 'Teclado Mecánico',   price:   89.99, category: 'Periféricos', description: 'Switches Cherry MX Blue, retroiluminación RGB.', stock: 25 },
    { id: 3, name: 'Monitor 4K 27"',     price:  449.99, category: 'Electrónica', description: 'Panel IPS, 144 Hz, HDR400, 1 ms de respuesta.',  stock: 5  },
    { id: 4, name: 'Mouse Inalámbrico',  price:   39.99, category: 'Periféricos', description: 'Sensor óptico 1600 DPI, batería 18 meses.',       stock: 40 },
    { id: 5, name: 'Auriculares BT Pro', price:  199.99, category: 'Audio',       description: 'Cancelación activa de ruido, 30 h de batería.',   stock: 12 },
    { id: 6, name: 'Webcam HD 1080p',    price:   79.99, category: 'Periféricos', description: 'Autofoco, micrófono integrado, USB-C.',            stock: 18 },
  ];

  private readonly destroyRef = inject(DestroyRef);
  readonly productId = signal(0);
  readonly product = computed(() =>
    this.catalog.find(p => p.id === this.productId())
  );

  constructor(
    private activatedRoute: ActivatedRoute,  // Lectura de parámetros de ruta
    private router: Router                   // Navegación programática
  ) {}

  ngOnInit(): void {
    // Se actualiza incluso si el Router reutiliza este componente para otro ID.
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.productId.set(Number(params.get('id')));
      });
  }

  // Navegación programática de regreso al listado
  onVolver(): void {
    this.router.navigate(['/products']);
  }

  // Navegación con navigateByUrl (URL completa como cadena)
  onIrAInicio(): void {
    this.router.navigateByUrl('/home');
  }
}
```

`paramMap` emite el valor inicial y los cambios posteriores de `:id`. `takeUntilDestroyed(this.destroyRef)` cancela la suscripción al destruir el componente. La signal `productId` y el `computed` `product` actualizan los datos de la plantilla. Un `snapshot` leído únicamente en `ngOnInit()` serviría para la lectura inicial, pero no para reaccionar al cambio de ID en la misma instancia.

<br/>

2. Reemplaza el contenido de `src/app/components/product-detail/product-detail.component.html`:

```html
<!-- src/app/components/product-detail/product-detail.component.html -->

<div class="detail-container">

  <!-- Caso: producto encontrado -->
  @if (product(); as currentProduct) {
  <div>
    <div class="breadcrumb">
      <a routerLink="/home">Inicio</a> /
      <a routerLink="/products">Productos</a> /
      <span>{{ currentProduct.name }}</span>
    </div>

    <div class="detail-card">
      <div class="detail-header">
        <h2>{{ currentProduct.name }}</h2>
        <span class="badge">{{ currentProduct.category }}</span>
      </div>

      <p class="description">{{ currentProduct.description }}</p>

      <div class="detail-meta">
        <span class="price">${{ currentProduct.price | number:'1.2-2' }}</span>
        <span class="stock" [class.low-stock]="currentProduct.stock < 10">
          Stock: {{ currentProduct.stock }} unidades
        </span>
      </div>

      <div class="detail-actions">
        <!-- Navegación programática con Router.navigate() -->
        <button (click)="onVolver()" class="btn-secondary">
          ← Volver al catálogo
        </button>

        <!-- Navegación programática con Router.navigateByUrl() -->
        <button (click)="onIrAInicio()" class="btn-outline">
          Ir al inicio
        </button>
      </div>
    </div>

    <!-- Permite comprobar el cambio de parámetro sin salir del detalle -->
    <a [routerLink]="['/products', productId() === 1 ? 2 : 1]">
      Ver otro producto
    </a>

    <!-- Muestra el ID leído de la URL para confirmar el parámetro -->
    <p class="debug-info">
      🔍 Parámetro de ruta capturado: <code>id = {{ productId() }}</code>
    </p>
  </div>

  } @else {
  <!-- Caso: producto no encontrado -->
    <div class="not-found-msg">
      <h3>Producto no encontrado</h3>
      <p>No existe un producto con ID <strong>{{ productId() }}</strong>.</p>
      <button (click)="onVolver()" class="btn-primary">
        Ver todos los productos
      </button>
    </div>
  }

</div>
```

<br/>

3. Agrega los estilos en `src/app/components/product-detail/product-detail.component.css`:

```css
/* src/app/components/product-detail/product-detail.component.css */

.detail-container { max-width: 700px; }

.breadcrumb { font-size: 0.85rem; color: #888; margin-bottom: 1.5rem; }
.breadcrumb a { color: #3f51b5; text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }

.detail-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.badge {
  background: #e8eaf6;
  color: #3f51b5;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.description { color: #555; line-height: 1.6; margin-bottom: 1.5rem; }

.detail-meta {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2rem;
}

.price { font-size: 1.75rem; font-weight: bold; color: #3f51b5; }
.stock { color: #4caf50; font-weight: 500; }
.low-stock { color: #f44336; }

.detail-actions { display: flex; gap: 1rem; }

.btn-primary  { background: #3f51b5; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
.btn-secondary{ background: #e0e0e0; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
.btn-outline  { background: transparent; border: 2px solid #3f51b5; color: #3f51b5; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }

.debug-info {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #888;
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.not-found-msg { text-align: center; padding: 3rem; }
```

<br/>

**Salida Esperada:** Al navegar a `/products/3` se muestra la tarjeta de detalle del "Monitor 4K 27"" con su descripción, precio y stock. El texto de depuración muestra `id = 3`. Al navegar a `/products/99` se muestra el mensaje "Producto no encontrado".

<br/>

**Verificación:** Navega manualmente a `http://localhost:4200/products/5` y confirma que aparecen los datos de "Auriculares BT Pro". Haz clic en "← Volver al catálogo" y verifica que la URL regresa a `/products` sin recargar la página.

<br/>
<br/>

### Paso 6. Configurar HomeComponent y AboutComponent


1. Reemplaza el contenido de `src/app/components/home/home.component.html`:

```html
<!-- src/app/components/home/home.component.html -->

<div class="home-container">
  <div class="hero">
    <h1>Bienvenido al Catálogo de Productos</h1>
    <p>Encuentra los mejores productos de tecnología al mejor precio.</p>

    <!-- Navegación declarativa con routerLink -->
    <a routerLink="/products" class="btn-hero">
      Ver Catálogo Completo →
    </a>
  </div>

  <div class="features">
    <div class="feature-card">
      <span class="icon">🖥️</span>
      <h3>Electrónica</h3>
      <p>Laptops, monitores y más.</p>
    </div>
    <div class="feature-card">
      <span class="icon">⌨️</span>
      <h3>Periféricos</h3>
      <p>Teclados, ratones y cámaras.</p>
    </div>
    <div class="feature-card">
      <span class="icon">🎧</span>
      <h3>Audio</h3>
      <p>Auriculares de alta fidelidad.</p>
    </div>
  </div>
</div>
```

<br/>

2. Agrega estilos básicos en `src/app/components/home/home.component.css`:

```css
/* src/app/components/home/home.component.css */

.home-container { text-align: center; }

.hero {
  background: linear-gradient(135deg, #3f51b5, #7986cb);
  color: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.hero h1 { font-size: 2rem; margin-bottom: 0.75rem; }
.hero p  { font-size: 1.1rem; margin-bottom: 1.5rem; opacity: 0.9; }

.btn-hero {
  background: white;
  color: #3f51b5;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  transition: transform 0.2s;
  display: inline-block;
}

.btn-hero:hover { transform: scale(1.05); }

.features {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.feature-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  width: 180px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.icon { font-size: 2.5rem; }
```

<br/>

3. Reemplaza el contenido de `src/app/components/about/about.component.html`:

```html
<!-- src/app/components/about/about.component.html -->

<div class="about-container">
  <h2>Acerca de Esta Aplicación</h2>
  <p>
    Esta aplicación es un laboratorio de práctica para el módulo de
    <strong>Ruteo en Angular</strong>. Demuestra:
  </p>
  <ul>
    <li>Configuración standalone con <code>provideRouter(routes)</code></li>
    <li>Navegación declarativa con <code>routerLink</code></li>
    <li>Navegación programática con el servicio <code>Router</code></li>
    <li>Parámetros de ruta con <code>ActivatedRoute</code></li>
    <li>Rutas comodín y redirecciones</li>
  </ul>

  <!-- routerLink con arreglo de segmentos -->
  <a [routerLink]="['/products']" class="btn-link">
    Explorar el catálogo
  </a>
</div>
```

<br/>

4. Reemplaza el contenido de `src/app/components/not-found/not-found.component.html`:

```html
<!-- src/app/components/not-found/not-found.component.html -->

<div class="not-found-container">
  <h1 class="error-code">404</h1>
  <h2>Página no encontrada</h2>
  <p>La URL que intentas acceder no existe en esta aplicación.</p>

  <!-- Navegación declarativa de regreso al inicio -->
  <a routerLink="/home" class="btn-home">
    ← Volver al inicio
  </a>
</div>
```

<br/>

5. Agrega estilos en `src/app/components/not-found/not-found.component.css`:

```css
/* src/app/components/not-found/not-found.component.css */

.not-found-container {
  text-align: center;
  padding: 4rem 2rem;
}

.error-code {
  font-size: 6rem;
  color: #e0e0e0;
  margin: 0;
  line-height: 1;
}

.btn-home {
  display: inline-block;
  margin-top: 1.5rem;
  background: #3f51b5;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}
```

> **Imports standalone del paso 6:** los templates de `HomeComponent`, `AboutComponent` y `NotFoundComponent` usan `routerLink`. En cada clase importa `RouterLink` desde `@angular/router` y agrega `imports: [RouterLink]` al decorador `@Component`.

<br/>

**Salida Esperada:** La página de inicio muestra el hero con gradiente y las tres tarjetas de categoría. La página "Acerca de" muestra la lista de conceptos. Al escribir cualquier URL inválida (por ejemplo `http://localhost:4200/ruta-inexistente`) se muestra el componente 404.

<br/>

**Verificación:** Navega manualmente a `http://localhost:4200/pagina-que-no-existe` y confirma que aparece el `NotFoundComponent` con el código 404.

<br/>
<br/>

### Paso 7. Comparar PathLocationStrategy y HashLocationStrategy

1. Con el servidor activo, abre `http://localhost:4200/home` y navega al detalle. La dirección tendrá la forma `http://localhost:4200/products/3`. Esta es la estrategia predeterminada, `PathLocationStrategy`.

<br/>

2. Reemplaza `src/app/app.config.ts` por:

```typescript
// src/app/app.config.ts — configuración temporal con hash
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation())
  ]
};
```

<br/>

3. Guarda y escribe **explícitamente** `http://localhost:4200/#/home` en el navegador. Navega a Productos y al detalle: verás direcciones como `http://localhost:4200/#/products/3`.

<br/>

4. Registra esta comparación:

| Estrategia | Ejemplo | Consideración al publicar |
|---|---|---|
| `PathLocationStrategy` | `/products/3` | El servidor debe devolver `index.html` para las rutas de la SPA que no sean archivos ni endpoints. |
| `HashLocationStrategy` | `/#/products/3` | La parte posterior a `#` no se envía al servidor; evita la reescritura de esas rutas. |

El servidor de desarrollo del CLI ya permite abrir directamente rutas de la SPA; esta práctica no configura un servidor de producción.

<br/>

5. **Restaura por completo** `src/app/app.config.ts` con la configuración del paso 2:

```typescript
// src/app/app.config.ts — configuración final sin hash
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)]
};
```

<br/>

6. Guarda y escribe **explícitamente** `http://localhost:4200/home`. No esperes que una URL con `#` se transforme automáticamente al cambiar la estrategia.

**Verificación de navegación SPA:** abre Chrome DevTools → **Network**, selecciona el filtro **Doc** y recarga `/home`. Después navega usando los enlaces: no debe solicitarse un nuevo documento HTML completo. Pueden existir peticiones de JavaScript, datos u otros recursos.

**Verificación de carga diferida:** selecciona el filtro **JS**, abre de nuevo `/home` con la caché desactivada y entra por primera vez en el detalle y en Acerca de. Observa las peticiones de los archivos diferidos. Al repetir la navegación en la misma sesión, normalmente ya estarán cargados. Los nombres exactos de los archivos dependen de la compilación.

<br/>
<br/>

### Paso 8. Leer Query Params con ActivatedRoute

 
1. Actualiza `src/app/components/product-list/product-list.component.ts` para recibir los query params iniciales y sus cambios posteriores:

```typescript
// src/app/components/product-list/product-list.component.ts
// Versión final: sincroniza el filtro con la URL y el historial
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';  // <-- Agregar ActivatedRoute

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [
    { id: 1, name: 'Laptop Pro 15"',      price: 1299.99, category: 'Electrónica' },
    { id: 2, name: 'Teclado Mecánico',    price:   89.99, category: 'Periféricos' },
    { id: 3, name: 'Monitor 4K 27"',      price:  449.99, category: 'Electrónica' },
    { id: 4, name: 'Mouse Inalámbrico',   price:   39.99, category: 'Periféricos' },
    { id: 5, name: 'Auriculares BT Pro',  price:  199.99, category: 'Audio'       },
    { id: 6, name: 'Webcam HD 1080p',     price:   79.99, category: 'Periféricos' },
  ];

  private readonly destroyRef = inject(DestroyRef);
  readonly filteredProducts = signal<Product[]>([]);
  searchTerm: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute  // <-- Inyectar ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Recibe el valor inicial y los cambios posteriores, incluidos Atrás/Adelante.
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.searchTerm = params.get('search') ?? '';
        this.applyFilter();
      });
  }

  onSearch(): void {
    this.applyFilter();

    // Actualizar los query params en la URL
    this.router.navigate(['/products'], {
      queryParams: this.searchTerm.trim() ? { search: this.searchTerm.trim() } : {}
    });
  }

  private applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts.set(term
      ? this.products.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        )
      : [...this.products]);
  }

  onVerDetalle(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
}
```

<br/>

La suscripción se cancela automáticamente mediante `takeUntilDestroyed`. La signal del listado notifica los cambios a la vista. La URL queda como referencia del filtro cuando usas Atrás y Adelante. Cada búsqueda agrega una entrada al historial en este ejemplo; agruparlas con `replaceUrl` es una alternativa fuera del alcance de esta comprobación.

**Salida Esperada:** Al navegar directamente a `http://localhost:4200/products?search=peri` la lista muestra solo los tres productos de la categoría "Periféricos" y el campo de búsqueda aparece pre-llenado con "peri".

**Verificación:** Copia la URL `http://localhost:4200/products?search=audio` y pégala en una nueva pestaña del navegador. El componente debe cargar ya filtrado, mostrando solo "Auriculares BT Pro".

**Verificación del historial:** abre `/products?search=audio`, selecciona el texto del buscador y escribe `peri`. Espera a que la URL cambie. Pulsa Atrás y Adelante: el campo y las tarjetas deben corresponder al valor `search` de la URL en cada momento.

**Verificación del parámetro de ruta:** abre el detalle de un producto y pulsa **Ver otro producto**. Cambian la URL, el ID y los datos del detalle, aunque Angular reutilice la instancia.

<br/>
<br/>

## Validación y Pruebas

Una vez completados todos los pasos, realiza las siguientes verificaciones funcionales completas:

<br/>
<br/>

### Lista de Verificación Final

| # | Prueba | URL / Acción | Resultado Esperado |
|---|--------|-------------|-------------------|
| 1 | Redirección raíz | Navegar a `http://localhost:4200/` | Redirige automáticamente a `/home` |
| 2 | Ruta comodín | Navegar a `/cualquier-cosa-invalida` | Muestra `NotFoundComponent` con código 404 |
| 3 | routerLinkActive | Hacer clic en "Productos" en el navbar | El enlace "Productos" recibe el estilo `active-link` |
| 4 | Parámetro de ruta | Navegar a `/products/4` | Muestra el detalle de "Mouse Inalámbrico" |
| 5 | Parámetro inválido | Navegar a `/products/99` | Muestra el mensaje "Producto no encontrado" |
| 6 | Query params escritura | Escribir "teclado" en el buscador | URL cambia a `/products?search=teclado` |
| 7 | Query params lectura | Pegar URL `/products?search=audio` | Componente carga filtrado con "Auriculares BT Pro" |
| 8 | Router.navigate() | Clic en "← Volver al catálogo" en detalle | Navega a `/products` |
| 9 | Router.navigateByUrl() | Clic en "Ir al inicio" en detalle | Navega a `/home` |
| 10 | routerLink dinámico | Clic en "Ver detalle →" en tarjeta del producto 3 | Navega a `/products/3` |
| 11 | Reutilización del detalle | Clic en "Ver otro producto" dentro del detalle | Cambian URL, ID y datos del producto |
| 12 | Historial de búsqueda | Atrás/Adelante después de cambiar la búsqueda | Campo y tarjetas coinciden con `?search=` |
| 13 | Carga diferida | Network → JS al entrar por primera vez al detalle y a Acerca de | Se solicitan los recursos de las rutas diferidas |
| 14 | Estrategia de URL | Activar hash y después restaurar Path | Funcionan ambas direcciones al abrir la URL indicada |
| 15 | Compilación final | Ejecutar `ng build` desde la raíz del proyecto | La compilación termina sin errores |

<br/>
<br/>

### Verificación con Angular DevTools

1. Abre Chrome DevTools (F12) y activa la extensión **Angular DevTools**.
2. Dentro de la pestaña **Angular**, abre **Router Tree**. Si está oculta, revisa el menú de pestañas adicionales de la extensión.
3. Navega entre las páginas y observa el árbol de rutas activo en tiempo real.
4. Al navegar a `/products/2`, selecciona la ruta `products/:id` y comprueba que está activa. Confirma `id = 2` en la URL y en el texto de depuración de la aplicación; no todas las versiones de DevTools muestran los parámetros en el mismo lugar.
5. Selecciona `about` y observa su configuración de carga diferida. Esta inspección se realiza con `ng serve`, en modo de desarrollo.

<br/>
<br/>

## Solución de Problemas

### Problema 1: `ERROR: Cannot match any routes. URL Segment: 'products'`

**Síntomas:**
- La consola del navegador (F12 → Console) muestra el error `Cannot match any routes`.
- Al hacer clic en un enlace de navegación la pantalla queda en blanco o muestra un error.
- El componente no se renderiza dentro del `<router-outlet>`.

**Causa:**
El arreglo `routes` en `app.routes.ts` está definido incorrectamente, o `provideRouter(routes)` no está registrado en `app.config.ts`. También puede ocurrir si hay un error tipográfico en el `path` (por ejemplo, `'product'` en lugar de `'products'`).

**Solución:**

1. Verifica el provider en `app.config.ts`:
```typescript
providers: [provideRouter(routes)]
```


2. Verifica que los paths en `routes` coincidan exactamente con los valores usados en `routerLink`:
```typescript
// Correcto:
{ path: 'products', component: ProductListComponent }
// En la plantilla:
<a routerLink="/products">...</a>
```

3. Asegúrate de que la ruta comodín `**` sea la **última** en el arreglo (Angular evalúa las rutas en orden):
```typescript
const routes: Routes = [
  { path: '',         redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',     component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  // ... otras rutas específicas ...
  { path: '**',       component: NotFoundComponent }  // ← SIEMPRE AL FINAL
];
```

<br/>
<br/>

### Problema 2: `[(ngModel)]` no funciona — Error `Can't bind to 'ngModel'`

**Síntomas:**
- La consola muestra: `Can't bind to 'ngModel' since it isn't a known property of 'input'`.
- El campo de búsqueda no responde a la escritura del usuario.
- El servidor de desarrollo (`ng serve`) muestra un error de compilación.

**Causa:**
La directiva `ngModel` pertenece a `FormsModule`, que no está importado en `ProductListComponent`. Angular no incluye este módulo por defecto para mantener el bundle lo más pequeño posible.

**Solución:**

Importa `FormsModule` en `ProductListComponent`:

```typescript
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ProductListComponent { }
```

Guarda el archivo. El servidor de desarrollo recompilará automáticamente y el error desaparecerá.

<br/>
<br/>

### Problema 3: imports de `App` o de componentes no encontrados

- Si `main.ts` importa `App` pero exportaste `AppComponent`, aplica el archivo completo del paso 3.
- Si las rutas importan `HomeComponent` pero la clase se llama `Home`, revisa `--add-type-to-class-name` y alinea los nombres de las cinco clases. No vuelvas a generar componentes sobre archivos ya modificados.
- Comprueba que la ruta de cada `import()` coincida con el archivo real y no incluya la extensión `.ts`.

<br/>
<br/>

### Problema 4: buscar o cambiar de producto no actualiza la vista

- No sustituyas las suscripciones de `paramMap` y `queryParamMap` por un `snapshot` leído una sola vez.
- Conserva las lecturas de signals con paréntesis: `filteredProducts()`, `productId()` y `product()`.
- Usa `takeUntilDestroyed(this.destroyRef)` como se indica, porque `ngOnInit()` no es por sí mismo un contexto de inyección para la variante sin argumentos.

## Limpieza

1. Detén `ng serve` en su terminal con `Ctrl + C`.
2. Conserva el proyecto y verifica que `app.config.ts` haya quedado sin `withHashLocation()`.
3. Si deseas comprimirlo, abre otra terminal PowerShell, sitúate en la **raíz de `catalogo-productos`** y ejecuta:

```powershell
$archivosEntrega = Get-ChildItem -Force | Where-Object {
  $_.Name -notin @('node_modules', 'dist', '.angular', '.git')
}
Compress-Archive -Path $archivosEntrega.FullName -DestinationPath ../catalogo-productos-lab09.zip -Force
```

El archivo se crea en la carpeta superior. Conserva `package.json` y `package-lock.json`; las dependencias se pueden reinstalar con `npm ci`. No necesitas cerrar otros procesos de Node.js.

<br/>
<br/>

## Resumen

En este laboratorio implementaste un sistema de ruteo en Angular. Los conceptos clave que pusiste en práctica fueron:

| Concepto | Dónde se aplicó | Archivo clave |
|----------|----------------|---------------|
| `provideRouter(routes)` | Registro del router standalone | `app.config.ts` |
| Ruta de redirección (`redirectTo`) | `''` → `/home` | `app.routes.ts` |
| Ruta comodín (`**`) | URLs inválidas → `NotFoundComponent` | `app.routes.ts` |
| `<router-outlet>` | Punto de inserción del componente activo | `app.component.html` |
| `routerLink` declarativo | Barra de navegación y breadcrumb | `app.component.html`, `product-detail.component.html` |
| `routerLinkActive` | Resaltar enlace activo en navbar | `app.component.html` |
| `[routerLink]` con arreglo | Navegación dinámica a detalle | `product-list.component.html` |
| `Router.navigate()` | Redirección tras acción del usuario | `product-list.component.ts`, `product-detail.component.ts` |
| `Router.navigateByUrl()` | Navegación con URL completa | `product-detail.component.ts` |
| `ActivatedRoute.paramMap` | Leer y reaccionar al parámetro `:id` | `product-detail.component.ts` |
| `ActivatedRoute.queryParamMap` | Sincronizar el filtro y el historial con `?search=` | `product-list.component.ts` |
| `NavigationExtras.queryParams` | Escribir query params en la URL | `product-list.component.ts` |
| `PathLocationStrategy` vs `HashLocationStrategy` | Comparación de estrategias | `app.config.ts` |
| `loadComponent` + `import()` | Carga diferida del detalle y del componente informativo | `app.routes.ts`, `about.routes.ts` |
| `loadChildren` + `import()` | Carga diferida de un arreglo de rutas | `app.routes.ts` |
| `takeUntilDestroyed` | Cancelar suscripciones al destruir el componente | Componentes de listado y detalle |

<br/>
<br/>

## Referencias

- **Compatibilidad de versiones de Angular:** [https://angular.dev/reference/versions](https://angular.dev/reference/versions)

- **Configuración y mapeo de rutas:** [https://angular.dev/guide/routing/define-routes](https://angular.dev/guide/routing/define-routes)

- **Navegación declarativa y programática:** [https://angular.dev/guide/routing/navigate-to-routes](https://angular.dev/guide/routing/navigate-to-routes)

- **Lectura del estado y los parámetros de ruta:** [https://angular.dev/guide/routing/read-route-state](https://angular.dev/guide/routing/read-route-state)

- **Carga inicial y diferida:** [https://angular.dev/guide/routing/loading-strategies](https://angular.dev/guide/routing/loading-strategies)

- **Redirecciones:** [https://angular.dev/guide/routing/redirecting-routes](https://angular.dev/guide/routing/redirecting-routes)

- **Inspección de rutas en DevTools:** [https://angular.dev/tools/devtools/router](https://angular.dev/tools/devtools/router)
