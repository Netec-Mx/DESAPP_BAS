# Manejo de Módulos

![Arquitectura modular del laboratorio con Core, Shared y módulos lazy](assets/lab-overview.png)

## Metadatos

| Campo | Detalle |
|---|---|
| **Duración estimada** | 197 minutos |
| **Complejidad** | Alta |
| **Nivel Bloom** | Crear |
| **Módulo del curso** | Módulo 10 — Arquitectura Modular en Angular |

---

## Descripción General

> **Decisión arquitectónica:** este laboratorio conserva NgModule de forma deliberada porque el tema forma parte del temario aprobado y sigue siendo relevante para mantener aplicaciones existentes. En Angular 21, el equipo recomienda standalone para código nuevo; aquí todos los declarables se marcan `standalone: false` para practicar interoperabilidad correctamente.

En este laboratorio construirás una aplicación Angular multi-módulo para la gestión de una tienda en línea, integrando todos los conceptos de arquitectura modular vistos en el curso. Diseñarás el árbol de módulos antes de escribir código, generarás los módulos y componentes con Angular CLI, configurarás el patrón `forRoot()` en `CoreModule`, implementarás un `SharedModule` con recursos reutilizables y habilitarás la carga diferida (*lazy loading*) del `AdminModule`. Al finalizar, verificarás el comportamiento en Chrome DevTools y Angular DevTools, consolidando una arquitectura Angular escalable y alineada con buenas prácticas profesionales.

---

## Objetivos de Aprendizaje

Al completar este laboratorio, serás capaz de:

- [ ] Diseñar el árbol de módulos de una aplicación Angular identificando responsabilidades y límites de cada módulo.
- [ ] Crear módulos de características (*feature modules*) y configurar correctamente sus `declarations`, `imports` y `exports`.
- [ ] Implementar un `SharedModule` que comparte componentes, directivas y pipes entre múltiples módulos.
- [ ] Configurar el patrón `forRoot()` en `CoreModule` para garantizar servicios singleton.
- [ ] Implementar *lazy loading* del `AdminModule` y verificarlo en la pestaña Network de Chrome DevTools.

---

## Requisitos Previos

### Conocimientos

- Haber completado las Prácticas 8 (servicios e inyección de dependencias) y 9 (ruteo en Angular).
- Comprensión sólida de `@NgModule` y sus propiedades: `declarations`, `imports`, `exports`, `providers`.
- Conocimiento de `RouterModule.forRoot()` y `RouterModule.forChild()`.
- Familiaridad con el concepto de *lazy loading* y *code splitting*.

### Acceso y Herramientas

- Node.js 22.x instalado y verificado.
- Angular CLI 21.x instalado globalmente.
- Visual Studio Code 1.85.x con la extensión **Angular Language Service**.
- Google Chrome 120.x con la extensión **Angular DevTools**.
- Conexión a Internet activa para instalación de dependencias npm.

---

## Entorno de Laboratorio

### Requisitos de Hardware

| Recurso | Mínimo | Recomendado |
|---|---|---|
| Procesador | Intel Core i5 / 1.6 GHz 64-bit | Intel Core i7 / 2.0 GHz |
| Memoria RAM | 8 GB | 16 GB |
| Espacio en disco | 10 GB libres | 15 GB libres |
| Resolución de pantalla | 1280 × 768 | 1920 × 1080 |
| Conexión a Internet | 10 Mbps | 20 Mbps o más |

### Requisitos de Software

| Software | Versión mínima | Versión recomendada |
|---|---|---|
| Node.js | 22.12 | 22.x compatible |
| npm | 10.x | 10.x |
| Angular CLI | 21.x | 21.x |
| TypeScript | 4.9.x | 5.x |
| Visual Studio Code | 1.85.x | Última estable |
| Google Chrome | 120.x | Última estable |

### Verificación del Entorno

Antes de comenzar, ejecuta los siguientes comandos en tu terminal para confirmar que el entorno está listo:

```bash
node --version
# Resultado esperado: v22.x.x (22.12 o superior)

npm --version
# Resultado esperado: 10.x.x

ng version
# Resultado esperado: Angular CLI: 21.x.x
```

> **Plataforma principal:** usa PowerShell en Windows 11. Git Bash y macOS/Linux se consideran referencias secundarias.

---

## Parte 1 — Diseño en Papel del Árbol de Módulos (20 min)

### Objetivo

Antes de escribir una sola línea de código, diseñarás la arquitectura modular de la aplicación en papel o en un diagrama digital. Este paso es fundamental en proyectos profesionales: un diseño previo evita refactorizaciones costosas y hace que el código resultante sea más coherente.

### Instrucciones

1. En una hoja de papel o en una herramienta de diagramas (draw.io, Excalidraw, etc.), dibuja un árbol con los siguientes nodos y sus relaciones:

   ```
   AppModule
   ├── CoreModule          (servicios singleton: NavbarComponent, FooterComponent)
   ├── SharedModule        (LoadingSpinnerComponent, CurrencyFormatPipe, HighlightDirective)
   ├── AppRoutingModule    (rutas raíz + lazy routes)
   │
   ├── [Lazy] ProductsModule
   │         └── ProductsRoutingModule
   │
   ├── [Lazy] UsersModule
   │         └── UsersRoutingModule
   │
   └── [Lazy] AdminModule
               └── AdminRoutingModule
   ```

2. Para cada módulo, anota en tu diagrama:
   - Qué **componentes** declara.
   - Qué **módulos** importa.
   - Qué **elementos** exporta.
   - Si provee **servicios** (y cuáles).

3. Responde las siguientes preguntas en tu cuaderno o documento:
   - ¿Por qué `ProductsModule` y `UsersModule` importan `SharedModule` pero no `CoreModule`?
   - ¿Qué sucedería si declaras `LoadingSpinnerComponent` tanto en `SharedModule` como en `ProductsModule`?
   - ¿Por qué `AdminModule` se carga de forma diferida y no se importa directamente en `AppModule`?

### Resultado Esperado

Un diagrama claro que muestre el árbol de módulos con flechas de importación y la lista de responsabilidades de cada módulo. Este diagrama será tu guía durante el resto del laboratorio.

### Verificación

Comparte tu diagrama con el instructor o un compañero antes de continuar. El diseño debe mostrar claramente que `SharedModule` **no provee servicios**, que `CoreModule` solo se importa en `AppModule`, y que los tres feature modules se cargan de forma diferida.

---

## Parte 2 — Creación del Proyecto Base (15 min)

### Objetivo

Generar el proyecto Angular con la configuración tradicional de NgModule (modo no-standalone), que es la arquitectura que se enseña en este curso.

### Instrucciones

1. Abre tu terminal y navega al directorio donde deseas crear el proyecto:

   ```bash
   cd ~/proyectos-angular
   ```

