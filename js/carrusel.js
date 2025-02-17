
document.addEventListener("DOMContentLoaded", () => {
    // Leer idioma del localStorage al cargar
    const idioma = localStorage.getItem("idioma") || "es";
    cargarTraduccionesCarrusel(idioma);

    // Escuchar mensajes del iframe principal
    window.addEventListener("message", (event) => {
        if (event.data && event.data.idioma) {
            cargarTraduccionesCarrusel(event.data.idioma);
        }
    });

    // Función para cargar traducciones del carrusel
    async function cargarTraduccionesCarrusel(idioma) {
        try {
            const response = await fetch("../data/traducciones.json");
            const traducciones = await response.json();

            if (!traducciones[idioma]) return;

            document.querySelectorAll("[data-translate]").forEach((elemento) => {
                const clave = elemento.getAttribute("data-translate");
                if (traducciones[idioma][clave]) {
                    elemento.textContent = traducciones[idioma][clave];
                }
            });
        } catch (error) {
            console.error("Error al cargar las traducciones en el carrusel:", error);
        }
    }
});
