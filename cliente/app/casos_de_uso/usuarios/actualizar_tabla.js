
export const actualizarTabla = async () => {
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${id}`);
        const datos = await response.json();

        const tbody = document.querySelector("#tabla tbody");
        tbody.innerHTML = ""; // Limpiar la tabla antes de actualizar

        datos.forEach(({ id, name, email }) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `<td>${name}</td><td>${name}</td><td>${email}</td>`;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al actualizar la tabla:", error);
    }
};
