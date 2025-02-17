window.onload = () => { // Cambio de DOMContentLoaded a window.onload
    const selectorIdiomas = document.getElementById("idiomas");
    const datalistIdiomas = document.getElementById("idiomas-lista");
    const mapaIdiomas = {
        "español": "es",
        "inglés": "en",
        "francés": "fr",
        "spanish": "es",
        "english": "en",
        "french": "fr",
        "espagnol": "es",
        "anglais": "en",
        "français": "fr"
    };

    let traducciones = {}; // Declarar traducciones de forma global

    // Detectar cambios en el input del idioma
    selectorIdiomas.addEventListener("input", () => {
        const idiomaSeleccionado = selectorIdiomas.value.toLowerCase();
        const claveIdioma = mapaIdiomas[idiomaSeleccionado];

        if (claveIdioma) {
            localStorage.setItem("idioma", claveIdioma);
            cargarTraducciones(claveIdioma).then(() => {
                actualizarSubmenu();
                sincronizarIframe(claveIdioma);
            });
        } else {
            console.warn("Idioma no válido o no soportado:", idiomaSeleccionado);
        }
    });

    // Función para cargar traducciones desde un archivo JSON
    async function cargarTraducciones(idioma) {
        try {
            const response = await fetch("../data/traducciones.json");
            traducciones = await response.json();

            if (!traducciones[idioma]) return;

            // Actualizar textos visibles con data-translate
            document.querySelectorAll("[data-translate]").forEach((elemento) => {
                const clave = elemento.getAttribute("data-translate");
                if (traducciones[idioma][clave]) {
                    elemento.textContent = traducciones[idioma][clave];
                }
            });

            // Actualizar atributos data-title
            document.querySelectorAll("[data-title]").forEach((elemento) => {
                const clave = elemento.getAttribute("data-title");
                if (traducciones[idioma][clave]) {
                    elemento.setAttribute("title", traducciones[idioma][clave]);
                }
            });

            // Actualizar placeholders
            const cuadroBusqueda = document.getElementById("cuadro-busqueda");
            if (cuadroBusqueda) {
                cuadroBusqueda.setAttribute("placeholder", traducciones[idioma]["buscar"] || "Buscar");
            }

            if (selectorIdiomas) {
                selectorIdiomas.setAttribute("placeholder", traducciones[idioma]["selecciona_idioma"] || "Selecciona un idioma");
            }

            // Actualizar contenido del datalist
            if (datalistIdiomas) {
                actualizarDatalist(datalistIdiomas, traducciones[idioma]["idiomas-lista"]);
            }
        } catch (error) {
            console.error("Error al cargar las traducciones:", error);
        }
    }

    // Función para sincronizar idioma con el iframe activo
    function sincronizarIframe(idioma) {
        const iframe = document.querySelector(".carrusel iframe");
        if (iframe) {
            iframe.contentWindow.postMessage({ idioma: idioma }, "*");
        }
    }

    // Función para actualizar el contenido del datalist
    function actualizarDatalist(datalist, opciones) {
        datalist.innerHTML = ""; // Limpiar contenido actual
        opciones.forEach(opcion => {
            const optionElement = document.createElement("option");
            optionElement.value = opcion;
            datalist.appendChild(optionElement);
        });
    }

    // Función para actualizar dinámicamente el submenu
    function actualizarSubmenu() {
        const idiomaActual = localStorage.getItem("idioma") || "es";
    
        // Selecciona elementos con data-translate y data-title dentro del submenú
        const elementosSubmenu = document.querySelectorAll(".submenu [data-translate], .submenu [data-title]");
    
        if (elementosSubmenu.length === 0) {
            console.warn("No se encontraron elementos del submenú para traducir.");
            return;
        }
    
        elementosSubmenu.forEach((elemento) => {
            const clave = elemento.getAttribute("data-translate") || elemento.getAttribute("data-title");
            if (clave && traducciones[idiomaActual] && traducciones[idiomaActual][clave]) {
                // Actualiza el texto si tiene data-translate
                if (elemento.hasAttribute("data-translate")) {
                    elemento.textContent = traducciones[idiomaActual][clave];
                }
                // Actualiza el atributo title si tiene data-title
                if (elemento.hasAttribute("data-title")) {
                    elemento.setAttribute("title", traducciones[idiomaActual][clave]);
                }
            }
        });
    }
    

    // Configuración inicial: idioma almacenado o por defecto (español)
    const idiomaGuardado = localStorage.getItem("idioma") || "es";
    cargarTraducciones(idiomaGuardado).then(() => {
        actualizarSubmenu();
        sincronizarIframe(idiomaGuardado); // Asegurar sincronización inicial
    });
};
