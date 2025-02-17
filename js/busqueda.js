window.onload = () => {
    const barraBusqueda = document.getElementById("cuadro-busqueda"); // Input de búsqueda
    const resultadosContenedor = document.createElement("div"); // Contenedor para resultados
    resultadosContenedor.id = "resultados-busqueda";
    barraBusqueda.parentNode.appendChild(resultadosContenedor); // Insertar debajo del input

    let traducciones = {}; // Variable global para las traducciones
    const idiomaActual = localStorage.getItem("idioma") || "es"; // Idioma actual por defecto

    // Cargar JSON de traducciones
    async function cargarTraducciones() {
        try {
            const response = await fetch("../data/traducciones.json");
            traducciones = await response.json();
        } catch (error) {
            console.error("Error al cargar traducciones:", error);
        }
    }

    // Buscar coincidencias en el JSON
    function buscarCoincidencias(texto) {
        if (!traducciones[idiomaActual]) return [];

        const resultados = [];
        for (const clave in traducciones[idiomaActual]) {
            const valor = traducciones[idiomaActual][clave];
            if (valor.toLowerCase().includes(texto.toLowerCase())) {
                resultados.push(valor);
            }
        }
        return resultados;
    }

    // Mostrar resultados dinámicamente
    function mostrarResultados(resultados) {
        resultadosContenedor.innerHTML = ""; // Limpiar resultados previos

        if (resultados.length === 0) {
            resultadosContenedor.innerHTML = "<p>No se encontraron resultados</p>";
            return;
        }

        const lista = document.createElement("ul");
        resultados.forEach((resultado) => {
            const item = document.createElement("li");
            item.textContent = resultado;
            lista.appendChild(item);

            // Evento al hacer clic en un resultado
            item.addEventListener("click", () => {
                barraBusqueda.value = resultado;
                resultadosContenedor.innerHTML = ""; // Limpiar resultados
            });
        });
        resultadosContenedor.appendChild(lista);
    }

    // Evento: Detectar input en la barra de búsqueda
    barraBusqueda.addEventListener("input", (e) => {
        const textoBusqueda = e.target.value.trim();

        if (textoBusqueda.length === 0) {
            resultadosContenedor.innerHTML = ""; // Limpiar si no hay texto
            return;
        }

        const resultados = buscarCoincidencias(textoBusqueda);
        mostrarResultados(resultados);
    });

    // Cargar las traducciones al inicio
    cargarTraducciones();
};
