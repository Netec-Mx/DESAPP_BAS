<img src="images/neteclogo (2).png" alt="logo" width="300"/>

# Angular Essentials

Este curso proporciona una base sólida para aquellos que deseen empezar a trabajar con Angular y desarrollar aplicaciones web interactivas y dinámicas.

<br/>
<br/>

## Lista de laboratorios

### Capítulo 1. Introducción a Ambientes Web (Angular, CSS, JavaScript)

#### [Práctica 1.1 Investigación sobre Angular](Capitulo01/README1_1.md)

Consulta fuentes oficiales para explicar qué es Angular 22 y ejemplificar tres de sus capacidades en un portal de capacitación. Documenta seis hitos de su evolución, desde AngularJS hasta Angular 22, y compara Angular, React y Vue según su alcance, sus convenciones, los conocimientos necesarios para comenzar y sus contextos de uso. Reúne tus hallazgos en una ficha de no más de dos páginas y justifica qué tres recursos consultarías durante el curso.
 
Duración estimada: 30 min

<br/>

#### [Práctica 1.2 Creación de un mapa conceptual de la arquitectura de Angular](Capitulo01/README1_2.md)

Elabora un mapa conceptual de una página que muestre cómo se relacionan los elementos principales de una aplicación Angular 22. Usa al menos doce conexiones etiquetadas para explicar cómo los componentes organizan la interfaz, cómo las plantillas presentan los datos, cómo se comparte funcionalidad mediante servicios y cómo el Router dirige la navegación. Aplica estas ideas a un portal de capacitación e incluye una nota sobre los componentes standalone.
 
Duración estimada: 30 min

<br/>
<br/>

### Capítulo 2. Entorno de desarrollo

#### [Práctica 2.1 Instalación del software para el desarrollo con Angular](Capitulo02/README2_1.md)

Prepara tu entorno de desarrollo en Windows para trabajar con Angular 22. Revisa qué herramientas ya están disponibles e instala las que falten. Comprueba desde PowerShell que Node.js 22 LTS, npm, Angular CLI 22 y Visual Studio Code responden a los comandos de verificación. Confirma también que la extensión Angular Language Service está instalada en el editor para contar con asistencia al trabajar con plantillas.

Duración estimada: 45 min

<br/>

#### [Práctica 2.2. Crea el proyecto Hola Mundo de Angular y verifica que funcione correctamente](Capitulo02/README2_2.md)
 
Crea el proyecto `hola-mundo` con Angular CLI como una aplicación standalone. Ábrelo en Visual Studio Code e identifica los archivos del componente raíz —la clase TypeScript, la plantilla HTML y los estilos CSS— y el archivo de configuración de la aplicación. Inicia el servidor de desarrollo con `ng serve --open` y comprueba que la aplicación inicial se muestra en el navegador.

Duración estimada: 55 min

<br/>

#### [Práctica 2.3. Personalización inicial](Capitulo02/README2_3.md)
 
Personaliza el componente raíz del proyecto `hola-mundo` en Angular 22. Define tu nombre como una propiedad en la clase TypeScript, muéstralo en la plantilla HTML mediante la interpolación `{{ nombre }}` y aplica estilos CSS a la página. Guarda los cambios y comprueba que el navegador se actualiza y muestra el encabezado «Hola Angular» junto con tu nombre.
  
Duración estimada: 45 min

<br/>
<br/>

### Capítulo 3. TypeScript Essentials (Enfocados en HTML, CSS, JavaScript)

#### [Práctica 3.1 Programación con TypeScript](Capitulo03/README.md#programación-con-typescript)
 
Escribe un programa en TypeScript que filtre a los participantes activos y muestre su nivel, su categoría de edad y el total de activos. Usa arreglos y funciones tipados, desestructuración y los métodos `filter` y `map`. Compila el programa a JavaScript, ejecútalo con Node.js y comprueba cómo el compilador detecta un error de tipos antes de corregirlo y volver a ejecutar el programa.

Duración estimada: 50 min

<br/>

#### [Práctica 3.2 Creacion de Lista de tareas](Capitulo03/README3_1.md)