2. Crea el proyecto Angular en modo NgModule tradicional:

   ```bash
   ng new tienda-modular --no-standalone --routing=true --style=css --file-name-style-guide=2016
   ```

   Cuando el CLI pregunte por el esquema de estilos, selecciona **CSS**. El flag `--no-standalone` garantiza que se genere con `AppModule` y la arquitectura NgModule clásica.

3. Navega al directorio del proyecto y ábrelo en VS Code:

   ```bash
   cd tienda-modular
   code .
   ```

4. Inicia el servidor de desarrollo para confirmar que el proyecto compila correctamente:

   ```bash
   ng serve --open
   ```

5. Verifica que el navegador muestra la página de bienvenida de Angular en `http://localhost:4200`. Detén el servidor con `Ctrl + C`.

### Resultado Esperado

El proyecto `tienda-modular` se crea sin errores. El archivo `src/app/app.module.ts` existe y contiene `AppModule` con `BrowserModule` y `AppRoutingModule` importados.

### Verificación

```bash
# Verifica que app.module.ts existe y tiene la estructura correcta
Get-Content src\app\app.module.ts
```

La salida debe mostrar un `@NgModule` con `BrowserModule` en `imports` y `AppComponent` en `bootstrap`.

---

## Parte 3 — Generación de CoreModule (25 min)

### Objetivo

Crear el `CoreModule` con el patrón `forRoot()` y el guardia de importación única, e incorporar `NavbarComponent` y `FooterComponent` como componentes globales de la aplicación.

### Instrucciones

**Paso 3.1 — Generar CoreModule y sus componentes**

1. Genera el módulo Core:

   ```bash
   ng generate module core
   ```

2. Genera `NavbarComponent` dentro de `CoreModule`:

   ```bash
   ng generate component core/navbar --module=core --export --standalone=false --type=component
   ```

3. Genera `FooterComponent` dentro de `CoreModule`:

   ```bash
   ng generate component core/footer --module=core --export --standalone=false --type=component
   ```

4. Genera el servicio `LoggerService` dentro de `core`:

   ```bash
   ng generate service core/logger
   ```

**Paso 3.2 — Implementar el patrón forRoot() y el guardia de importación**

5. Abre `src/app/core/core.module.ts` y reemplaza su contenido completo con el siguiente código:

   ```typescript
   // src/app/core/core.module.ts
   import { NgModule, Optional, SkipSelf } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { RouterModule } from '@angular/router';
   import { NavbarComponent } from './navbar/navbar.component';
   import { FooterComponent } from './footer/footer.component';
   import { LoggerService } from './logger.service';

   @NgModule({
     declarations: [
       NavbarComponent,
       FooterComponent
     ],
     imports: [
       CommonModule,
       RouterModule
     ],
     exports: [
       NavbarComponent,   // Exportados para que AppComponent pueda usarlos
       FooterComponent
     ],
     providers: [
       LoggerService      // Singleton: solo se provee aquí
     ]
   })
   export class CoreModule {
     // Guardia: lanza error si CoreModule se importa más de una vez
     constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
       if (parentModule) {
         throw new Error(
           'CoreModule ya está cargado. Solo debe importarse en AppModule.'
         );
       }
     }

     // Patrón forRoot(): permite configuración opcional al importar
     static forRoot(): import('@angular/core').ModuleWithProviders<CoreModule> {
       return {
         ngModule: CoreModule,
         providers: [LoggerService]
       };
     }
   }
   ```

**Paso 3.3 — Implementar LoggerService**

6. Abre `src/app/core/logger.service.ts` y agrega la lógica básica:

   ```typescript
   // src/app/core/logger.service.ts
   import { Injectable } from '@angular/core';

   @Injectable({
     providedIn: null  // No usar providedIn: 'root'; el CoreModule lo provee
   })
   export class LoggerService {
     log(mensaje: string): void {
       console.log(`[TiendaModular] ${new Date().toISOString()} — ${mensaje}`);
     }

     error(mensaje: string): void {
       console.error(`[TiendaModular ERROR] ${mensaje}`);
     }
   }
   ```

   > **Importante:** Al usar `providedIn: null`, el servicio solo está disponible cuando el módulo que lo declara en `providers` es cargado. Esto garantiza que `LoggerService` sea un singleton controlado por `CoreModule`.

**Paso 3.4 — Agregar contenido básico a NavbarComponent y FooterComponent**

7. Reemplaza el template de `src/app/core/navbar/navbar.component.html`:

   ```html
   <!-- src/app/core/navbar/navbar.component.html -->
   <nav style="background:#1976d2; color:white; padding:1rem; display:flex; gap:1rem;">
     <strong>🛒 TiendaModular</strong>
     <a routerLink="/products" style="color:white;">Productos</a>
     <a routerLink="/users" style="color:white;">Usuarios</a>
     <a routerLink="/admin" style="color:white;">Admin</a>
   </nav>
   ```

8. Reemplaza el template de `src/app/core/footer/footer.component.html`:

   ```html
   <!-- src/app/core/footer/footer.component.html -->
   <footer style="background:#333; color:white; padding:1rem; text-align:center; margin-top:2rem;">
     <p>© {{ currentYear }} TiendaModular — Laboratorio Angular NgModule</p>
   </footer>
   ```

9. Agrega la propiedad `currentYear` en `src/app/core/footer/footer.component.ts`:

   ```typescript
   // src/app/core/footer/footer.component.ts
   import { Component } from '@angular/core';

   @Component({
     selector: 'app-footer',
     standalone: false,
     templateUrl: './footer.component.html'
   })
   export class FooterComponent {
     currentYear = new Date().getFullYear();
   }
   ```

**Paso 3.5 — Importar CoreModule en AppModule**

10. Abre `src/app/app.module.ts` e importa `CoreModule` usando `forRoot()`:

    ```typescript
    // src/app/app.module.ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { AppRoutingModule } from './app-routing.module';
    import { AppComponent } from './app.component';
    import { CoreModule } from './core/core.module';

    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule.forRoot()   // Patrón forRoot() para instancia única
      ],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

**Paso 3.6 — Actualizar AppComponent para usar Navbar y Footer**

11. Reemplaza el contenido de `src/app/app.component.html`:

    ```html
    <!-- src/app/app.component.html -->
    <app-navbar></app-navbar>

    <main style="padding: 1.5rem; min-height: 60vh;">
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
    ```

### Resultado Esperado

El proyecto compila sin errores. Al ejecutar `ng serve`, la aplicación muestra la barra de navegación azul en la parte superior y el pie de página oscuro en la parte inferior.

### Verificación

```bash
ng serve --open
```

Navega a `http://localhost:4200`. Debes ver la navbar con los enlaces y el footer con el año actual. Detén el servidor con `Ctrl + C`.

