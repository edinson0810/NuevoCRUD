/**
 * ****************************************
 * Importamos los modulos
 * ****************************************
 */

// Importaciones para las ayudas
import { listarDocumentos } from "../casos_de_uso/documentos/index.js";
import { listarGeneros } from "../casos_de_uso/generos/index.js";
import { guardar_usuario, listar_Usuario, eliminar_usuario_por_id, buscar_usuario_por_id, actualizar_usuario } from "../casos_de_uso/usuarios/index.js";
import { tiene_valores, validar_campos, es_numero, son_letras, es_correo } from "../helpers/index.js";

// ** Definir variables **
const formulario = document.querySelector("#form");
const nombre = document.querySelector("#nombre");
const apellidos = document.querySelector("#apellidos");
const telefono = document.querySelector("#telefono");
const email = document.querySelector("#correo");
const tipoDocumento = document.querySelector("#tipo_documento");
const documento = document.querySelector("#documento");
const generos = document.querySelector("#generos");
const tabla = document.querySelector("#tabla tbody"); // Apuntar al tbody directamente
const identificador = document.querySelector("#identificador");

// ** Cargar datos en selects **
const cargar_formulario = async () => {
  const arrayGeneros = await listarGeneros();
  const arrayDocumentos = await listarDocumentos();

  generos.innerHTML = ""; // Limpiar antes de agregar
  arrayGeneros.forEach((genero) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    label.textContent = genero.nombre;
    label.setAttribute("for", genero.nombre);
    label.classList.add("form__label");

    input.setAttribute("type", "radio");
    input.setAttribute("name", "genero");
    input.setAttribute("id", genero.nombre);
    input.setAttribute("value", genero.id);
    input.dataset.required = true;

    generos.append(label, input);
  });

  tipoDocumento.innerHTML = '<option value="">Seleccione...</option>'; // Limpiar antes de agregar
  arrayDocumentos.forEach((documento) => {
    const option = document.createElement("option");
    option.textContent = documento.nombre;
    option.value = documento.id;
    tipoDocumento.append(option);
  });
};

// ** Cargar tabla de usuarios **
const cargar_tabla = async () => {
  const usuarios = await listar_Usuario();
  tabla.innerHTML = ""; // Limpiar tabla antes de agregar nuevas filas

  usuarios.forEach((usuario) => {
    crearFila(usuario);
  });
};

// ** Crear fila en la tabla **
const crearFila = ({ id, nombre, apellidos, telefono, correo, documento }) => {
  const tr = document.createElement("tr");
  tr.setAttribute("id", `user_${id}`);

  tr.innerHTML = `
    <td>${nombre}</td>
    <td>${apellidos}</td>
    <td>${telefono}</td>
    <td>${correo}</td>
    <td>${documento}</td>
    <td>
      <div class="botonera">
        <button class="btn btn--small editar" data-id="${id}">Editar</button>
        <button class="btn btn--small btn--danger eliminar" data-id="${id}">Eliminar</button>
      </div>
    </td>
  `;

  tabla.appendChild(tr);
};

// ** Llenar formulario para editar usuario **
const llenado = async (e) => {
  const id = e.target.dataset.id;
  const data = await buscar_usuario_por_id(id);
  identificador.value = id;

  nombre.value = data.nombre;
  apellidos.value = data.apellidos;
  telefono.value = data.telefono;
  correo.value = data.correo;
  tipoDocumento.value = data.tipo_documento;
  documento.value = data.documento;

  generos.querySelectorAll('input[type=radio]').forEach((input) => {
    input.checked = input.value == data.genero;
  });
};

// ** Guardar o actualizar usuario **
const guardar = async (e) => {
  e.preventDefault();
  const data = validar_campos(e.target);

  if (!tiene_valores(data)) {
    alert("Formulario incompleto");
    return;
  }

  if (identificador.value) {
    await actualizar_usuario(identificador.value, data);
    alert("Usuario actualizado correctamente");
  } else {
    const respuesta = await guardar_usuario(data);
    if (respuesta.status === 201) {
      alert("Usuario guardado correctamente");
      crearFila(respuesta.data);
    } else {
      alert("Error al guardar el usuario");
    }
  }

  e.target.reset();
  cargar_tabla(); // Actualizar la tabla automáticamente
};

// ** Eliminar usuario **
document.addEventListener("click", async (e) => {
  if (e.target.matches(".editar")) {
    llenado(e);
  }
  if (e.target.matches(".eliminar")) {
    const id = e.target.dataset.id;
    await eliminar_usuario_por_id(id);
    document.querySelector(`#user_${id}`).remove(); // Eliminar fila sin recargar
  }
});

// ** Eventos **
document.addEventListener("DOMContentLoaded", () => {
  cargar_formulario();
  cargar_tabla();
});

// ** Validaciones de entrada **
nombre.addEventListener("keydown", son_letras);
apellidos.addEventListener("keydown", son_letras);
telefono.addEventListener("keydown", es_numero);
documento.addEventListener("keydown", es_numero);
email.addEventListener("blur", es_correo);

formulario.addEventListener("submit", guardar);
