export const actualizar_usuario = (id, data) => {
    fetch(`http://localhost:3000/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  
  }