---

## Parte 4 — Generación de SharedModule (20 min)

### Objetivo

Crear el `SharedModule` con un componente de carga, una directiva de resaltado y un pipe de formato de moneda, y configurarlo para que sea reutilizable en múltiples módulos de características.

### Instrucciones

**Paso 4.1 — Generar SharedModule y sus piezas**

1. Genera el módulo compartido:

   ```bash
   ng generate module shared
   ```

2. Genera `LoadingSpinnerComponent`:

   ```bash
   ng generate component shared/loading-spinner --module=shared --export --standalone=false --type=component
   ```

3. Genera `HighlightDirective`:

   ```bash
   ng generate directive shared/highlight --module=shared --export
   ```

4. Genera `CurrencyFormatPipe`:

   ```bash
   ng generate pipe shared/currency-format --module=shared --export
   ```

**Paso 4.2 — Implementar LoadingSpinnerComponent**

5. Reemplaza `src/app/shared/loading-spinner/loading-spinner.component.html`:

   ```html
   <!-- src/app/shared/loading-spinner/loading-spinner.component.html -->
   <div *ngIf="visible" style="text-align:center; padding:2rem;">
     <div style="
       display:inline-block;
       width:40px; height:40px;
       border:4px solid #ccc;
       border-top-color:#1976d2;
       border-radius:50%;
       animation: spin 0.8s linear infinite;">
     </div>
     <p style="color:#555; margin-top:0.5rem;">{{ mensaje }}</p>
   </div>

   <style>
     @keyframes spin { to { transform: rotate(360deg); } }
   </style>
   ```

6. Actualiza `src/app/shared/loading-spinner/loading-spinner.component.ts`:

   ```typescript
   // src/app/shared/loading-spinner/loading-spinner.component.ts
   import { Component, Input } from '@angular/core';

   @Component({
     selector: 'app-loading-spinner',
     standalone: false,
     templateUrl: './loading-spinner.component.html'
   })
   export class LoadingSpinnerComponent {
     @Input() visible: boolean = true;
     @Input() mensaje: string = 'Cargando...';
   }
   ```

**Paso 4.3 — Implementar HighlightDirective**

7. Reemplaza el contenido de `src/app/shared/highlight.directive.ts`:

   ```typescript
   // src/app/shared/highlight.directive.ts
   import { Directive, ElementRef, HostListener, Input } from '@angular/core';

   @Directive({
     selector: '[appHighlight]',
     standalone: false
   })
   export class HighlightDirective {
     @Input() appHighlight: string = '#fffde7';  // Color de resaltado configurable

     constructor(private el: ElementRef) {}

     @HostListener('mouseenter')
     onMouseEnter(): void {
       this.el.nativeElement.style.backgroundColor = this.appHighlight;
       this.el.nativeElement.style.transition = 'background-color 0.3s';
     }

     @HostListener('mouseleave')
     onMouseLeave(): void {
       this.el.nativeElement.style.backgroundColor = '';
     }
   }
   ```

**Paso 4.4 — Implementar CurrencyFormatPipe**

8. Reemplaza el contenido de `src/app/shared/currency-format.pipe.ts`:

   ```typescript
   // src/app/shared/currency-format.pipe.ts
   import { Pipe, PipeTransform } from '@angular/core';

   @Pipe({
     name: 'currencyFormat',
     standalone: false
   })
   export class CurrencyFormatPipe implements PipeTransform {
     transform(valor: number, moneda: string = 'USD', simbolo: string = '$'): string {
       if (valor === null || valor === undefined || isNaN(valor)) {
         return `${simbolo}0.00`;
       }
       const formateado = valor.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
       return `${simbolo}${formateado} ${moneda}`;
     }
   }
   ```

**Paso 4.5 — Configurar SharedModule con re-exportación de CommonModule**

9. Abre `src/app/shared/shared.module.ts` y verifica que tenga esta estructura (el CLI ya habrá generado parte de ella; ajusta según sea necesario):

   ```typescript
   // src/app/shared/shared.module.ts
   import { NgModule } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
   import { HighlightDirective } from './highlight.directive';
   import { CurrencyFormatPipe } from './currency-format.pipe';

   @NgModule({
     declarations: [
       LoadingSpinnerComponent,
       HighlightDirective,
       CurrencyFormatPipe
     ],
     imports: [
       CommonModule
     ],
     exports: [
       CommonModule,          // Re-exportado: quien importe SharedModule obtiene CommonModule también
       LoadingSpinnerComponent,
       HighlightDirective,
       CurrencyFormatPipe
     ]
     // Sin providers: los servicios NO van en SharedModule
   })
   export class SharedModule { }
   ```

### Resultado Esperado

El proyecto compila sin errores. `SharedModule` declara y exporta tres piezas reutilizables y re-exporta `CommonModule`.

### Verificación

```bash
ng build --configuration development 2>&1 | tail -5
```

La salida debe terminar sin errores de compilación. Si hay errores de importación, verifica que los paths en `shared.module.ts` coincidan con los archivos generados.

---

## Parte 5 — Generación de ProductsModule con Rutas (30 min)

### Objetivo

Crear el módulo de características de productos con sus tres componentes y su módulo de ruteo, importando `SharedModule` para reutilizar los recursos compartidos.

### Instrucciones

**Paso 5.1 — Generar ProductsModule y ProductsRoutingModule**

1. Genera el módulo de productos con su módulo de ruteo integrado:

   ```bash
   ng generate module products --routing
   ```

   Esto crea `products.module.ts` y `products-routing.module.ts`.

2. Genera los tres componentes del módulo de productos:

   ```bash
   ng generate component products/product-list --module=products --standalone=false --type=component
   ng generate component products/product-detail --module=products --standalone=false --type=component
   ng generate component products/product-form --module=products --standalone=false --type=component
   ```

**Paso 5.2 — Crear ProductService**

3. Genera el servicio dentro de la carpeta `products`:

   ```bash
   ng generate service products/product
   ```

4. Implementa `src/app/products/product.service.ts`:

   ```typescript
   // src/app/products/product.service.ts
   import { Injectable } from '@angular/core';

   export interface Product {
     id: number;
     nombre: string;
     precio: number;
     categoria: string;
     disponible: boolean;
   }

   @Injectable({
     providedIn: null   // Controlado por ProductsModule
   })
   export class ProductService {
     private productos: Product[] = [
       { id: 1, nombre: 'Laptop Pro 15"', precio: 1299.99, categoria: 'Electrónica', disponible: true },
       { id: 2, nombre: 'Teclado Mecánico RGB', precio: 89.50, categoria: 'Periféricos', disponible: true },
       { id: 3, nombre: 'Monitor 4K 27"', precio: 449.00, categoria: 'Electrónica', disponible: false },
       { id: 4, nombre: 'Mouse Inalámbrico', precio: 35.99, categoria: 'Periféricos', disponible: true },
       { id: 5, nombre: 'Auriculares Bluetooth', precio: 129.00, categoria: 'Audio', disponible: true }
     ];

     obtenerTodos(): Product[] {
       return this.productos;
     }

     obtenerPorId(id: number): Product | undefined {
       return this.productos.find(p => p.id === id);
     }
   }
   ```

