export const eliminar_usuario_por_id = (id) => {
    fetch(`http://localhost:3000/usuarios/${id}`, {
      method: 'DELETE',
    });
  }