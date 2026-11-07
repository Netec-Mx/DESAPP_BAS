# Práctica 3.3 CRUD en memoria 

<br/>
<br/>

## Objetivo

Completar una lista de tareas con las operaciones de creación, lectura, actualización y eliminación en memoria, utilizando identificadores, validaciones, clases, módulos y métodos de arreglos.

<br/>
<br/>

## Prerrequisitos

- Haber completado la práctica 3.2 Creación de lista de tareas.
- Conservar su carpeta `practica-3-2`, con `tarea.ts`, `lista-tareas.ts`, `main.ts`, `package.json` y `tsconfig.json`.
- Disponer del proyecto `hola-mundo` con sus dependencias instaladas.
- Tener Node.js 22 y Visual Studio Code disponibles.

<br/>
<br/>

## Alcance y continuidad

En la práctica 3.2 se agregaron tareas, se marcaron como completadas y se consultaron las pendientes. Aquí se conservan esas operaciones y se añaden `consultar`, `editar` y `eliminar`.

El programa se ejecuta en consola mediante llamadas escritas en `main.ts`. La colección existe únicamente durante la ejecución y cada inicio comienza con una lista vacía. No se requiere interfaz web, menú interactivo, servidor ni base de datos.

<br/>
<br/>

## Operaciones CRUD

| Operación | Acción sobre las tareas | Método |
| --- | --- | --- |
| **Create** | Crear una tarea pendiente con un identificador nuevo. | `agregar` |
| **Read** | Mostrar todas las tareas o consultar una por su ID. | `mostrar`, `consultar` |
| **Update** | Cambiar la descripción o marcar una tarea como completada. | `editar`, `completar` |
| **Delete** | Retirar una tarea identificada por su ID. | `eliminar` |

<br/>
<br/>

## Instrucciones

### Paso 1. Preparar la continuación del ejercicio

**Tiempo sugerido: 5 minutos**

Desde PowerShell, entra a `hola-mundo` y copia los archivos fuente y de configuración de la práctica anterior a una carpeta nueva:

```powershell
Set-Location "$env:USERPROFILE\angular-labs\hola-mundo"
New-Item -ItemType Directory -Path practica-3-3 -Force
Copy-Item .\practica-3-2\*.ts .\practica-3-3
Copy-Item .\practica-3-2\package.json .\practica-3-3
Copy-Item .\practica-3-2\tsconfig.json .\practica-3-3
code .
```

Si guardaste `hola-mundo` en otra ubicación, ajusta la primera ruta. Si utilizas el paquete de archivos entregado con esta práctica, puedes copiar directamente su carpeta `practica-3-3` dentro de `hola-mundo`.

Los archivos conservan estas responsabilidades:

| Archivo | Responsabilidad |
| --- | --- |
| `tarea.ts` | Define `EstadoTarea` y la clase `Tarea`; se reutiliza sin cambios. |
| `lista-tareas.ts` | Administra la colección e incorpora consulta, edición y eliminación. |
| `main.ts` | Ejecuta y demuestra las cuatro operaciones del CRUD. |
| `package.json` | Mantiene `"type": "module"` para ejecutar módulos ES. |
| `tsconfig.json` | Conserva la compilación estricta y la salida en `dist`. |

<br/>

La configuración copiada utiliza `target: "ES2022"`, `module: "NodeNext"`, `strict: true`, `noEmitOnError: true`, `types: []`, `rootDir: "."`, `outDir: "./dist"` e incluye los archivos `*.ts` de esta carpeta. No requiere instalar dependencias dentro de `practica-3-3`; se reutiliza el compilador local de `hola-mundo`.

Trabaja en `practica-3-3` para conservar el resultado de la práctica anterior.

<br/><br/>

### Paso 2. Completar la clase de lista

**Tiempo sugerido: 12 minutos**