**Paso 5.3 — Implementar ProductListComponent**

5. Reemplaza `src/app/products/product-list/product-list.component.html`:

   ```html
   <!-- src/app/products/product-list/product-list.component.html -->
   <div style="max-width:800px; margin:0 auto;">
     <h2>📦 Catálogo de Productos</h2>

     <app-loading-spinner [visible]="cargando" mensaje="Cargando productos...">
     </app-loading-spinner>

     <table *ngIf="!cargando" style="width:100%; border-collapse:collapse;">
       <thead style="background:#1976d2; color:white;">
         <tr>
           <th style="padding:0.75rem;">Nombre</th>
           <th style="padding:0.75rem;">Precio</th>
           <th style="padding:0.75rem;">Categoría</th>
           <th style="padding:0.75rem;">Estado</th>
           <th style="padding:0.75rem;">Acciones</th>
         </tr>
       </thead>
       <tbody>
         <tr *ngFor="let producto of productos"
             [appHighlight]="'#e3f2fd'"
             style="border-bottom:1px solid #ddd;">
           <td style="padding:0.75rem;">{{ producto.nombre }}</td>
           <td style="padding:0.75rem;">{{ producto.precio | currencyFormat }}</td>
           <td style="padding:0.75rem;">{{ producto.categoria }}</td>
           <td style="padding:0.75rem;">
             <span [style.color]="producto.disponible ? 'green' : 'red'">
               {{ producto.disponible ? '✅ Disponible' : '❌ Agotado' }}
             </span>
           </td>
           <td style="padding:0.75rem;">
             <a [routerLink]="['/products', producto.id]">Ver detalle</a>
           </td>
         </tr>
       </tbody>
     </table>
   </div>
   ```

6. Actualiza `src/app/products/product-list/product-list.component.ts`:

   ```typescript
   // src/app/products/product-list/product-list.component.ts
   import { Component, OnInit } from '@angular/core';
   import { Product, ProductService } from '../product.service';

   @Component({
     selector: 'app-product-list',
     standalone: false,
     templateUrl: './product-list.component.html'
   })
   export class ProductListComponent implements OnInit {
     productos: Product[] = [];
     cargando = true;

     constructor(private productService: ProductService) {}

     ngOnInit(): void {
       // Simulamos una carga asíncrona para demostrar el spinner
       setTimeout(() => {
         this.productos = this.productService.obtenerTodos();
         this.cargando = false;
       }, 1200);
     }
   }
   ```

**Paso 5.4 — Implementar ProductDetailComponent**

7. Reemplaza `src/app/products/product-detail/product-detail.component.html`:

   ```html
   <!-- src/app/products/product-detail/product-detail.component.html -->
   <div style="max-width:500px; margin:2rem auto; padding:1.5rem; border:1px solid #ddd; border-radius:8px;">
     <div *ngIf="producto; else noEncontrado">
       <h2>{{ producto.nombre }}</h2>
       <p><strong>Precio:</strong> {{ producto.precio | currencyFormat }}</p>
       <p><strong>Categoría:</strong> {{ producto.categoria }}</p>
       <p><strong>Estado:</strong>
         <span [style.color]="producto.disponible ? 'green' : 'red'">
           {{ producto.disponible ? 'Disponible' : 'Agotado' }}
         </span>
       </p>
       <a routerLink="/products">← Volver al catálogo</a>
     </div>
     <ng-template #noEncontrado>
       <p style="color:red;">Producto no encontrado.</p>
       <a routerLink="/products">← Volver al catálogo</a>
     </ng-template>
   </div>
   ```

8. Actualiza `src/app/products/product-detail/product-detail.component.ts`:

   ```typescript
   // src/app/products/product-detail/product-detail.component.ts
   import { Component, OnInit } from '@angular/core';
   import { ActivatedRoute } from '@angular/router';
   import { Product, ProductService } from '../product.service';

   @Component({
     selector: 'app-product-detail',
     standalone: false,
     templateUrl: './product-detail.component.html'
   })
   export class ProductDetailComponent implements OnInit {
     producto: Product | undefined;

     constructor(
       private route: ActivatedRoute,
       private productService: ProductService
     ) {}

     ngOnInit(): void {
       const id = Number(this.route.snapshot.paramMap.get('id'));
       this.producto = this.productService.obtenerPorId(id);
     }
   }
   ```

**Paso 5.5 — Implementar ProductFormComponent**

9. Reemplaza `src/app/products/product-form/product-form.component.html`:

   ```html
   <!-- src/app/products/product-form/product-form.component.html -->
   <div style="max-width:500px; margin:2rem auto; padding:1.5rem; border:1px solid #ddd; border-radius:8px;">
     <h2>➕ Nuevo Producto</h2>
     <p style="color:#888; font-style:italic;">
       (Formulario de demostración — integración completa en Práctica 11)
     </p>
     <form>
       <div style="margin-bottom:1rem;">
         <label>Nombre: <input type="text" placeholder="Nombre del producto" style="width:100%; padding:0.5rem;"></label>
       </div>
       <div style="margin-bottom:1rem;">
         <label>Precio: <input type="number" placeholder="0.00" style="width:100%; padding:0.5rem;"></label>
       </div>
       <button type="submit" style="background:#1976d2; color:white; padding:0.5rem 1.5rem; border:none; border-radius:4px; cursor:pointer;">
         Guardar
       </button>
     </form>
   </div>
   ```

**Paso 5.6 — Configurar ProductsRoutingModule**

10. Reemplaza el contenido de `src/app/products/products-routing.module.ts`:

    ```typescript
    // src/app/products/products-routing.module.ts
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { ProductListComponent } from './product-list/product-list.component';
    import { ProductDetailComponent } from './product-detail/product-detail.component';
    import { ProductFormComponent } from './product-form/product-form.component';

    const routes: Routes = [
      { path: '', component: ProductListComponent },
      { path: 'new', component: ProductFormComponent },
      { path: ':id', component: ProductDetailComponent }
    ];

    @NgModule({
      imports: [RouterModule.forChild(routes)],  // forChild, NUNCA forRoot aquí
      exports: [RouterModule]
    })
    export class ProductsRoutingModule { }
    ```

**Paso 5.7 — Configurar ProductsModule**

