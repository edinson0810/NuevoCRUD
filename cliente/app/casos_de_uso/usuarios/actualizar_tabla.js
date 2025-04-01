export const actualizarTabla = async () => {
    try {
        const response = await fetch("http://localhost:3000/usuarios");
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.statusText}`);
        }
        return await response.json(); // Devuelve los datos actualizados
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return [];
    }
};





