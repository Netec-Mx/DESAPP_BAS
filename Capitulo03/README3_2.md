# Práctica 3.2 Creación de lista de tareas

<br/>
<br/>

## Objetivo

Construir una lista de tareas que permita agregar descripciones válidas, marcar tareas como completadas y consultar las pendientes, aplicando comentarios, clases, constructores, métodos, módulos, enums, tuplas y estructuras de control.

<br/>
<br/>

## Prerrequisitos

- Haber completado la práctica 3.1 Programación con TypeScript.
- Conservar el proyecto `hola-mundo` con sus dependencias instaladas.
- Disponer de Node.js 22 y Visual Studio Code.
- Haber revisado los temas del capítulo sobre clases, módulos, enums, tuplas y estructuras de control.

<br/>
<br/>

## Alcance

La práctica continúa lo aprendido en 3.1 y aplica especialmente: comentarios, `let`, `if`, `switch`, `for` clásico, `while`, tuplas, POO, módulos y enums.

El programa funciona en consola mediante llamadas escritas en `main.ts`. Los datos se conservan solo durante la ejecución; cada inicio crea una lista vacía. La edición de descripciones y la eliminación se desarrollarán en la práctica 3.3 CRUD en memoria.

<br/>
<br/>


## Distribución del tiempo

| Actividad | Minutos |
| --- | ---: |
| Preparar carpeta y configuración | 5 |
| Crear el modelo de tarea | 7 |
| Implementar la clase de lista | 12 |
| Crear el programa principal | 5 |
| Compilar, ejecutar y comprobar | 8 |
| Validar y entregar | 3 |
| **Total sugerido** | **40** |

El tiempo supone copiar el código base y analizarlo. Es una propuesta para este alcance ampliado, no una duración contractual confirmada.

<br/><br/>

## Instrucciones

### Paso 1. Preparar el ejercicio

Abre PowerShell y entra al proyecto de la práctica anterior:

```powershell
Set-Location "$env:USERPROFILE\angular-labs\hola-mundo"
New-Item -ItemType Directory -Path practica-3-2 -Force
code .
```

Si utilizaste otra ubicación para `hola-mundo`, ajusta la primera ruta.

En VS Code, crea estos archivos dentro de `practica-3-2`:

- `package.json`
- `tsconfig.json`
- `tarea.ts`
- `lista-tareas.ts`
- `main.ts`

En **`practica-3-2/package.json`**, copia:

```json
{
  "private": true,
  "type": "module"
}
```

`"type": "module"` indica a Node.js que los archivos JavaScript de esta carpeta utilizan módulos ES. Este archivo se aplica a la práctica; no reemplaza el `package.json` de Angular.

En **`practica-3-2/tsconfig.json`**, copia:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "noEmitOnError": true,
    "types": [],
    "rootDir": ".",
    "outDir": "./dist"
  },
  "include": [
    "*.ts"
  ],
  "exclude": [
    "dist"
  ]
}
```

<br/>

La configuración incluye los archivos `.ts` de esta carpeta y genera el JavaScript en `dist`. `strict` activa la comprobación estricta y `noEmitOnError` impide generar una nueva salida si hay errores. `types: []` evita cargar automáticamente tipos de otros paquetes instalados en el proyecto.

Se reutiliza el TypeScript local de `hola-mundo`; no es necesario instalar dependencias dentro de `practica-3-2`. Conserva el compilador y las versiones acordadas para el curso.

<br/><br/>

### Paso 2. Crear el modelo de tarea

En **`practica-3-2/tarea.ts`**, copia:

```typescript
// El enum define los estados permitidos de una tarea.
export enum EstadoTarea {
  Pendiente = 'pendiente',
  Completada = 'completada',
}

/* Una clase reúne datos (propiedades) y comportamiento (métodos).
   export permite utilizarla desde otro archivo. */
export class Tarea {
  id: number;
  descripcion: string;
  estado: EstadoTarea;

  constructor(id: number, descripcion: string) {
    // this se refiere a la instancia que se está inicializando.
    this.id = id;
    this.descripcion = descripcion;
    this.estado = EstadoTarea.Pendiente;
  }

  completar(): void {
    this.estado = EstadoTarea.Completada;
  }