11. Reemplaza `src/app/products/products.module.ts`:

    ```typescript
    // src/app/products/products.module.ts
    import { NgModule } from '@angular/core';
    import { SharedModule } from '../shared/shared.module';
    import { ProductsRoutingModule } from './products-routing.module';
    import { ProductListComponent } from './product-list/product-list.component';
    import { ProductDetailComponent } from './product-detail/product-detail.component';
    import { ProductFormComponent } from './product-form/product-form.component';
    import { ProductService } from './product.service';

    @NgModule({
      declarations: [
        ProductListComponent,
        ProductDetailComponent,
        ProductFormComponent
      ],
      imports: [
        SharedModule,            // Importa CommonModule, pipes y directivas compartidas
        ProductsRoutingModule
      ],
      providers: [
        ProductService           // Disponible solo en este módulo y sus componentes
      ]
    })
    export class ProductsModule { }
    ```

    > **Nota sobre encapsulamiento:** `ProductService` está en `providers` de `ProductsModule`. Los componentes de `UsersModule` o `AdminModule` **no pueden inyectarlo directamente**, lo que demuestra el encapsulamiento modular.

### Resultado Esperado

`ProductsModule` está completamente configurado con tres componentes, un servicio encapsulado y rutas propias. Usa `SharedModule` para acceder a `LoadingSpinnerComponent`, `HighlightDirective` y `CurrencyFormatPipe`.

### Verificación

```bash
ng build --configuration development
```

No debe haber errores de compilación relacionados con `ProductsModule`.

---

## Parte 6 — Generación de UsersModule (20 min)

### Objetivo

Crear el módulo de usuarios con dos componentes, demostrar que no puede acceder a `ProductService` (encapsulamiento modular) y configurar sus rutas con `RouterModule.forChild()`.

### Instrucciones

**Paso 6.1 — Generar UsersModule y sus componentes**

1. Genera el módulo de usuarios con ruteo:

   ```bash
   ng generate module users --routing
   ```

2. Genera los componentes:

   ```bash
   ng generate component users/user-list --module=users --standalone=false --type=component
   ng generate component users/user-profile --module=users --standalone=false --type=component
   ```

**Paso 6.2 — Implementar UserListComponent**

3. Reemplaza `src/app/users/user-list/user-list.component.html`:

   ```html
   <!-- src/app/users/user-list/user-list.component.html -->
   <div style="max-width:700px; margin:0 auto;">
     <h2>👥 Lista de Usuarios</h2>

     <app-loading-spinner [visible]="cargando" mensaje="Cargando usuarios...">
     </app-loading-spinner>

     <ul *ngIf="!cargando" style="list-style:none; padding:0;">
       <li *ngFor="let usuario of usuarios"
           [appHighlight]="'#f3e5f5'"
           style="padding:1rem; margin-bottom:0.5rem; border:1px solid #ddd; border-radius:4px;">
         <strong>{{ usuario.nombre }}</strong> — {{ usuario.email }}
         <a [routerLink]="['/users', usuario.id]" style="margin-left:1rem;">Ver perfil</a>
       </li>
     </ul>
   </div>
   ```

4. Actualiza `src/app/users/user-list/user-list.component.ts`:

   ```typescript
   // src/app/users/user-list/user-list.component.ts
   import { Component, OnInit } from '@angular/core';

   interface Usuario {
     id: number;
     nombre: string;
     email: string;
   }

   @Component({
     selector: 'app-user-list',
     standalone: false,
     templateUrl: './user-list.component.html'
   })
   export class UserListComponent implements OnInit {
     usuarios: Usuario[] = [];
     cargando = true;

     ngOnInit(): void {
       setTimeout(() => {
         this.usuarios = [
           { id: 1, nombre: 'Ana García', email: 'ana@tienda.com' },
           { id: 2, nombre: 'Carlos López', email: 'carlos@tienda.com' },
           { id: 3, nombre: 'María Torres', email: 'maria@tienda.com' }
         ];
         this.cargando = false;
       }, 800);
     }
   }
   ```

**Paso 6.3 — Implementar UserProfileComponent**

5. Reemplaza `src/app/users/user-profile/user-profile.component.html`:

   ```html
   <!-- src/app/users/user-profile/user-profile.component.html -->
   <div style="max-width:400px; margin:2rem auto; padding:1.5rem; border:1px solid #ddd; border-radius:8px;">
     <h2>👤 Perfil de Usuario</h2>
     <p><strong>ID:</strong> {{ userId }}</p>
     <p style="color:#888; font-style:italic;">
       Perfil completo disponible en Práctica 11.
     </p>
     <a routerLink="/users">← Volver a la lista</a>
   </div>
   ```

6. Actualiza `src/app/users/user-profile/user-profile.component.ts`:

   ```typescript
   // src/app/users/user-profile/user-profile.component.ts
   import { Component, OnInit } from '@angular/core';
   import { ActivatedRoute } from '@angular/router';

   @Component({
     selector: 'app-user-profile',
     standalone: false,
     templateUrl: './user-profile.component.html'
   })
   export class UserProfileComponent implements OnInit {
     userId: number = 0;

     constructor(private route: ActivatedRoute) {}

     ngOnInit(): void {
       this.userId = Number(this.route.snapshot.paramMap.get('id'));
     }
   }
   ```

**Paso 6.4 — Configurar UsersRoutingModule**

7. Reemplaza `src/app/users/users-routing.module.ts`:

   ```typescript
   // src/app/users/users-routing.module.ts
   import { NgModule } from '@angular/core';
   import { RouterModule, Routes } from '@angular/router';
   import { UserListComponent } from './user-list/user-list.component';
   import { UserProfileComponent } from './user-profile/user-profile.component';

   const routes: Routes = [
     { path: '', component: UserListComponent },
     { path: ':id', component: UserProfileComponent }
   ];

   @NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
   })
   export class UsersRoutingModule { }
   ```

**Paso 6.5 — Configurar UsersModule**

8. Reemplaza `src/app/users/users.module.ts`:

   ```typescript
   // src/app/users/users.module.ts
   import { NgModule } from '@angular/core';
   import { SharedModule } from '../shared/shared.module';
   import { UsersRoutingModule } from './users-routing.module';
   import { UserListComponent } from './user-list/user-list.component';
   import { UserProfileComponent } from './user-profile/user-profile.component';

   @NgModule({
     declarations: [
       UserListComponent,
       UserProfileComponent
     ],
     imports: [
       SharedModule,          // Acceso a LoadingSpinnerComponent, HighlightDirective, CurrencyFormatPipe
       UsersRoutingModule
       // ProductsModule NO se importa: ProductService no está disponible aquí
     ]
     // Sin providers de ProductService: encapsulamiento modular demostrado
   })
   export class UsersModule { }
   ```

### Resultado Esperado