Construye en TypeScript una lista de tareas que funcione en consola y mantenga sus datos en memoria. Usa clases y módulos para organizar el código, un `enum` para representar los estados y una tupla para devolver el total de tareas y la cantidad de pendientes. Compila y ejecuta el programa con Node.js para comprobar que puedes agregar tareas, rechazar descripciones vacías, marcar una tarea como completada y consultar las pendientes.

Duración estimada: 50 min

<br/>

#### [Práctica 3.3 CRUD en memoria](Capitulo03/README3_2.md)

Amplía la lista de tareas de la práctica anterior para completar las operaciones CRUD en TypeScript. Además de agregar y listar tareas, podrás consultarlas por su identificador, editar su descripción, marcarlas como completadas y eliminarlas. Compila el programa y ejecútalo con Node.js para comprobar que las operaciones manejan correctamente las descripciones vacías y los identificadores inexistentes, y que las tareas conservan su identificador aunque cambien de posición en el arreglo.

Duración estimada: 50 min

<br/>
<br/>

### Capítulo 4. Elementos Esenciales

#### [Práctica 4.1 Crear un componente simple que muestre el nombre de un usuario en la página web de la aplicación](Capitulo04/README4_1.md)

Genera con Angular CLI un componente standalone de usuario en el proyecto `hola-mundo`. Define la propiedad `nombre` en la clase TypeScript, muéstrala mediante interpolación en una tarjeta de perfil y dale estilo con CSS. Integra el componente en la vista raíz mediante el selector `<app-usuario>` y verifica que el navegador muestre tu nombre en la tarjeta, debajo del encabezado de la aplicación.

Duración estimada: 60 min

<br/>

#### [Práctica 4.2. Crear un componente que muestre los datos de una persona en una página web como son nombre, domicilio, teléfono y correo electrónico.](Capitulo04/README4_1.md)


Crea el proyecto `ficha-persona` en Angular 22 y genera un componente standalone para mostrar una ficha de contacto. Agrupa el nombre, el domicilio, el teléfono y el correo electrónico en un objeto TypeScript y presenta sus valores mediante interpolación en una tarjeta con estilos CSS. Integra la tarjeta en la vista raíz y, como minireto, agrega el campo de ocupación y comprueba que aparezca en el navegador.


Duración estimada: 55 min

<br/>
<br/>


### Capítulo 5. Componentes

#### [Práctica 5.1 Ciclo de vida de un componente en Angular](Capitulo05/README5_1.md)

Crea un componente standalone con un contador y usa tres hooks de Angular para observar su ciclo de vida. Inicia el contador en `ngOnInit`, confirma que la vista está disponible en `ngAfterViewInit` y cancela el intervalo en `ngOnDestroy`. Usa un botón y un bloque `@if` para retirar y volver a crear el componente. Verifica en la consola el orden de los hooks y comprueba que la nueva instancia inicia el contador desde cero.

Duración estimada: 60 min

<br/>
<br/>


### Capítulo 6. Decoradores

#### [Práctica 6.1. Decoradores @Input](Capitulo06/README6_1.md)

Crea el proyecto `decoradores` en Angular 22 y define una entrada requerida `nombre` con `@Input()` en el componente hijo `Usuario`. Desde el componente padre `App`, pasa el valor de `nombreUsuario` mediante `[nombre]="nombreUsuario"` y muéstralo en una tarjeta. Compara el resultado con el de un atributo de texto literal y comprueba qué error muestra Angular al omitir la entrada requerida.

Duración estimada: 60 min

<br/>

#### [Práctica 6.2. Comunicando un componente Hijo con su componente Padre utilizando @Output](Capitulo06/README6_2.md)

Amplía el proyecto `decoradores` para que el componente hijo `Usuario` emita su nombre al pulsar un botón. Declara el evento `seleccionado` con `@Output()` y `EventEmitter<string>`, y haz que el componente padre `App` reciba el nombre mediante `$event`. Prueba la comunicación con dos tarjetas y verifica que el mensaje en pantalla muestre el último usuario seleccionado.

