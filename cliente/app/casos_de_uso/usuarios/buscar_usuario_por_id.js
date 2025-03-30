export const buscar_usuario_por_id = async (id) => {

    const solicitud = await fetch(`http://localhost:3000/usuarios/${id}`);
  
    const respuesta = await solicitud.json();
  
    return respuesta;
  
  }