`UsersModule` usa `SharedModule` (spinner y directiva de resaltado) pero no tiene acceso a `ProductService`. Esto demuestra el encapsulamiento modular: cada feature module gestiona sus propios datos.

### Verificación

Intenta (solo como ejercicio mental, **no ejecutes esto**) agregar `ProductService` como dependencia en `UserListComponent`. El compilador TypeScript lanzaría un error de inyección en tiempo de compilación porque `ProductService` no está en el árbol de inyección de `UsersModule`. Este es el comportamiento correcto que demuestra el encapsulamiento.

---

## Parte 7 — Generación de AdminModule con Lazy Loading (30 min)

### Objetivo

Crear el `AdminModule` con carga diferida, configurar la ruta en `AppRoutingModule` usando `loadChildren` con importación dinámica, y verificar el comportamiento en Chrome DevTools.

### Instrucciones

**Paso 7.1 — Generar AdminModule**

1. Genera el módulo de administración con ruteo:

   ```bash
   ng generate module admin --routing
   ```

2. Genera el componente del panel de administración:

   ```bash
   ng generate component admin/admin-dashboard --module=admin --standalone=false --type=component
   ```

3. Genera el componente de gestión de productos (solo para admin):

   ```bash
   ng generate component admin/product-management --module=admin --standalone=false --type=component
   ```

**Paso 7.2 — Implementar AdminDashboardComponent**

4. Reemplaza `src/app/admin/admin-dashboard/admin-dashboard.component.html`:

   ```html
   <!-- src/app/admin/admin-dashboard/admin-dashboard.component.html -->
   <div style="max-width:800px; margin:0 auto;">
     <h2>⚙️ Panel de Administración</h2>
     <div style="background:#fff3e0; border:1px solid #ff9800; border-radius:8px; padding:1rem; margin-bottom:1rem;">
       <strong>🔄 Lazy Loading activo:</strong> Este módulo se cargó bajo demanda.
       Verifica la pestaña Network en Chrome DevTools para ver el chunk JS cargado.
     </div>

     <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-top:1.5rem;">
       <div style="padding:1.5rem; background:#e8f5e9; border-radius:8px; text-align:center;">
         <h3>📦 Productos</h3>
         <p>150 artículos</p>
         <a routerLink="/admin/products">Gestionar</a>
       </div>
       <div style="padding:1.5rem; background:#e3f2fd; border-radius:8px; text-align:center;">
         <h3>👥 Usuarios</h3>
         <p>42 registrados</p>
       </div>
       <div style="padding:1.5rem; background:#fce4ec; border-radius:8px; text-align:center;">
         <h3>💰 Ventas</h3>
         <p>$12,450.00</p>
       </div>
     </div>
   </div>
   ```

**Paso 7.3 — Implementar ProductManagementComponent**

5. Reemplaza `src/app/admin/product-management/product-management.component.html`:

   ```html
   <!-- src/app/admin/product-management/product-management.component.html -->
   <div style="max-width:700px; margin:0 auto;">
     <h2>🛠️ Gestión de Productos (Admin)</h2>
     <p style="color:#888; font-style:italic;">
       Esta sección solo es accesible desde AdminModule (lazy loaded).
     </p>
     <a routerLink="/admin">← Volver al panel</a>
   </div>
   ```

**Paso 7.4 — Configurar AdminRoutingModule**

6. Reemplaza `src/app/admin/admin-routing.module.ts`:

   ```typescript
   // src/app/admin/admin-routing.module.ts
   import { NgModule } from '@angular/core';
   import { RouterModule, Routes } from '@angular/router';
   import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
   import { ProductManagementComponent } from './product-management/product-management.component';

   const routes: Routes = [
     { path: '', component: AdminDashboardComponent },
     { path: 'products', component: ProductManagementComponent }
   ];

   @NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
   })
   export class AdminRoutingModule { }
   ```

**Paso 7.5 — Configurar AdminModule**

7. Reemplaza `src/app/admin/admin.module.ts`:

   ```typescript
   // src/app/admin/admin.module.ts
   import { NgModule } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { AdminRoutingModule } from './admin-routing.module';
   import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
   import { ProductManagementComponent } from './product-management/product-management.component';

   @NgModule({
     declarations: [
       AdminDashboardComponent,
       ProductManagementComponent
     ],
     imports: [
       CommonModule,
       AdminRoutingModule
     ]
     // AdminModule NO importa SharedModule en este ejemplo para mantenerlo simple
     // En una aplicación real, sí lo importaría
   })
   export class AdminModule { }
   ```

   > **Crítico:** `AdminModule` **NO** se importa en `AppModule`. Solo se registra en las rutas con `loadChildren`. Si lo importas en `AppModule`, el lazy loading no funcionará.

**Paso 7.6 — Configurar AppRoutingModule con Lazy Loading**

8. Reemplaza `src/app/app-routing.module.ts` con la configuración completa de rutas:

   ```typescript
   // src/app/app-routing.module.ts
   import { NgModule } from '@angular/core';
   import { RouterModule, Routes } from '@angular/router';

   const routes: Routes = [
     {
       path: 'products',
       loadChildren: () =>
         import('./products/products.module').then(m => m.ProductsModule)
     },
     {
       path: 'users',
       loadChildren: () =>
         import('./users/users.module').then(m => m.UsersModule)
     },
     {
       path: 'admin',
       loadChildren: () =>
         import('./admin/admin.module').then(m => m.AdminModule)
     },
     {
       path: '',
       redirectTo: '/products',
       pathMatch: 'full'
     },
     {
       path: '**',
       redirectTo: '/products'
     }
   ];

   @NgModule({
     imports: [RouterModule.forRoot(routes)],
     exports: [RouterModule]
   })
   export class AppRoutingModule { }
   ```

   > **Análisis del código:** La sintaxis `loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)` es un **import dinámico de ES2020**. Angular lo detecta en tiempo de compilación y genera un *chunk* JavaScript separado para cada módulo lazy. Este chunk solo se descarga cuando el usuario navega a la ruta correspondiente.

### Resultado Esperado

`AppRoutingModule` tiene tres rutas con `loadChildren`. `AdminModule` no aparece en los `imports` de `AppModule`. El proyecto compila sin errores.

### Verificación

```bash
ng build --configuration development
```

Deberías ver líneas que mencionan chunks separados para `products`, `users` y `admin`, lo que confirma que el code splitting está funcionando.

---

## Parte 8 — Integración Final y Verificación (20 min)

### Objetivo

Verificar que toda la arquitectura modular funciona correctamente en el navegador, confirmar el lazy loading en Chrome DevTools y explorar el árbol de módulos en Angular DevTools.

### Instrucciones

**Paso 8.1 — Compilación de producción para verificar chunks**

