# Práctica 1.2 Creación de un mapa conceptual de la arquitectura de Angular

<br/>

## Objetivo

Representar los elementos principales de la arquitectura de una aplicación Angular y explicar sus relaciones mediante un mapa conceptual, para distinguir la presentación, el comportamiento de la interfaz, la funcionalidad compartida y la navegación.

**Versión de referencia: Angular 22.**

Esta es una actividad introductoria. Reconocerás las responsabilidades y relaciones de los elementos; no necesitas instalar software de desarrollo, crear un proyecto ni escribir código Angular.

<br/>

## Recursos

- Material del capítulo 1 y hallazgos de la práctica 1.1.
- Navegador web.
- Una herramienta que ya sepas utilizar para crear figuras y conectores: PowerPoint, Word, diagrams.net o equivalente. También puedes elaborar el mapa a mano y entregar una fotografía legible.
- Documentación oficial indicada en el paso 1.


<br/>
<br/>

## Entregable

Entrega **un mapa conceptual de una página**, preferentemente horizontal, en PDF o PNG:

```text
Lab01_2_Mapa_Arquitectura_Angular_Apellido_Nombre.pdf
```

Si eliges PNG, conserva el mismo nombre base. Si trabajas a mano, puedes entregar una fotografía en JPG con ese mismo nombre base.

Incluye título, nombre, versión de referencia, fuentes y fecha de consulta en el mismo archivo. Conserva el archivo editable, si lo utilizaste, para futuras consultas; no es una entrega adicional.

<br/>
<br/>

## ¿Qué debe mostrar un mapa conceptual?

Un mapa conceptual representa **conceptos conectados mediante relaciones que pueden leerse como frases**.

- Cada nodo contiene un concepto breve.
- Cada conexión incluye una palabra o frase que explica la relación.
- La dirección de las flechas permite interpretar la frase.

Por ejemplo, una relación válida sería: **«Componente — utiliza una → plantilla HTML»**.

Conectar conceptos mediante líneas sin etiquetas no explica qué relación existe entre ellos. Tu trabajo debe mostrar cómo colaboran las partes de la aplicación.

<br/>
<br/>

### Paso 1. Reconocer los conceptos

Revisa los conceptos de la siguiente tabla utilizando el material del capítulo y estas fuentes. Consulta solamente las introducciones necesarias para responder las preguntas; no leas las guías completas.