Duración estimada: 60 min

<br/>
<br/>

### Capítulo 7. Templates

#### [Práctica 7.1 Pipe personalizado título](Capitulo07/README7_1.md)

Crea el proyecto `practica-pipes` en Angular 22 y prueba nueve pipes integrados para presentar textos, fechas, números, importes, porcentajes y objetos. Experimenta con parámetros y encadena pipes para combinar transformaciones en una misma expresión. Después, crea e integra el pipe standalone `resumen` y comprueba que acorta el texto mostrado según el límite indicado sin modificar el valor original.

Duración estimada: 60 min


#### [Práctica 7.2 Uso de @if y @for](Capitulo07/README7_2.md)

Construye un catálogo interactivo en Angular 22. Usa `@for` para mostrar una tarjeta por producto, `track producto.id` para identificar cada tarjeta y `@empty` para mostrar un mensaje cuando la lista esté vacía. Utiliza `@if` para mostrar u ocultar el catálogo y presentar la disponibilidad de cada producto según sus existencias. Por último, usa `@switch` para mostrar el estado del pedido y verifica en el navegador que cada acción actualice la vista correspondiente.

Duración estimada: 70 min

<br/>
<br/>

### Capítulo 8. Servicios y proveedores

#### [Práctica 8.1 Lista de tareas](Capitulo08/README8_1.md)

Construye una lista de tareas en Angular 22 con un formulario y un componente de listado que comparten `TaskService` mediante `inject()`. Usa señales para que la lista y los contadores se actualicen al agregar, completar o eliminar tareas. Compara la instancia compartida del servicio raíz con las instancias independientes de un servicio provisto por componente y localiza `TaskService` en el inyector raíz con Angular DevTools.

Duración estimada: 150 min

<br/>
<br/>

### Capítulo 9. Ruteos

#### [Práctica 9.1 Implementanto Ruteo](Capitulo09/README9_1.md)

Construye un catálogo de productos con componentes standalone y configura sus rutas con `provideRouter()`. Combina la navegación declarativa con `routerLink` y la navegación programática con `Router`. Usa parámetros de ruta para abrir el detalle de un producto y parámetros de consulta para sincronizar el filtro de búsqueda con la URL. Configura la carga diferida y comprueba en el navegador la redirección inicial, la página para rutas desconocidas y el comportamiento de las URL con y sin `#`.


Duración estimada: 150 min

<br/>
<br/>


### Capítulo 10. Módulos


#### [Práctica 10.1 Manejo de Módulos](Capitulo10/README10_1.md)

Integra componentes organizados con `NgModule` en una aplicación standalone de Angular 22. Declara y exporta un encabezado y una lista desde `LegacyModule`. Luego, importa el módulo y una tarjeta standalone en la misma página para mostrar los tres componentes juntos. Retira temporalmente una exportación y comprueba qué ocurre al usar ese componente desde fuera del módulo.

Duración estimada: 150 min

<br/>
<br/>

### Capítulo 11. Proyecto Final

#### [Proyecto Final](Capitulo11/README-SismoExplorer.md)

Desarrolla una aplicación en Angular 22 que consulte con `HttpClient` el servicio GeoJSON del USGS y muestre los sismos de magnitud 2.5 o superior registrados en los últimos siete días. Integra componentes standalone, Signals, pipes, Bootstrap y bloques de control de flujo para buscar por ubicación, filtrar por magnitud y actualizar el listado. Configura una ruta de detalle con acceso al registro original del USGS y comprueba que la interfaz responda correctamente durante la carga, ante un error y cuando no haya resultados.

Duración estimada: 175 min

<br/>
<br/>

---

<br/>
<br/>

### 📬 **Contacto y más información**

Si tienes alguna pregunta o necesitas más detalles, no dudes en [contactarnos](mailto:soporte@netec.com). También puedes encontrar más recursos en nuestra [página](https://netec.com).


<br/>
<br/>

---

<br/>
<br/>

¡Gracias por visitar nuestra plataforma! No olvides revisar todos los laboratorios y comenzar tu viaje de aprendizaje hoy mismo.