1. Ejecuta el build de producción:

   ```bash
   ng build
   ```

2. Observa la salida del CLI. Deberías ver algo similar a:

   ```
   Initial chunk files          | Names          | Raw size
   main.js                      | main           | ~150 kB
   polyfills.js                 | polyfills      | ~32 kB
   styles.css                   | styles         | ~1 kB

   Lazy chunk files             | Names          | Raw size
   products-products-module.js  | products       | ~15 kB
   users-users-module.js        | users          | ~8 kB
   admin-admin-module.js        | admin          | ~6 kB
   ```

   Los archivos bajo **"Lazy chunk files"** confirman que el code splitting está activo.

**Paso 8.2 — Verificación en el navegador con Chrome DevTools**

3. Inicia el servidor de desarrollo:

   ```bash
   ng serve --open
   ```

4. En Chrome, abre DevTools con `F12` y ve a la pestaña **Network**.

5. Filtra por **JS** para ver solo archivos JavaScript.

6. **Limpia el historial de red** haciendo clic en el ícono de prohibición (🚫).

7. Navega a `http://localhost:4200/products`. Observa en la pestaña Network:
   - Se carga un archivo con `products` en el nombre (el chunk lazy del módulo de productos).
   - Anota el tamaño del chunk.

8. Navega a `http://localhost:4200/users`. Observa:
   - Se carga un nuevo chunk con `users` en el nombre.
   - El chunk de `products` **no se recarga**.

9. Navega a `http://localhost:4200/admin`. Observa:
   - Se carga el chunk de `admin`.
   - Los chunks de `products` y `users` **no se recargan**.

10. Navega de regreso a `http://localhost:4200/products`. Observa:
    - **No se carga ningún chunk nuevo**: Angular ya tiene el módulo en memoria.

**Paso 8.3 — Exploración con Angular DevTools**

11. Con la aplicación corriendo, abre Angular DevTools en Chrome (ícono de Angular en las extensiones o en el panel de DevTools).

12. Ve a la pestaña **Components** y explora el árbol de componentes. Deberías ver:
    - `AppComponent` en la raíz.
    - `NavbarComponent` y `FooterComponent` (provenientes de `CoreModule`).
    - El componente activo según la ruta actual.

13. Ve a la pestaña **Injector Tree** (si está disponible en tu versión de Angular DevTools) para ver la jerarquía de inyectores y confirmar que `LoggerService` está en el inyector raíz.

**Paso 8.4 — Demostración del encapsulamiento de ProductService**

14. Para demostrar el encapsulamiento, agrega temporalmente el siguiente código a `src/app/users/user-list/user-list.component.ts` (solo para observar el error, luego lo revertirás):

    ```typescript
    // SOLO PARA DEMOSTRACIÓN — Agregar temporalmente
    // import { ProductService } from '../../products/product.service';
    // constructor(private productService: ProductService) {}
    // ngOnInit() { console.log(this.productService.obtenerTodos()); }
    ```

    Si descomentaras estas líneas, el compilador lanzaría un error de inyección de dependencias porque `ProductService` no está registrado en el árbol de inyección de `UsersModule`. Este es el encapsulamiento modular en acción.

    **No descomentes ni ejecutes este código.** Es solo un ejercicio conceptual.

### Resultado Esperado

- La aplicación navega correctamente entre las rutas `/products`, `/users` y `/admin`.
- Chrome DevTools muestra chunks JavaScript separados cargándose bajo demanda.
- Angular DevTools muestra el árbol de componentes con `NavbarComponent` y `FooterComponent` siempre presentes.
- La tabla de productos muestra el spinner durante 1.2 segundos antes de cargar los datos.
- El pipe `currencyFormat` formatea los precios correctamente (ej: `$1,299.99 USD`).
- La directiva `appHighlight` resalta las filas al pasar el mouse.

---

## Validación y Pruebas

### Lista de Verificación Completa

Ejecuta cada verificación y marca cuando pase:

**Estructura del proyecto:**

```bash
# Verificar que todos los módulos existen
ls src/app/core/core.module.ts
ls src/app/shared/shared.module.ts
ls src/app/products/products.module.ts
ls src/app/users/users.module.ts
ls src/app/admin/admin.module.ts
```

**Compilación sin errores:**

```bash
ng build
# Resultado esperado: el comando finaliza sin errores
```

**Verificar que AdminModule NO está en AppModule:**

```bash
Select-String -Path src\app\app.module.ts -Pattern 'AdminModule'
# Resultado esperado: sin coincidencias (AdminModule no debe aparecer aquí)
```

**Verificar lazy loading en AppRoutingModule:**

```bash
Select-String -Path src\app\app-routing.module.ts -Pattern 'loadChildren'
# Resultado esperado: 3 líneas con loadChildren (una por cada módulo lazy)
```

**Verificar que SharedModule no tiene providers:**

```bash
Select-String -Path src\app\shared\shared.module.ts -Pattern 'providers'
# Resultado esperado: sin salida (SharedModule no debe tener providers)
```

**Verificar que CoreModule usa forRoot():**

```bash
Select-String -Path src\app\core\core.module.ts -Pattern 'forRoot'
# Resultado esperado: al menos 1 línea con el método forRoot
```

**Verificar que CoreModule tiene el guardia de importación:**

```bash
Select-String -Path src\app\core\core.module.ts -Pattern 'SkipSelf'
# Resultado esperado: al menos 1 línea con @SkipSelf
```

### Prueba Funcional en el Navegador

| Acción | Resultado Esperado |
|---|---|
| Navegar a `/products` | Tabla de productos con spinner inicial, precios formateados |
| Hover sobre una fila de producto | Fondo azul claro (HighlightDirective) |
| Clic en "Ver detalle" de un producto | Vista de detalle con precio formateado |
| Navegar a `/users` | Lista de usuarios con spinner inicial, fondo lila al hover |
| Navegar a `/admin` | Panel con tarjetas de estadísticas y mensaje de lazy loading |
| Navegar a `/admin/products` | Vista de gestión de productos admin |
| Abrir DevTools → Network → JS | Chunks separados por módulo cargándose al navegar |
| Regresar a `/products` | No se recarga el chunk (ya en memoria) |

---

## Solución de Problemas

### Problema 1: Error "BrowserModule has already been loaded"

**Síntoma:**

```
Error: BrowserModule has already been loaded.
If you need access to common directives such as NgIf and NgFor,
import CommonModule instead.
```

**Causa:**

Se importó `BrowserModule` en un módulo de características (`ProductsModule`, `UsersModule` o `AdminModule`) en lugar de `CommonModule`. `BrowserModule` solo puede importarse una vez en toda la aplicación, y ese lugar es `AppModule`.

**Solución:**