| Fuente oficial | Qué debes localizar |
|---|---|
| [Descripción general de Angular](https://angular.dev/overview) | Papel de componentes, servicios, navegación y otras capacidades. |
| [Anatomía de un componente](https://angular.dev/guide/components) | Relación entre clase TypeScript, plantilla HTML y estilos. |
| [Binding en plantillas](https://angular.dev/guide/templates/binding) | Conexión entre los datos del componente y su presentación. |
| [Inyección de dependencias](https://angular.dev/guide/di) | Cómo recibe una clase las dependencias que necesita. |
| [Navegación con Angular Router](https://angular.dev/guide/routing) | Relación entre rutas, navegación y componentes mostrados. |

> Comprueba que estás consultando Angular 22. Si la documentación principal muestra una versión posterior, utiliza el selector de versiones del sitio.

El concepto principal será **Aplicación Angular**. Incorpora estos diez conceptos relacionados:

| Concepto | Pregunta que debes poder responder |
|---|---|
| Componentes | ¿Cómo se organiza la interfaz en partes con responsabilidades definidas? |
| Clase TypeScript | ¿Dónde se definen los datos y el comportamiento del componente? |
| Plantilla HTML | ¿Cómo se describe lo que presenta el componente? |
| Estilos CSS | ¿Cómo se define la apariencia de los elementos? |
| Enlace de datos o data binding | ¿Cómo se conectan los datos del componente con su plantilla? |
| Directivas | ¿Cómo se agrega comportamiento a elementos de la plantilla? |
| Pipes | ¿Cómo se transforman valores para presentarlos en la plantilla? |
| Servicios | ¿Dónde puede organizarse funcionalidad que utilizan varios componentes? |
| Inyección de dependencias | ¿Cómo recibe un componente un servicio que necesita? |
| Router | ¿Cómo se determina qué componente mostrar según la ruta? |

No necesitas redactar un glosario: utiliza estas preguntas para decidir cómo conectar los conceptos.

<br/>

### Resultado esperado

Reconoces los once conceptos del mapa, incluido el concepto principal, y puedes proponer relaciones entre ellos.

<br/>
<br/>


### Aclaración sobre standalone y NgModules

En Angular moderno, los componentes standalone permiten utilizar otros componentes, directivas y pipes mediante sus importaciones. Un NgModule no es un requisito universal para organizar una aplicación. Angular también permite trabajar con NgModules, y su documentación recomienda standalone para código nuevo.

Agrega junto al mapa una nota breve: **«Referencia: Angular 22; los componentes standalone no requieren declararse en un NgModule»**.

Esta aclaración evita presentar los módulos como obligatorios. No necesitas desarrollar sus metadatos ni representar ambas formas de organización. Puedes consultar la [introducción oficial a NgModules](https://angular.dev/guide/ngmodules/overview) si necesitas aclarar la diferencia.

<br/>

### Resultado esperado

Un borrador ordenado que muestra las partes de la aplicación y permite leer sus relaciones.

<br/>
<br/>

### Paso 2. Construir y relacionar

1. Conecta los conceptos mediante flechas con etiquetas breves: «utiliza», «define», «recibe mediante», «transforma» u otras que expresen la relación con precisión.
2. Incluye **al menos doce relaciones etiquetadas**. Todos los conceptos deben quedar conectados.
3. Incluye al menos dos relaciones entre grupos distintos. Por ejemplo, considera qué relación tiene un componente con un servicio y qué relación tiene el Router con los componentes. Estas conexiones cuentan dentro de las doce solicitadas.
4. Representa que un componente puede componer su interfaz utilizando otros componentes. Puedes mostrarlo mediante una relación del nodo Componentes consigo mismo o mediante un nodo adicional.
5. Agrega una anotación de dos o tres líneas que aplique tres conceptos del mapa a un **portal de capacitación**.

En esa anotación identifica una parte de la interfaz, una funcionalidad compartida y una necesidad de navegación. Utiliza ejemplos propios y relaciónalos con los conceptos correspondientes. La anotación no necesita convertirse en nodos adicionales.

<br/>

### Cuida la precisión de las relaciones

- Distingue la clase, la plantilla y los estilos del componente.
- Presenta los estilos como un recurso que puede utilizar el componente, no como un archivo CSS separado obligatorio.
- Explica la relación entre un servicio y la inyección de dependencias sin confundirlos con el componente.
- Evita representar todos los enlaces de datos como obligatoriamente bidireccionales.
- Si mencionas `@if` o `@for`, identifícalos como bloques de control de flujo de las plantillas; no los etiquetes como directivas.

Para aclarar los dos conceptos de transformación y comportamiento, puedes consultar las introducciones de [pipes](https://angular.dev/guide/templates/pipes) y [directivas](https://angular.dev/guide/directives).

<br/>

### Resultado esperado

Un mapa con once a catorce nodos, al menos doce relaciones etiquetadas y una aplicación breve al portal de capacitación.

<br/>
<br/>

### Paso 3. Revisar y corregir

Lee en voz baja cada conexión como una frase completa. Si la frase no explica una relación válida, cambia la etiqueta, la dirección o los conceptos conectados.

Verifica:

- [ ] El concepto principal es Aplicación Angular.
- [ ] Incluí los diez conceptos relacionados y ninguno quedó aislado.
- [ ] Representé la composición de componentes.
- [ ] Incluí al menos doce relaciones con etiquetas legibles.
- [ ] Al menos dos relaciones conectan grupos diferentes.
- [ ] Distinguí presentación, comportamiento, funcionalidad compartida y navegación.
- [ ] Incorporé el ejemplo del portal y la aclaración sobre standalone.
- [ ] El mapa se entiende sin depender únicamente de colores.
- [ ] Incluí mi nombre, Angular 22, las fuentes utilizadas y la fecha de consulta.
- [ ] Todo se ve en una página sin reducir excesivamente el tamaño del texto.

Registra únicamente las fuentes que utilizaste, mediante títulos breves con enlaces en PDF o direcciones legibles si entregas una imagen.

<br/>

### Resultado esperado

Un mapa legible y corregido, con relaciones que puedes explicar con tus propias palabras.

<br/>
<br/>

### Paso 4. Explicar y entregar

1. Explica tu mapa a un compañero durante un minuto; después escucha su explicación durante otro minuto.
2. Cada uno señalará una relación que necesite aclaración. Si ambas explicaciones son correctas, identifiquen una relación especialmente útil y expliquen por qué.
3. Utilicen los dos minutos restantes para ajustar y exportar sus mapas.
4. Entrega el archivo con el nombre indicado.

Durante tu explicación, responde:

- ¿Qué relación existe entre un componente, su plantilla y sus estilos?
- ¿Para qué utiliza un componente un servicio y cómo lo recibe?
- ¿Cómo participa el Router en la navegación?

Si no hay un compañero disponible, explica estas relaciones al instructor o realiza una autoexplicación. No se requiere grabación.

<br/>

### Resultado esperado

Un mapa entregado que su autor puede interpretar y explicar.

<br/>
<br/>

## Si una fuente o herramienta no está disponible

Utiliza el material del capítulo o una fuente oficial alternativa y registra la que consultaste. Si la herramienta de diagramación falla, trabaja en una hoja y entrega una fotografía legible. Consulta con el instructor las relaciones que no puedas verificar.