Sustituye el contenido de **`practica-3-3/lista-tareas.ts`** por este código completo. Los métodos de la práctica anterior se conservan; los nuevos son `consultar`, `editar` y `eliminar`:

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

  // READ: devuelve una descripción o undefined si el ID no existe.
  consultar(id: number): string | undefined {
    const tarea = this.#tareas.find((elemento) => elemento.id === id);
    if (tarea === undefined) {
      return undefined;
    }
    return tarea.resumen();
  }

  // UPDATE: valida antes de cambiar la descripción.
  editar(id: number, descripcion: string): boolean {
    const texto = descripcion.trim();
    if (texto.length === 0) {
      return false;
    }

    const tarea = this.#tareas.find((elemento) => elemento.id === id);
    if (tarea === undefined) {
      return false;
    }
    tarea.descripcion = texto;
    return true;
  }

  /* DELETE: localiza el índice y retira una sola tarea.
     El ID y el índice del arreglo no son lo mismo. */
  eliminar(id: number): boolean {
    const indice = this.#tareas.findIndex((tarea) => tarea.id === id);
    if (indice === -1) {
      return false; // No ejecutar splice(-1, 1): quitaría la última tarea.
    }
    this.#tareas.splice(indice, 1);
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

#### Identifica las operaciones nuevas

- **`consultar`:** `find` busca la tarea por su identificador. El método devuelve su descripción formateada o `undefined` si no existe. Devuelve texto para que la consulta no exponga los objetos internos de la colección.
- **`editar`:** valida la descripción antes de modificarla. Rechaza texto vacío o formado solo por espacios y devuelve `false` si el ID no existe. Cambia la descripción y conserva el identificador y el estado.
- **`eliminar`:** `findIndex` obtiene la posición de la tarea. Si devuelve `-1`, la operación termina sin modificar la lista. Si encuentra un índice válido, `splice(indice, 1)` retira exactamente un elemento.

<br/>

**Importante:** `find` devuelve un elemento o `undefined`; `findIndex` devuelve un índice o `-1`. No son resultados intercambiables. Usar `splice(-1, 1)` eliminaría el último elemento, por eso se comprueba el índice antes de eliminar.

El contador `#siguienteId` no se reduce al eliminar. Si se crean las tareas `1`, `2` y `3`, se elimina la `1` y se agrega otra, su nuevo ID será `4`. Los IDs restantes no se renumeran aunque cambien las posiciones del arreglo.

<br/><br/>

### Paso 3. Crear el programa principal

**Tiempo sugerido: 6 minutos**

Sustituye el contenido de **`practica-3-3/main.ts`** por:

```typescript
import { ListaTareas } from './lista-tareas.js';

// La función distingue una consulta sin resultado de una tarea encontrada.
function mostrarConsulta(lista: ListaTareas, id: number): void {
  const resultado = lista.consultar(id);
  if (resultado === undefined) {
    console.log(`Consulta ${id}: no encontrada`);
  } else {
    console.log(`Consulta ${id}: ${resultado}`);
  }
}

const lista = new ListaTareas();

console.log('--- CREATE: agregar ---');
console.log(`Agregar tarea 1: ${lista.agregar('Repasar tipos')}`);
console.log(`Agregar tarea 2: ${lista.agregar('Practicar funciones')}`);
console.log(`Agregar tarea 3: ${lista.agregar('Compilar el programa')}`);
console.log(`Agregar texto vacío: ${lista.agregar('   ')}`);

console.log('--- READ: consultar ---');
lista.mostrar();
mostrarConsulta(lista, 2);

console.log('--- UPDATE: editar y completar ---');
console.log(`Editar tarea 2: ${lista.editar(2, 'Practicar funciones y arreglos')}`);
console.log(`Completar tarea 2: ${lista.completar(2)}`);
mostrarConsulta(lista, 2);

console.log('--- DELETE: eliminar ---');
console.log(`Eliminar tarea 1: ${lista.eliminar(1)}`);
mostrarConsulta(lista, 1);

// El contador sigue avanzando: la siguiente tarea recibe el ID 4.
console.log(`Agregar después de eliminar: ${lista.agregar('Revisar módulos')}`);

console.log('--- Comprobar operaciones inválidas ---');
mostrarConsulta(lista, 99);
console.log(`Editar tarea 99: ${lista.editar(99, 'No existe')}`);
console.log(`Editar con texto vacío: ${lista.editar(2, '   ')}`);
console.log(`Eliminar tarea 99: ${lista.eliminar(99)}`);
console.log(`Eliminar nuevamente tarea 1: ${lista.eliminar(1)}`);
console.log(`Completar tarea 99: ${lista.completar(99)}`);

console.log('--- Estado final ---');
lista.mostrar();
console.log('--- Tareas pendientes ---');
for (const linea of lista.pendientes()) {
  console.log(linea);
}

const [total, pendientes] = lista.estadisticas();
const completadas = total - pendientes;
console.log(`Total: ${total} | Pendientes: ${pendientes} | Completadas: ${completadas}`);
```

<br/>

Antes de ejecutar, responde:

1. ¿Qué diferencia hay entre editar una tarea y eliminarla?
2. ¿Qué devolverá consultar la tarea `1` después de eliminarla?
3. ¿Qué identificador recibirá la tarea agregada después de la eliminación?
4. ¿Por qué eliminar el ID `99` no debe afectar a la última tarea?
5. ¿Qué tareas aparecerán al final y cuál estará completada?

`mostrarConsulta` comprueba `undefined` antes de mostrar el resultado. La condición permite distinguir una tarea encontrada de una consulta sin coincidencia. `false` en las operaciones de modificación significa que no se realizó el cambio solicitado.

<br/><br/>

### Paso 4. Compilar, ejecutar y comprobar

**Tiempo sugerido: 9 minutos**

Desde la raíz de `hola-mundo`, ejecuta:

```powershell
npx.cmd --no-install tsc --project .\practica-3-3
if ($LASTEXITCODE -eq 0) {
    node .\practica-3-3\dist\main.js
}
```

Se utiliza la versión local de TypeScript sin descargar otro paquete. Ejecuta el programa desde `main.js`, que importa los otros módulos.

**Salida esperada:**

```text
--- CREATE: agregar ---
Agregar tarea 1: true
Agregar tarea 2: true
Agregar tarea 3: true
Agregar texto vacío: false
--- READ: consultar ---
[ ] 1. Repasar tipos
[ ] 2. Practicar funciones
[ ] 3. Compilar el programa
Consulta 2: [ ] 2. Practicar funciones
--- UPDATE: editar y completar ---
Editar tarea 2: true
Completar tarea 2: true
Consulta 2: [x] 2. Practicar funciones y arreglos
--- DELETE: eliminar ---
Eliminar tarea 1: true
Consulta 1: no encontrada
Agregar después de eliminar: true
--- Comprobar operaciones inválidas ---
Consulta 99: no encontrada
Editar tarea 99: false
Editar con texto vacío: false
Eliminar tarea 99: false
Eliminar nuevamente tarea 1: false
Completar tarea 99: false
--- Estado final ---
[x] 2. Practicar funciones y arreglos
[ ] 3. Compilar el programa
[ ] 4. Revisar módulos
--- Tareas pendientes ---
[ ] 3. Compilar el programa
[ ] 4. Revisar módulos
Total: 3 | Pendientes: 2 | Completadas: 1
```

El estado final contiene las tareas **2, 3 y 4**. La tarea **2** conserva su nueva descripción y está completada; las tareas **3 y 4** están pendientes. La tarea **1** ya no existe.

<br/>

#### Comprobaciones de comprensión

1. Localiza en la salida una evidencia de cada operación CRUD.
2. Explica por qué las operaciones inválidas producen `false` o una consulta sin resultado, sin modificar la colección.
3. Agrega temporalmente estas líneas al final de `main.ts`:

```typescript
console.log(`Eliminar tarea 2: ${lista.eliminar(2)}`);
lista.mostrar();
const [nuevoTotal, nuevasPendientes] = lista.estadisticas();
console.log(`Nuevo total: ${nuevoTotal} | Nuevas pendientes: ${nuevasPendientes}`);
```

4. Compila y ejecuta. Deben quedar solo las tareas `3` y `4`, ambas pendientes. La última línea debe indicar **`Nuevo total: 2 | Nuevas pendientes: 2`**.
5. Retira el bloque temporal y vuelve a compilar y ejecutar para recuperar la salida original.
6. Ejecuta nuevamente el programa sin cambiar el código: volverá a comenzar con una lista vacía y repetirá la misma secuencia. Los datos de la ejecución anterior no se conservan.

Si la compilación falla, corrige el error antes de ejecutar Node.js. `noEmitOnError` impide generar una nueva salida con errores, pero no elimina el JavaScript de una compilación anterior. El bloque de PowerShell evita ejecutarlo tras un fallo de compilación.

<br/><br/>

### Paso 5. Validar y entregar

**Tiempo sugerido: 3 minutos**

- [ ] Se conservan las clases, el enum y los módulos de la práctica 3.2.
- [ ] CREATE crea tareas con IDs consecutivos y rechaza texto vacío.
- [ ] READ muestra las tareas y consulta una por su ID.
- [ ] UPDATE cambia la descripción de la tarea `2` y la marca como completada.
- [ ] DELETE elimina la tarea `1` sin renumerar las restantes.
- [ ] La tarea agregada después de eliminar recibe el ID `4`.
- [ ] Consultar un ID inexistente devuelve `undefined` y se presenta un mensaje claro.
- [ ] Editar con texto vacío o usar IDs inexistentes no altera los datos.
- [ ] El estado final conserva los IDs `2`, `3` y `4`, con **3 tareas, 2 pendientes y 1 completada**.
- [ ] Las modificaciones temporales fueron retiradas.
- [ ] La última compilación finaliza sin errores y la salida coincide con la esperada.

<br/><br/>

## Solución de problemas

| Situación | Acción |
| --- | --- |
| No existe `practica-3-2` | Confirma la ubicación de la práctica anterior o utiliza la carpeta completa entregada para 3.3. |
| TypeScript indica que no existe `consultar`, `editar` o `eliminar` | Comprueba que sustituiste `lista-tareas.ts` dentro de `practica-3-3` y que guardaste los archivos. |
| No se encuentra `tarea.js` o `lista-tareas.js` | Comprueba que los `.ts` correspondientes existen, que sus importaciones usan `.js` y que la compilación termina correctamente. |
| Node.js presenta un problema con los módulos | Verifica que el `package.json` de la práctica conserva `"type": "module"`. |
| Se elimina una tarea diferente | Revisa la comprobación de `indice === -1` y distingue el ID del índice del arreglo. |
| El resultado final tiene otras cantidades | Retira el bloque temporal de comprobación y revisa la secuencia de llamadas en `main.ts`. |
| Los datos desaparecen al volver a ejecutar | Es el comportamiento esperado del almacenamiento en memoria. |

<br/><br/>

## Tabla de conceptos y temas repasados

| Tema o concepto | Aplicación en la práctica | Aprendizaje esperado |
| --- | --- | --- |
| **CRUD en memoria** | `agregar`, `mostrar`, `consultar`, `editar`, `completar` y `eliminar`. | Relacionar cada operación con su efecto sobre una colección de objetos. |
| **Compilación y ejecución** | `tsc --project`, módulos generados en `dist` y ejecución de `main.js`. | Compilar la práctica y ejecutar su punto de entrada. |
| **Comentarios** | Comentarios `//` y `/* ... */` en los archivos fuente. | Documentar la intención y los cuidados de las operaciones. |
| **Variables, keywords y tipos** | `const`, `let`, `string`, `number`, `boolean`, `void`, `undefined` y retorno unión de `consultar`. | Distinguir datos, resultados de operaciones y ausencia de una coincidencia. |
| **Asignaciones y operadores** | `=`, `++`, `===`, `!==`, `<`, `&&` y resta de cantidades. | Actualizar propiedades y contadores y evaluar condiciones. |
| **Estructuras de control** | `if/else` en la presentación de consultas, `for` y `while` en `ListaTareas`, y `switch` reutilizado en `Tarea.resumen`. | Controlar validaciones, búsquedas, recorridos y representación de estados. |
| **Funciones** | Métodos tipados, funciones flecha y `mostrarConsulta`. | Encapsular acciones y comprobar los resultados devueltos. |
| **Cadenas** | `trim`, `length` y plantillas con `${...}`. | Validar descripciones y construir mensajes de consulta y ejecución. |
| **Arreglos y tuplas** | `Tarea[]`, `push`, `find`, `findIndex`, `splice`, `filter`, `map` y retorno `[number, number]`. | Crear, buscar, modificar, eliminar y contar elementos. |
| **POO con enfoque en JavaScript** | Clases `Tarea` y `ListaTareas`, constructores, `new`, `this`, métodos y campos privados `#`. | Administrar objetos con estado y comportamiento mediante sus operaciones. |
| **Módulos** | `export` e `import` entre tres archivos. | Reutilizar el modelo y organizar el programa por responsabilidades. |
| **Enums** | `EstadoTarea.Pendiente` y `EstadoTarea.Completada`. | Mantener estados definidos al editar o completar tareas. |
| **Desestructuración** | Propiedades en `Tarea.resumen` y tupla de `estadisticas`. | Extraer datos de objetos y posiciones de una tupla. |
| **Identificadores e índices** | Buscar por ID y eliminar por el índice encontrado. | Conservar la identidad de las tareas aunque cambien sus posiciones. |
| **Validación de resultados** | Comprobar `undefined`, `false` e índice `-1` antes de continuar. | Atender operaciones sin coincidencias y evitar cambios incorrectos. |
 

<br/><br/>

## Bibliografía adicional y recursos de apoyo

1. **Búsqueda de elementos: Array.find — MDN**  
   [https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/find](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/find)  
   Consulta del método usado para localizar una tarea y del resultado `undefined` cuando no existe una coincidencia.

2. **Búsqueda de posiciones: Array.findIndex — MDN**  
   [https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)  
   Explica la obtención de un índice y el valor `-1` cuando no se encuentra un elemento.

3. **Eliminación de elementos: Array.splice — MDN**  
   [https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/splice](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)  
   Describe la modificación del arreglo y el significado del índice inicial y la cantidad de elementos que se eliminan.

4. **Comprobaciones y reducción de tipos: Narrowing — TypeScript**  
   [https://www.typescriptlang.org/docs/handbook/2/narrowing.html](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)  
   Explica cómo las condiciones permiten precisar el tipo de un valor antes de utilizarlo, como al comprobar `undefined`.

5. **Clases — documentación oficial de TypeScript**  
   [https://www.typescriptlang.org/docs/handbook/2/classes.html](https://www.typescriptlang.org/docs/handbook/2/classes.html)  
   Referencia de propiedades, constructores y métodos para repasar las clases del ejercicio.

6. **Módulos — documentación oficial de TypeScript**  
   [https://www.typescriptlang.org/docs/handbook/2/modules.html](https://www.typescriptlang.org/docs/handbook/2/modules.html)  
   Referencia sobre importaciones y exportaciones utilizadas por los tres archivos fuente.

7. **TypeScript Playground — editor en línea**  
   [https://www.typescriptlang.org/play/](https://www.typescriptlang.org/play/)  
   Permite explorar tipos, diagnósticos y JavaScript generado. Para ejecutar el CRUD completo de esta práctica, conserva la organización de módulos y utiliza el procedimiento con Node.js.