1. Abre el módulo que causa el error (el mensaje del stack trace indicará cuál).
2. Localiza la importación de `BrowserModule`:

   ```typescript
   // ❌ Incorrecto en un feature module
   imports: [BrowserModule, ...]
   ```

3. Reemplázala por `CommonModule` (o por `SharedModule` si ya re-exporta `CommonModule`):

   ```typescript
   // ✅ Correcto en un feature module
   imports: [SharedModule, ...]
   // o
   imports: [CommonModule, ...]
   ```

4. Guarda el archivo y verifica que el error desaparece con `ng serve`.

---

### Problema 2: El lazy loading no genera chunks separados (AdminModule se carga en el bundle principal)

**Síntoma:**

Al ejecutar `ng build`, no aparece `admin-admin-module.js` en los "Lazy chunk files". Todos los componentes de Admin se incluyen en `main.js`. En Chrome DevTools, el chunk de admin no se carga al navegar a `/admin`.

**Causa:**

`AdminModule` fue importado directamente en `AppModule` (o en `CoreModule`) además de estar registrado con `loadChildren` en las rutas. Cuando Angular detecta una importación directa de un módulo, lo incluye en el bundle principal, ignorando el `loadChildren`.

**Solución:**

1. Abre `src/app/app.module.ts` y busca si `AdminModule` aparece en los `imports`:

   ```typescript
   // ❌ Incorrecto: importación directa + loadChildren = lazy loading no funciona
   imports: [
     BrowserModule,
     AppRoutingModule,
     CoreModule.forRoot(),
     AdminModule   // ← ELIMINAR ESTA LÍNEA
   ]
   ```

2. Elimina la importación directa de `AdminModule` y su `import` statement:

   ```typescript
   // ✅ Correcto: AdminModule solo se referencia en AppRoutingModule via loadChildren
   imports: [
     BrowserModule,
     AppRoutingModule,
     CoreModule.forRoot()
   ]
   ```

3. Verifica también que `CoreModule` no importe `AdminModule`.
4. Ejecuta `ng build` nuevamente y confirma que `admin-admin-module.js` aparece en los "Lazy chunk files".

---

## Limpieza del Entorno

Al finalizar el laboratorio, realiza los siguientes pasos para mantener tu entorno ordenado:

1. **Detén el servidor de desarrollo** si está en ejecución:

   ```bash
   # En la terminal donde corre ng serve
   Ctrl + C
   ```

2. **Elimina los archivos de build** generados (opcionales, ocupan espacio):

   ```bash
   # Desde la raíz del proyecto tienda-modular
   Remove-Item -Recurse -Force .\dist
   ```

3. **Guarda tu trabajo** en un repositorio Git (recomendado):

   ```bash
   git init
   git add .
   git commit -m "Lab 10-00-01: Arquitectura multi-módulo con lazy loading completada"
   ```

4. **Cierra VS Code** y los tabs del navegador relacionados con el laboratorio.

5. El proyecto `tienda-modular` puede conservarse como referencia para las prácticas siguientes (Práctica 11 y posteriores).

---

## Resumen

En este laboratorio construiste una aplicación Angular multi-módulo completa, aplicando los siguientes conceptos y patrones:

| Concepto | Implementación Realizada |
|---|---|
| **Diseño previo en papel** | Árbol de módulos con responsabilidades definidas antes de codificar |
| **AppModule ligero** | Solo declara `AppComponent`, importa `BrowserModule`, `AppRoutingModule` y `CoreModule.forRoot()` |
| **CoreModule + forRoot()** | Servicios singleton (`LoggerService`) y componentes globales (`NavbarComponent`, `FooterComponent`) con guardia de importación única |
| **SharedModule** | Tres piezas reutilizables (`LoadingSpinnerComponent`, `HighlightDirective`, `CurrencyFormatPipe`) sin providers, re-exportando `CommonModule` |
| **Feature Modules** | `ProductsModule` y `UsersModule` con sus propios componentes, rutas y dependencias encapsuladas |
| **Encapsulamiento de servicios** | `ProductService` en `providers` de `ProductsModule`; `UsersModule` no puede accederlo directamente |
| **RouterModule.forChild()** | Usado en todos los módulos de características; `forRoot()` solo en `AppRoutingModule` |
| **Lazy Loading** | `AdminModule`, `ProductsModule` y `UsersModule` cargados bajo demanda con `loadChildren` + import dinámico |
| **Verificación DevTools** | Chunks JS separados en Network tab; árbol de componentes en Angular DevTools |

### Arquitectura Final del Proyecto

```
src/app/
├── app.module.ts                    ← Módulo raíz (ligero)
├── app-routing.module.ts            ← Rutas raíz con 3 lazy routes
├── app.component.*                  ← Shell de la aplicación
│
├── core/
│   ├── core.module.ts               ← Singleton services + forRoot() + guardia
│   ├── logger.service.ts            ← Servicio singleton
│   ├── navbar/navbar.component.*    ← Navbar global
│   └── footer/footer.component.*   ← Footer global
│
├── shared/
│   ├── shared.module.ts             ← Sin providers; re-exporta CommonModule
│   ├── loading-spinner/             ← Componente reutilizable con @Input
│   ├── highlight.directive.ts       ← Directiva con @HostListener
│   └── currency-format.pipe.ts     ← Pipe de transformación
│
├── products/
│   ├── products.module.ts           ← Importa SharedModule; provee ProductService
│   ├── products-routing.module.ts   ← forChild() con 3 rutas
│   ├── product.service.ts           ← Encapsulado en ProductsModule
│   ├── product-list/               ← Usa spinner, highlight y currencyFormat
│   ├── product-detail/             ← Usa currencyFormat pipe
│   └── product-form/               ← Formulario básico
│
├── users/
│   ├── users.module.ts              ← Importa SharedModule; sin ProductService
│   ├── users-routing.module.ts      ← forChild() con 2 rutas
│   ├── user-list/                  ← Usa spinner y highlight
│   └── user-profile/               ← Muestra ID de la ruta
│
└── admin/
    ├── admin.module.ts              ← NO importado en AppModule (lazy)
    ├── admin-routing.module.ts      ← forChild() con 2 rutas
    ├── admin-dashboard/            ← Panel con estadísticas
    └── product-management/         ← Gestión exclusiva de admin
```

### Recursos Adicionales

- [Documentación oficial de NgModule — angular.io](https://angular.io/guide/ngmodules)
- [Guía de Feature Modules — angular.io](https://angular.io/guide/feature-modules)
- [Lazy Loading de módulos — angular.io](https://angular.io/guide/lazy-loading-ngmodules)
- [Patrón SharedModule — angular.io](https://angular.io/guide/sharing-ngmodules)
- [Angular DevTools — Chrome Web Store](https://chrome.google.com/webstore/detail/angular-devtools/)

---