  resumen(): string {
    // Desestructuración de propiedades del objeto actual.
    const { id, descripcion } = this;
    switch (this.estado) {
      case EstadoTarea.Pendiente:
        return `[ ] ${id}. ${descripcion}`;
      case EstadoTarea.Completada:
        return `[x] ${id}. ${descripcion}`;
    }
  }
}
```

<br/>

Identifica:

- El enum `EstadoTarea`, que define dos valores con nombre.
- La clase `Tarea`, sus propiedades y sus métodos.
- El constructor y el uso de `this` para inicializar cada objeto.
- Los comentarios de una línea y de varias líneas.
- El método `completar`, que cambia el estado de una tarea.
- El `switch`, que elige la representación `[ ]` o `[x]` según el estado.
- La desestructuración de propiedades en `resumen`.


**Relación con JavaScript:** `class`, `constructor`, `this`, `new` y los métodos forman parte de JavaScript. TypeScript agrega las anotaciones de tipos y, en este ejemplo, el enum. `Tarea` es una clase que se instancia; no es únicamente un alias de tipo como `Participante` en 3.1.

<br/><br/>

### Paso 3. Implementar la lista de tareas

En **`practica-3-2/lista-tareas.ts`**, copia:

```typescript
// La extensión .js corresponde al archivo que ejecutará Node.js.
import { EstadoTarea, Tarea } from './tarea.js';

export class ListaTareas {
  // Los campos # son privados: solo se acceden dentro de esta clase.
  #tareas: Tarea[];
  #siguienteId: number;

  constructor() {
    this.#tareas = [];
    this.#siguienteId = 1;
  }

  agregar(descripcion: string): boolean {
    const texto = descripcion.trim();
    if (texto.length === 0) {
      return false;
    }

    // new crea una instancia de Tarea y ejecuta su constructor.
    this.#tareas.push(new Tarea(this.#siguienteId, texto));
    this.#siguienteId++;
    return true;
  }

  completar(id: number): boolean {
    let indice = 0;
    // Búsqueda mediante while para practicar condición y avance.
    while (indice < this.#tareas.length) {
      const tarea = this.#tareas[indice];
      if (tarea !== undefined && tarea.id === id) {
        tarea.completar();
        return true;
      }
      indice++; // Sin este avance, la búsqueda podría no terminar.
    }
    return false;
  }

  mostrar(): void {
    if (this.#tareas.length === 0) {
      console.log('(sin tareas)');
      return;
    }

    // for clásico: inicialización, condición y actualización.
    for (let indice = 0; indice < this.#tareas.length; indice++) {
      const tarea = this.#tareas[indice];
      if (tarea !== undefined) {
        console.log(tarea.resumen());
      }
    }
  }

  pendientes(): string[] {
    return this.#tareas
      .filter((tarea) => tarea.estado === EstadoTarea.Pendiente)
      .map((tarea) => tarea.resumen());
  }

