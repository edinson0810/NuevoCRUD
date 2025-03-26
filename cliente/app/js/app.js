/**
 * ****************************************
 * Importamos los modulos
 * ****************************************
 */

// Importaciones para las ayudas
import { listarDocumentos } from "../casos_de_uso/documentos/index.js";
import { listarGeneros } from "../casos_de_uso/generos/index.js";
import { guardar_usuario, listar_Usuario } from "../casos_de_uso/usuarios/index.js";
import {
  tiene_valores,
  validar_campos,
  es_numero,
  son_letras,
  es_correo
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
const tabla = document.querySelector('#tabla')

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

const cargar_tabla = async () => {
  const usuarios = await listar_Usuario();
 const tabla_cuerpo = tabla.querySelector("tbody");
  
usuarios.forEach(usuario => {
  const fila = document.createElement("tr");
const tdNombre = document.createElement("td");
const tdApellido = document.createElement("td");
const tdTelefono = document.createElement("td");
const tdCorreo = document.createElement("td");
const tdDocumento = document.createElement("td");
const tdbotonera = document.createElement("td")
const botonera = document.createElement("div");
const btneditar = document.createElement("button");
const btneliminar = document.createElement("button");

botonera.append(btneditar,btneliminar);
tdbotonera.append(botonera);


tdNombre.textContent = usuario.nombre;
tdApellido.textContent = usuario.apellidos;
tdTelefono.textContent = usuario.telefono;
tdCorreo.textContent = usuario.correo;
tdDocumento.textContent = usuario.documento;

btneditar.textContent = "Editar";
btneliminar.textContent = "Eliminar";

botonera.classList.add("botonera");
btneditar.classList.add("btn", "btn--samall");
btneliminar.classList.add("btn", "btn-samall", "btn--danger");

fila.append(tdNombre, tdApellido, tdTelefono, tdCorreo, tdDocumento);

tabla_cuerpo.append(fila);
fila.append(tdbotonera);

   }) 
}


// Función asincrona para poder manipular las peticiones y guardar los datos del formulario
const guardar = async (e) => {
  // Detenemos el comportamiento por defecto del formulario
  e.preventDefault();
  // Validamos que el formulario tenga datos
  const data = validar_campos(e.target);
  // Validamos eu el objeto tenga los datos completos y no llegen vacios
  if (tiene_valores(data)) {
    // Enviamos los datos al metodo guardar_usuario
    const respuesta = await guardar_usuario(data);    
    if (respuesta.status === 201) {
      alert("Usuario guardado correctamente");
      // Limpiamos el formulario
      e.target.reset();
    }else{
      alert("Error al guardar el usuario");
    }
  }else{
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

nombre.addEventListener("keydown", son_letras);
apellidos.addEventListener("keydown", son_letras);
telefono.addEventListener("keydown", es_numero);
documento.addEventListener("keydown", es_numero);
email.addEventListener("blur", es_correo);

formulario.addEventListener("submit", guardar);