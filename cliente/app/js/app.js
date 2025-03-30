/**
 * ****************************************
 * Importamos los modulos
 * ****************************************
 */

// Importaciones para las ayudas
import { listarDocumentos } from "../casos_de_uso/documentos/index.js";
import { listarGeneros } from "../casos_de_uso/generos/index.js";
import { guardar_usuario, listar_Usuario, eliminar_usuario_por_id, buscar_usuario_por_id } from "../casos_de_uso/usuarios/index.js";
import {
  tiene_valores,
  validar_campos,
  es_numero,
  son_letras,
  es_correo,
} from "../helpers/index.js";

/**
 * ****************************************
 * Definimos las variebales
 * ****************************************
 */

const formulario = document.querySelector('#form');
const nombre = document.querySelector('#nombre');
const apellidos = document.querySelector('#apellidos');
const telefono = document.querySelector('#telefono');
const email = document.querySelector("#correo");
const tipoDocumento = document.querySelector("#tipo_documento");
const documento = document.querySelector('#documento');
const generos = document.querySelector('#generos');
const tabla = document.querySelector("#tabla");
const identificador = document.querySelector("#identificador");

// console.log(tabla);

/**
 * ****************************************
 * Programos los Metodos
 * ****************************************
 */
const cargar_formulario = async () => {

  // Cargamos los generos en el select
  const arrayGeneros = await listarGeneros();
  const arrayDocumentos = await listarDocumentos()

  arrayGeneros.forEach((genero) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    label.textContent = genero.nombre;
    label.setAttribute("for", genero.nombre);
    label.textContent = genero.nombre;
    label.classList.add("form__label");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "genero");
    input.setAttribute("id", genero.nombre);
    input.setAttribute("value", genero.id);
    input.setAttribute("data-required", true);
    generos.append(label, input);
  });

  const option = document.createElement("option");
  option.textContent = "Seleccione...";
  tipoDocumento.append(option);
  arrayDocumentos.forEach((documento) => {
    const option = document.createElement("option");
    option.textContent = documento.nombre;
    option.value = documento.id;
    tipoDocumento.append(option);
  });
}

const llenado = (data) => {
  nombre.value = data.nombre;
  apellidos.value = data.apellidos;
  telefono.value = data.telefono;
  correo.value = data.correo;
  tipoDocumento.selectedIndex = data.tipo_documento;
  documento.value = data.documento;
  
  const radios = document.querySelectorAll('input[type=radio]');

  radios.forEach((elemento) => {
    elemento.checked = elemento.value == data.genero;
  })
   
  
}


const cargar_tabla = async () => {
  const usuarios = await listar_Usuario();
  usuarios.forEach(usuario => {
    crearFila(usuario);
  });
}


const crearFila = ({ id, nombre, apellidos, telefono, correo, tipo_documento, documento }) => {

  const tBody = tabla.querySelector("tbody");
  const tr = tBody.insertRow(0);
  const tdNombre = tr.insertCell(0);
  const tdApellidos = tr.insertCell(1);
  const tdTelefono = tr.insertCell(2);
  const tdCorreo = tr.insertCell(3);
  const tdDocumento = tr.insertCell(4);
  const tdBotonera = tr.insertCell(5);
  // Agregar el contenido a las celdas
  tdNombre.textContent = nombre;
  tdApellidos.textContent = apellidos;
  tdTelefono.textContent = telefono;
  tdCorreo.textContent = correo;
  tdDocumento.textContent = documento;

  const div = document.createElement("div");
  const btnEliminar = document.createElement("button");
  const btnEditar = document.createElement("button");

  btnEditar.setAttribute("data-id", id)
  btnEliminar.setAttribute("data-id", id)

  btnEditar.textContent = "Editar";
  btnEliminar.textContent = "Eliminar";

  div.classList.add("botonera");
  btnEditar.classList.add("btn", "btn--samall", "editar");
  btnEliminar.classList.add("btn", "btn--samall", "btn--danger", "eliminar");
  div.append(btnEditar, btnEliminar);
  tdBotonera.append(div);

  tr.setAttribute("id", `user_${id}`);

}

// Función asincrona para poder manipular las peticiones y guardar los datos del formulario
const guardar = async (e) => {
  // Detenemos el comportamiento por defecto del formulario
  e.preventDefault();
  // Validamos que el formulario tenga datos
  const data = validar_campos(e.target);
  // Validamos eu el objeto tenga los datos completos y no llegen vacios
  if (tiene_valores(data)) {
    // validamos qeu el formulario enga un identificador
    if(!identificador.value){
      alert("editar")
    } else {
      
       const respuesta = await guardar_usuario(data);
    // console.log(respuesta);
    if (respuesta.status === 201) {
      alert("Usuario guardado correctamente");
      // Limpiamos el formulario
      e.target.reset();
      // Llamamos el metodo crearFila
      crearFila(respuesta.data);

    } else {
      alert("Error al guardar el usuario");
    }
  }
  } else {
    alert("Formulario incompleto");
  } 
}

/**
 * ****************************************
 * Definimos los Eventos
 * ****************************************
 */

// Evento que se ejecuta cuando el documento se ha cargado
document.addEventListener("DOMContentLoaded", () => {
  cargar_formulario();

  cargar_tabla();
 
});

document.addEventListener("click", async (e) => {
  // Evento para el botón editar en latabla que creamos en el SENA
  if (e.target.matches(".editar")) {
    const data = await buscar_usuario_por_id(e.target.dataset.id)
    // llamar la funcion para llenar el formulario
    llenado(data);
   

  }
  if (e.target.matches(".eliminar")) {
    eliminar_usuario_por_id(e.target.dataset.id);
  }

})
nombre.addEventListener("keydown", son_letras);
apellidos.addEventListener("keydown", son_letras);
telefono.addEventListener("keydown", es_numero);
documento.addEventListener("keydown", es_numero);
email.addEventListener("blur", es_correo);

formulario.addEventListener("submit", guardar);