  estadisticas(): [number, number] {
    // Tupla: posición 0 = total; posición 1 = pendientes.
    return [this.#tareas.length, this.pendientes().length];
  }
}
```

<br/>

Observa el propósito de cada método:

| Método | Responsabilidad |
| --- | --- |
| `agregar` | Elimina espacios en los extremos, rechaza texto vacío y crea una tarea pendiente. |
| `completar` | Busca una tarea por su identificador usando `while` y cambia su estado. |
| `mostrar` | Recorre la colección con un `for` clásico y muestra cada tarea. |
| `pendientes` | Selecciona tareas pendientes y devuelve sus descripciones formateadas. |
| `estadisticas` | Devuelve una tupla con el total de tareas y la cantidad de pendientes. |

Los campos con `#` son privados de JavaScript: la clase controla el acceso a su colección y a su contador. Cada instancia de `ListaTareas` tiene su propio estado.

`let` permite actualizar el índice de los ciclos. La comprobación `tarea !== undefined` verifica que se obtuvo un elemento antes de usarlo. El identificador de la tarea y su posición en el arreglo son conceptos diferentes: la tarea con ID `1` ocupa inicialmente el índice `0`.

**Módulos:** `export` hace disponibles las clases y el enum; `import` permite utilizarlos en otro archivo. Las importaciones llevan extensión `.js` porque ese es el archivo que ejecutará Node.js. Durante la compilación, TypeScript resuelve estas referencias a los archivos `.ts` correspondientes.

<br/><br/>

### Paso 4. Crear el programa principal

En **`practica-3-2/main.ts`**, copia:

```typescript
import { ListaTareas } from './lista-tareas.js';

const lista = new ListaTareas();

console.log(`Agregar tarea 1: ${lista.agregar('Repasar tipos')}`);
console.log(`Agregar tarea 2: ${lista.agregar('Practicar funciones')}`);
console.log(`Agregar tarea 3: ${lista.agregar('Compilar el programa')}`);
console.log(`Agregar texto vacío: ${lista.agregar('   ')}`);
console.log(`Completar tarea 2: ${lista.completar(2)}`);
console.log(`Completar tarea 99: ${lista.completar(99)}`);

console.log('--- Todas las tareas ---');
lista.mostrar();

console.log('--- Tareas pendientes ---');
for (const linea of lista.pendientes()) {
  console.log(linea);
}

// Desestructuración de la tupla devuelta por el método.
const [total, pendientes] = lista.estadisticas();
const completadas = total - pendientes;
console.log(`Total: ${total} | Pendientes: ${pendientes} | Completadas: ${completadas}`);
```

Antes de ejecutar, responde:

1. ¿Qué valor devolverá intentar agregar una descripción formada solo por espacios?
2. ¿Cuántas tareas quedarán pendientes después de completar la tarea `2`?
3. ¿Qué ocurrirá al solicitar completar el ID `99`?
4. ¿Qué representan las dos posiciones de la tupla devuelta por `estadisticas`?

`const lista` impide reasignar esa variable, pero permite llamar métodos que modifican el estado del objeto. La desestructuración de la tupla asigna sus dos posiciones a `total` y `pendientes`.

<br/><br/>

### Paso 5. Compilar, ejecutar y comprobar

Desde la raíz de `hola-mundo`, ejecuta:

```powershell
npx.cmd --no-install tsc --project .\practica-3-2
if ($LASTEXITCODE -eq 0) {
    node .\practica-3-2\dist\main.js
}
```

`npx.cmd --no-install` utiliza el compilador local sin descargar otro paquete y evita depender de la política de ejecución de `npx.ps1` en PowerShell. Ejecuta siempre el programa desde `main.js`; los otros archivos son módulos que este utiliza.

**Salida esperada:**

```text
Agregar tarea 1: true
Agregar tarea 2: true
Agregar tarea 3: true
Agregar texto vacío: false
Completar tarea 2: true
Completar tarea 99: false
--- Todas las tareas ---
[ ] 1. Repasar tipos
[x] 2. Practicar funciones
[ ] 3. Compilar el programa
--- Tareas pendientes ---
[ ] 1. Repasar tipos
[ ] 3. Compilar el programa
Total: 3 | Pendientes: 2 | Completadas: 1
```

`[ ]` representa una tarea pendiente y `[x]` una completada. Completar una tarea modifica su estado; no la elimina de la lista.

<br/>

#### Comprobaciones de comprensión

1. Agrega temporalmente `lista.completar(1);` justo antes de mostrar todas las tareas. Compila y ejecuta: deben quedar **3 tareas, 1 pendiente y 2 completadas**. El listado de pendientes debe contener únicamente la tarea `3`.
2. Retira la llamada anterior para recuperar el resultado original.
3. Agrega temporalmente al final de `main.ts`:

```typescript
const otraLista = new ListaTareas();
otraLista.mostrar();
```

4. Compila y ejecuta: la segunda instancia debe mostrar `(sin tareas)`. Su colección es independiente de la primera.
5. Retira esas dos líneas y realiza la compilación y ejecución final con la salida original.

Si la compilación falla, corrige el error antes de ejecutar Node.js. `noEmitOnError` no elimina archivos generados por una compilación anterior; el bloque anterior evita ejecutarlos tras un fallo de compilación.

<br/><br/>

### Paso 6. Validar y entregar

- [ ] Los archivos `tarea.ts`, `lista-tareas.ts` y `main.ts` están guardados.
- [ ] Las clases se exportan y se importan correctamente.
- [ ] Se agregan tres tareas con identificadores `1`, `2` y `3`.
- [ ] Se rechaza la descripción formada solo por espacios.
- [ ] La tarea `2` aparece completada; las tareas `1` y `3`, pendientes.
- [ ] Completar el ID `99` devuelve `false` sin detener el programa.
- [ ] La tupla conserva el orden: total y pendientes.
- [ ] El resumen final indica **3 tareas, 2 pendientes y 1 completada**.
- [ ] Las modificaciones temporales fueron retiradas.
- [ ] La última compilación termina sin errores.


<br/><br/>

## Solución de problemas

| Situación | Acción |
| --- | --- |
| No se encuentra TypeScript o npx solicita otro paquete | Cancela y confirma que estás en la raíz de `hola-mundo` y que sus dependencias están instaladas. |
| TypeScript no encuentra un módulo | Comprueba el nombre del archivo, su `export` y la ruta relativa de `import`. |
| Node.js presenta un problema con los módulos | Confirma que `practica-3-2/package.json` contiene `"type": "module"` y que las importaciones usan `.js`. |
| No existe `dist/main.js` | Guarda los archivos y comprueba que la compilación finaliza correctamente. |
| La búsqueda no termina | Revisa el incremento `indice++` dentro de `while`. |
| El conteo difiere de la salida esperada | Retira las modificaciones temporales y revisa las llamadas de `main.ts`. |

<br/><br/>

## Tabla de conceptos y temas repasados

| Tema del capítulo | Aplicación en la práctica | Aprendizaje esperado |
| --- | --- | --- |
| **Compilación y ejecución** | `tsconfig.json`, `tsc --project` y `node .../main.js`. | Compilar los módulos y ejecutar el programa desde su punto de entrada. |
| **Comentarios** | Comentarios `//` y `/* ... */` en los archivos fuente. | Documentar la intención y las partes relevantes del programa. |
| **Variables, keywords y tipos** | `const`, `let`, `string`, `number`, `boolean`, `void`, `class`, `new` y `return`. | Distinguir referencias que no se reasignan, variables que cambian y tipos de datos y retornos. |
| **Asignaciones y operadores** | `=`, `++`, `===`, `!==`, `<`, `&&` y resta para calcular completadas. | Actualizar contadores, comparar valores y combinar condiciones. |
| **Estructuras de control** | `if` para validar, `switch` en `resumen`, `for` en `mostrar` y `while` en `completar`. | Elegir condiciones y ciclos según la operación; controlar el avance y la terminación. |
| **Funciones** | Métodos con parámetros y retornos tipados; funciones flecha en `filter` y `map`. | Organizar comportamiento y reconocer métodos que devuelven valores o `void`. |
| **Cadenas** | `trim`, `length` y plantillas con `${...}`. | Limpiar y validar descripciones y construir mensajes. |
| **Arreglos y tuplas** | `Tarea[]`, `string[]`, `push`, `filter`, `map` y retorno `[number, number]`. | Modificar y consultar colecciones y devolver dos cantidades con posiciones definidas. |
| **POO con enfoque en JavaScript** | `Tarea`, `ListaTareas`, constructores, `this`, métodos, `new` y campos `#`. | Crear objetos con estado y comportamiento y reconocer la independencia de las instancias. |
| **Módulos** | Tres archivos con `export` e `import`. | Separar responsabilidades y reutilizar clases y valores entre archivos. |
| **Enums** | `EstadoTarea.Pendiente` y `EstadoTarea.Completada`. | Representar los estados permitidos mediante valores con nombre. |
| **Desestructuración** | `{ id, descripcion } = this` y `[total, pendientes] = lista.estadisticas()`. | Extraer propiedades de objetos y posiciones de una tupla. |

<br/><br/>

## Bibliografía adicional y recursos de apoyo

1. **Clases en TypeScript — documentación oficial**  
   [https://www.typescriptlang.org/docs/handbook/2/classes.html](https://www.typescriptlang.org/docs/handbook/2/classes.html)  
   Referencia sobre propiedades, constructores, métodos y clases. Relaciónala con `Tarea` y `ListaTareas`.

2. **Módulos en TypeScript — documentación oficial**  
   [https://www.typescriptlang.org/docs/handbook/2/modules.html](https://www.typescriptlang.org/docs/handbook/2/modules.html)  
   Explica cómo compartir clases y valores mediante `export` e `import`.

3. **Enums — documentación oficial**  
   [https://www.typescriptlang.org/docs/handbook/enums.html](https://www.typescriptlang.org/docs/handbook/enums.html)  
   Describe las enumeraciones y sus valores de cadena, como los estados de esta práctica.

4. **Tuplas — documentación oficial**  
   [https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)  
   Explica cómo establecer la cantidad de elementos y los tipos de cada posición. Ayuda a interpretar el resultado de `estadisticas`.

5. **Bucles e iteración — MDN, en español**  
   [https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Loops_and_iteration](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Loops_and_iteration)  
   Consulta de `for`, `while` y `for...of`, aplicables también al programa TypeScript.

6. **Sentencia switch — MDN, en español**  
   [https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/switch](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/switch)  
   Explica la selección de un caso y el flujo de ejecución. En `resumen`, cada `return` termina el método y evita continuar a otro caso.

7. **TypeScript Playground — editor en línea**  
   [https://www.typescriptlang.org/play/](https://www.typescriptlang.org/play/)  
   Permite explorar TypeScript, consultar diagnósticos y observar el JavaScript generado. Para probar solo `Tarea`, puedes copiar el contenido de `tarea.ts`; para ejecutar la práctica completa conserva los tres módulos y el procedimiento con Node.js.

8. **Referencia TSConfig — documentación oficial**  
   [https://www.typescriptlang.org/tsconfig/](https://www.typescriptlang.org/tsconfig/)  
   Consulta de las opciones del compilador utilizadas en el ejercicio.
