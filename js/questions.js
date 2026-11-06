/**
 * Base de Preguntas de Programación para FUMIGADOR
 * Estructurado en 3 Niveles del Modo Historia:
 * - Nivel 1: HTML (Dificultad Fácil)
 * - Nivel 2: CSS (Dificultad Media)
 * - Nivel 3: Python (Dificultad Avanzada)
 */
const PROGRAMMING_QUESTIONS = [
    // =========================================================================
    // NIVEL 1: HTML - DIFICULTAD FÁCIL
    // =========================================================================
    {
        id: "html-f1",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Cuál es la etiqueta semántica correcta para definir el contenido principal de un documento HTML?",
        code: `<!-- Estructura básica de una página -->\n<header>...</header>\n<nav>...</nav>\n<???> Contenido principal que no se repite </???>\n<footer>...</footer>`,
        options: [
            "<section>",
            "<main>",
            "<body>",
            "<article>"
        ],
        correct: 1,
        explanation: "<main> representa el contenido dominante y único del <body> de un documento HTML."
    },
    {
        id: "html-f2",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Qué atributo se utiliza en la etiqueta <a> para abrir un enlace en una pestaña nueva?",
        code: `<a href="https://servidor-seguro.com" ???="_blank">\n    Acceder a Firewall\n</a>`,
        options: [
            'window="new"',
            'target="_blank"',
            'rel="external"',
            'open="tab"'
        ],
        correct: 1,
        explanation: 'El atributo target="_blank" indica al navegador que abra el enlace en una nueva pestaña o ventana.'
    },
    {
        id: "html-f3",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Qué etiqueta HTML se utiliza para insertar una imagen en una página web?",
        code: `<!-- Insertar escudo antivirus -->\n<??? src="escudo.png" alt="Escudo de protección">`,
        options: [
            "<picture-box>",
            "<img>",
            "<image>",
            "<src>"
        ],
        correct: 1,
        explanation: "La etiqueta <img> es el estándar en HTML para incrustar imágenes en un documento."
    },
    {
        id: "html-f4",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Qué elemento HTML se usa para crear una lista ordenada con números?",
        code: `<???>\n    <li>Paso 1: Detectar bicho</li>\n    <li>Paso 2: Rociar spray</li>\n</???>`,
        options: [
            "<ul>",
            "<ol>",
            "<dl>",
            "<list>"
        ],
        correct: 1,
        explanation: "<ol> (Ordered List) genera una lista numerada, mientras que <ul> crea listas con viñetas sin orden numérico."
    },
    {
        id: "html-f5",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Cuál de los siguientes es el encabezado de mayor jerarquía e importancia en HTML?",
        code: `<???>FUMIGADOR: SISTEMA DE DEFENSA</???>`,
        options: [
            "<h6>",
            "<header>",
            "<h1>",
            "<title>"
        ],
        correct: 2,
        explanation: "<h1> representa el nivel superior de encabezado jerárquico en una página web."
    },
    {
        id: "html-f6",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Qué etiqueta define un párrafo de texto en HTML?",
        code: `<???>El fumigador está listo para rociar a los bichos rojos.</???>`,
        options: [
            "<para>",
            "<p>",
            "<text>",
            "<span>"
        ],
        correct: 1,
        explanation: "<p> es la etiqueta estándar para definir párrafos de texto en documentos HTML."
    },
    {
        id: "html-f7",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Qué atributo 'type' en la etiqueta <input> crea un botón donde marcar casillas de selección múltiple?",
        code: `<input type="???" name="antivirus_activo" checked>`,
        options: [
            'type="radio"',
            'type="checkbox"',
            'type="select"',
            'type="box"'
        ],
        correct: 1,
        explanation: 'type="checkbox" crea una casilla de verificación que permite selecciones independientes.'
    },
    {
        id: "html-f8",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Qué declaración debe colocarse en la primera línea de un documento HTML5 para indicar el tipo de documento?",
        code: `<???>\n<html lang="es">\n<head>...</head>`,
        options: [
            "<!DOCTYPE html>",
            "<xml version='1.0'>",
            "<doctype type='html5'>",
            "<html doctype='standard'>"
        ],
        correct: 0,
        explanation: "<!DOCTYPE html> es la declaración estándar en HTML5 que activa el modo estándar en todos los navegadores modernos."
    },
    {
        id: "html-f9",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Qué atributo en la etiqueta <form> define hacia qué URL se enviarán los datos del formulario?",
        code: `<form ???="/api/login" method="POST">\n    <input type="text" name="usuario">\n</form>`,
        options: [
            'target',
            'href',
            'action',
            'route'
        ],
        correct: 2,
        explanation: "El atributo 'action' especifica la URL de destino del servidor que procesará la información enviada por el formulario."
    },
    {
        id: "html-f10",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Cuál es la etiqueta semántica adecuada para agrupar los enlaces principales de navegación?",
        code: `<???>\n    <a href="#inicio">Inicio</a>\n    <a href="#firewall">Firewall</a>\n</???>`,
        options: [
            "<menu-bar>",
            "<nav>",
            "<links>",
            "<navigate>"
        ],
        correct: 1,
        explanation: "<nav> es la etiqueta semántica de HTML5 diseñada expresamente para bloques con enlaces principales de navegación."
    },
    {
        id: "html-f11",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Qué etiqueta HTML se utiliza para representar una celda de datos estándar dentro de una tabla (<table>)?",
        code: `<tr>\n    <th>Servidor</th>\n    <???>192.168.1.100</???>\n</tr>`,
        options: [
            "<cell>",
            "<td>",
            "<data>",
            "<col>"
        ],
        correct: 1,
        explanation: "<td> (Table Data) define una celda de datos estándar dentro de una fila <tr> en una tabla HTML."
    },
    {
        id: "html-f12",
        category: "HTML",
        difficulty: "Fácil",
        question: "¿Qué tipo de entrada de texto oculta los caracteres con asteriscos o puntos para proteger contraseñas?",
        code: `<input type="???" name="clave_acceso" required>`,
        options: [
            'type="hidden"',
            'type="secure"',
            'type="password"',
            'type="mask"'
        ],
        correct: 2,
        explanation: 'type="password" enmascara los caracteres ingresados para mantener la confidencialidad de claves secretas.'
    },

    // =========================================================================
    // NIVEL 2: CSS - DIFICULTAD MEDIA
    // =========================================================================
    {
        id: "css-m1",
        category: "CSS",
        difficulty: "Media",
        question: "¿Cuál selector de CSS tiene la mayor especificidad?",
        code: `/* Diferentes selectores compitiendo */\n#firewall-core { color: red; }\n.seguridad { color: green; }\ndiv.seguridad { color: blue; }\np { color: yellow; }`,
        options: [
            "#firewall-core (Selector de ID)",
            ".seguridad (Selector de Clase)",
            "div.seguridad (Elemento + Clase)",
            "p (Selector de Etiqueta)"
        ],
        correct: 0,
        explanation: "Los selectores de ID (#id) tienen un peso de especificidad mayor (0-1-0-0) que clases (0-0-1-0) o etiquetas (0-0-0-1)."
    },
    {
        id: "css-m2",
        category: "CSS",
        difficulty: "Media",
        question: "¿Qué valor de la propiedad 'position' mantiene un elemento fijo respecto a la ventana del navegador incluso al hacer scroll?",
        code: `.alerta-hacker {\n    position: ???;\n    top: 10px;\n    right: 10px;\n    z-index: 9999;\n}`,
        options: [
            "absolute",
            "relative",
            "fixed",
            "static"
        ],
        correct: 2,
        explanation: "'position: fixed' fija el elemento respecto al viewport, manteniéndolo inmóvil durante el desplazamiento."
    },
    {
        id: "css-m3",
        category: "CSS",
        difficulty: "Media",
        question: "¿Cómo se define y consume correctamente una variable personalizada (Custom Property) en CSS?",
        code: `:root {\n    --neon-green: #00ff88;\n}\n.spray-particula {\n    background-color: ???;\n}`,
        options: [
            "var(--neon-green)",
            "$neon-green",
            "val(--neon-green)",
            "get(--neon-green)"
        ],
        correct: 0,
        explanation: "Las variables nativas de CSS se declaran con '--nombre' y se leen mediante la función 'var(--nombre)'."
    },
    {
        id: "css-m4",
        category: "CSS",
        difficulty: "Media",
        question: "En CSS Flexbox, ¿qué propiedad alinea los elementos flexibles a lo largo del eje transversal (perpendicular)?",
        code: `.contenedor-fumigador {\n    display: flex;\n    flex-direction: row;\n    ???: center; /* Alinear verticalmente */\n}`,
        options: [
            "justify-content",
            "align-items",
            "flex-direction",
            "content-align"
        ],
        correct: 1,
        explanation: "'align-items' controla la alineación de los elementos en el eje secundario o transversal de un flex container."
    },
    {
        id: "css-m5",
        category: "CSS",
        difficulty: "Media",
        question: "¿Qué hace la propiedad 'box-sizing: border-box;' en el modelo de caja de CSS?",
        code: `* {\n    box-sizing: border-box;\n}`,
        options: [
            "Elimina todos los bordes de la página",
            "Incluye el padding y el border dentro del ancho y alto total del elemento",
            "Duplica el margen exterior de todas las cajas",
            "Hace que todos los elementos se comporten como tablas"
        ],
        correct: 1,
        explanation: "'border-box' hace que 'width' y 'height' incluyan el contenido, el padding y el borde, facilitando el diseño y cálculo de tamaños."
    },
    {
        id: "css-m6",
        category: "CSS",
        difficulty: "Media",
        question: "¿Qué pseudoelemento de CSS se usa para insertar contenido decorativo antes del contenido de un elemento?",
        code: `.alerta::??? {\n    content: "⚠️ ";\n    color: red;\n}`,
        options: [
            "::first-letter",
            "::before",
            "::after",
            "::pre"
        ],
        correct: 1,
        explanation: "El pseudoelemento '::before' inserta contenido virtual antes del contenido real del elemento en el DOM."
    },
    {
        id: "css-m7",
        category: "CSS",
        difficulty: "Media",
        question: "En CSS Grid, ¿cuál propiedad permite crear un espacio uniforme de separación entre filas y columnas?",
        code: `.rejilla-servidor {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    ???: 16px;\n}`,
        options: [
            "spacing",
            "gap",
            "margin-grid",
            "padding-between"
        ],
        correct: 1,
        explanation: "'gap' (o grid-gap) establece el espaciado entre celdas (filas y columnas) en CSS Grid y Flexbox."
    },
    {
        id: "css-m8",
        category: "CSS",
        difficulty: "Media",
        question: "¿Qué propiedad de CSS controla el orden de apilamiento en el eje tridimensional Z (delante/detrás)?",
        code: `.ventana-modal {\n    position: absolute;\n    ???: 9999; /* Mostrar siempre por encima */\n}`,
        options: [
            "stack-order",
            "z-index",
            "depth",
            "elevation"
        ],
        correct: 1,
        explanation: "'z-index' especifica el orden de capas de un elemento posicionado (relative, absolute, fixed o sticky)."
    },
    {
        id: "css-m9",
        category: "CSS",
        difficulty: "Media",
        question: "¿Cuál es la diferencia clave entre 'display: none' y 'visibility: hidden' en CSS?",
        code: `/* Ocultar bicho del servidor */\n.bicho-oculto { visibility: hidden; }`,
        options: [
            "'visibility: hidden' elimina el elemento del DOM completamente",
            "'display: none' oculta el elemento pero reserva su espacio físico en el flujo de la página",
            "'visibility: hidden' oculta el elemento pero sigue ocupando su espacio en el diseño",
            "No existe ninguna diferencia práctica entre ambas propiedades"
        ],
        correct: 2,
        explanation: "'visibility: hidden' hace invisible el elemento pero mantiene su espacio en el layout; 'display: none' retira el elemento del flujo visual por completo."
    },
    {
        id: "css-m10",
        category: "CSS",
        difficulty: "Media",
        question: "¿Qué regla de CSS se utiliza para aplicar estilos condicionales basados en el tamaño de pantalla del dispositivo?",
        code: `??? (max-width: 768px) {\n    .ide-workspace { flex-direction: column; }\n}`,
        options: [
            "@media",
            "@screen",
            "@responsive",
            "@viewport"
        ],
        correct: 0,
        explanation: "La directiva '@media' permite definir Media Queries para adaptar diseños a diferentes dimensiones y características de dispositivos."
    },
    {
        id: "css-m11",
        category: "CSS",
        difficulty: "Media",
        question: "¿Qué propiedad CSS convierte el cursor en una mano con dedo índice al situarse sobre botones o enlaces?",
        code: `.boton-disparar-spray {\n    ???: pointer;\n}`,
        options: [
            "mouse-style",
            "cursor",
            "pointer-mode",
            "hover-state"
        ],
        correct: 1,
        explanation: "'cursor: pointer' muestra el icono clásico de mano interactiva indicando que el elemento es clickeable."
    },
    {
        id: "css-m12",
        category: "CSS",
        difficulty: "Media",
        question: "En Flexbox, ¿qué propiedad distribuye y alinea los elementos a lo largo del eje principal horizontal?",
        code: `.barra-herramientas {\n    display: flex;\n    ???: space-between;\n}`,
        options: [
            "align-content",
            "justify-content",
            "flex-align",
            "items-spread"
        ],
        correct: 1,
        explanation: "'justify-content' alinea y reparte el espacio sobrante entre elementos flexibles a lo largo del eje principal."
    },

    // =========================================================================
    // NIVEL 3: PYTHON - DIFICULTAD AVANZADA
    // =========================================================================
    {
        id: "py-a1",
        category: "Python",
        difficulty: "Avanzada",
        question: "¿Cuál es la salida de este generador con comprensión de listas y función next() en Python?",
        code: `gen = (x**2 for x in range(3))\nresultado = [next(gen), next(gen)]\nprint(resultado)`,
        options: [
            "[0, 1]",
            "[1, 4]",
            "[0, 1, 4]",
            "GeneradorError"
        ],
        correct: 0,
        explanation: "range(3) genera 0, 1, 2. El primer next() obtiene 0**2 = 0. El segundo next() obtiene 1**2 = 1. Resultado: [0, 1]."
    },
    {
        id: "py-a2",
        category: "Python",
        difficulty: "Avanzada",
        question: "En Programación Orientada a Objetos en Python, ¿para qué se utiliza el decorador '@classmethod'?",
        code: `class Servidor:\n    conexiones = 0\n    @classmethod\n    def conectar(cls):\n        cls.conexiones += 1`,
        options: [
            "Para crear un método estático que no recibe argumentos",
            "Para que el método reciba la clase ('cls') como primer parámetro en lugar de la instancia ('self')",
            "Para obligar a que el método devuelva una tupla",
            "Para ocultar la variable del recolector de basura"
        ],
        correct: 1,
        explanation: "'@classmethod' convierte el método para que opere sobre la clase ('cls') y pueda acceder o modificar el estado de la clase."
    },
    {
        id: "py-a3",
        category: "Python",
        difficulty: "Avanzada",
        question: "¿Qué devuelve la función 'len()' sobre el siguiente conjunto (set) que contiene elementos duplicados?",
        code: `bichos_rojos = {1, 2, 2, 3, 3, 3, 4}\nprint(len(bichos_rojos))`,
        options: [
            "7",
            "4",
            "3",
            "1"
        ],
        correct: 1,
        explanation: "Los conjuntos (sets) en Python eliminan automáticamente duplicados. Los elementos únicos son {1, 2, 3, 4}, por lo que len() devuelve 4."
    },
    {
        id: "py-a4",
        category: "Python",
        difficulty: "Avanzada",
        question: "¿Qué estructura mágica de datos se utiliza comúnmente para desempaquetar argumentos posicionales variables en una función?",
        code: `def fumigar(*args, **kwargs):\n    # ¿Qué tipo de datos es 'args'?\n    pass`,
        options: [
            "args es una lista mutable (list)",
            "args es una tupla inmutable (tuple)",
            "args es un diccionario de pares clave-valor",
            "args es una cola de prioridad (heap)"
        ],
        correct: 1,
        explanation: "En Python, '*args' agrupa todos los argumentos posicionales adicionales en una tupla (tuple) inmutable."
    },
    {
        id: "py-a5",
        category: "Python",
        difficulty: "Avanzada",
        question: "¿Cuál es el resultado de la siguiente operación con expresiones lambda y la función filter()?",
        code: `bichos = [10, 5, 25, 3, 40]\nvivos = list(filter(lambda x: x > 10, bichos))\nprint(vivos)`,
        options: [
            "[10, 25, 40]",
            "[25, 40]",
            "[5, 3]",
            "[True, False, True, False, True]"
        ],
        correct: 1,
        explanation: "'x > 10' es estricto (no incluye 10). Los elementos que cumplen la condición son 25 y 40. Resultado: [25, 40]."
    },
    {
        id: "py-a6",
        category: "Python",
        difficulty: "Avanzada",
        question: "¿Qué excepción se lanza en Python al intentar acceder a una clave que no existe dentro de un diccionario usando corchetes?",
        code: `servidor = {"ip": "10.0.0.1"}\npuerto = servidor["puerto"] # ???`,
        options: [
            "IndexError",
            "KeyError",
            "ValueError",
            "AttributeError"
        ],
        correct: 1,
        explanation: "Acceder a una clave inexistente con 'dict[key]' lanza un 'KeyError'. Para evitarlo se usa 'dict.get(key)'."
    },
    {
        id: "py-a7",
        category: "Python",
        difficulty: "Avanzada",
        question: "¿Cuál es el propósito del bloque 'finally' en una estructura try-except-finally en Python?",
        code: `try:\n    iniciar_fumigacion()\nexcept BugError:\n    registrar_fallo()\nfinally:\n    cerrar_puertos()`,
        options: [
            "Ejecutarse únicamente si ocurrió una excepción",
            "Ejecutarse siempre, tanto si ocurrió una excepción como si todo finalizó con éxito",
            "Reiniciar el bucle de ejecución desde el principio",
            "Cancelar la ejecución de todo el script"
        ],
        correct: 1,
        explanation: "El bloque 'finally' se ejecuta SIEMPRE al final de la gestión de excepciones, ideal para liberar recursos o cerrar conexiones."
    },
    {
        id: "py-a8",
        category: "Python",
        difficulty: "Avanzada",
        question: "¿Cuál es la salida de esta comprensión de listas (List Comprehension) con condición?",
        code: `pares = [x for x in range(6) if x % 2 == 0]\nprint(pares)`,
        options: [
            "[0, 2, 4]",
            "[2, 4, 6]",
            "[0, 2, 4, 6]",
            "[1, 3, 5]"
        ],
        correct: 0,
        explanation: "range(6) produce 0 a 5. Los pares son 0, 2 y 4 (6 no está incluido en el rango). Resultado: [0, 2, 4]."
    },
    {
        id: "py-a9",
        category: "Python",
        difficulty: "Avanzada",
        question: "En Python, ¿cuál es la diferencia fundamental entre los operadores '==' e 'is'?",
        code: `a = [1, 2, 3]\nb = [1, 2, 3]\nprint(a == b) # ???\nprint(a is b) # ???`,
        options: [
            "'==' compara tipos de datos e 'is' compara longitud",
            "'==' compara igualdad de valores, mientras que 'is' comprueba identidad de objeto en memoria",
            "'is' es un alias obsoleto de '==' y funcionan de modo idéntico",
            "'is' solo funciona con números enteros"
        ],
        correct: 1,
        explanation: "'==' comprueba si los valores son iguales, mientras que 'is' verifica si ambas variables apuntan a la misma dirección física en memoria (identidad de objeto)."
    },
    {
        id: "py-a10",
        category: "Python",
        difficulty: "Avanzada",
        question: "¿Qué método especial o mágico actúa como el constructor inicializador de una clase en Python?",
        code: `class Fumigador:\n    def ???(self, nombre, spray_nivel):\n        self.nombre = nombre\n        self.spray_nivel = spray_nivel`,
        options: [
            "def __start__(self):",
            "def __new__(self):",
            "def __init__(self):",
            "def __construct__(self):"
        ],
        correct: 2,
        explanation: "'__init__' es el método inicializador estándar que se ejecuta al instanciar un nuevo objeto en Python."
    },
    {
        id: "py-a11",
        category: "Python",
        difficulty: "Avanzada",
        question: "¿Qué método de los diccionarios en Python permite obtener un valor o retornar uno por defecto sin lanzar excepción si la clave no existe?",
        code: `servidor = {"host": "srv1"}\npuerto = servidor.???("puerto", 8080)`,
        options: [
            "fetch()",
            "get()",
            "lookup()",
            "find()"
        ],
        correct: 1,
        explanation: "dict.get(key, default) busca la clave y, de no encontrarla, retorna el valor por defecto sin arrojar KeyError."
    },
    {
        id: "py-a12",
        category: "Python",
        difficulty: "Avanzada",
        question: "¿Cuál es la diferencia principal entre una Tupla (tuple) y una Lista (list) en Python?",
        code: `lista_bichos = ['rojo', 'negro']\ntupla_bichos = ('rojo', 'negro')`,
        options: [
            "Las listas son inmutables y las tuplas son mutables",
            "Las tuplas son inmutables (no se pueden modificar) y las listas son mutables",
            "Las tuplas no admiten elementos repetidos",
            "Las listas solo pueden almacenar valores de tipo numérico"
        ],
        correct: 1,
        explanation: "Las tuplas son secuencias inmutables (su contenido no puede ser alterado tras crearse), mientras que las listas son completamente mutables."
    }
];

// Helper para obtener preguntas filtradas por nivel
function getQuestionsForLevel(category, difficulty, count = 5) {
    const filtered = PROGRAMMING_QUESTIONS.filter(q => 
        q.category === category && q.difficulty === difficulty
    );
    return [...filtered].sort(() => Math.random() - 0.5).slice(0, count);
}

/**
 * Helper para MODO CARRERA:
 * Obtiene una lista mezclada aleatoriamente con preguntas de HTML, CSS y Python.
 * Las preguntas se barajan con el algoritmo Fisher-Yates para máxima aleatoriedad.
 */
function getRandomRaceQuestions() {
    const pool = [...PROGRAMMING_QUESTIONS];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
}

window.PROGRAMMING_QUESTIONS = PROGRAMMING_QUESTIONS;
window.getQuestionsForLevel = getQuestionsForLevel;
window.getRandomRaceQuestions = getRandomRaceQuestions;
