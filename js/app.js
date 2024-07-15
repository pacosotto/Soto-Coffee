import { meseros } from "./meseros.js";

//Variables
const meseroSelect = document.querySelector("#mesero");
const mesaInput = document.querySelector("#mesa");
const ordenInput = document.querySelector("#orden");
const formulario = document.querySelector("#formulario");
const btnOrdenar = document.querySelector("#enviar-orden");
const tomarOrdenes = document.querySelector("#tomar-ordenes");
const verOrdenes = document.querySelector("#ver-ordenes");

const containerFormulario = document.querySelector(".container-formulario");
const containerOrdenes = document.querySelector(".container-ordenes");

const ordenObj = {
  id: generarIdUnico(),
  mesero: "",
  mesa: "",
  orden: "",
};

//Eventos
document.addEventListener("DOMContentLoaded", () => {
  rellenarSelectMeseros();
});
meseroSelect.addEventListener("change", validarFormulario);
mesaInput.addEventListener("blur", validarFormulario);
ordenInput.addEventListener("blur", validarFormulario);
formulario.addEventListener("submit", enviarOrden);
tomarOrdenes.addEventListener("click", (e) => {
  e.preventDefault();
  containerFormulario.classList.remove("ocultarPagina");
  containerOrdenes.classList.add("ocultarPagina");
  containerFormulario.classList.add("verPagina");
});
verOrdenes.addEventListener("click", (e) => {
  e.preventDefault();
  containerOrdenes.classList.remove("ocultarPagina");
  containerFormulario.classList.add("ocultarPagina");
  containerOrdenes.classList.add("verPagina");
  ui.obtenerOrdenesUI();
});

//Clases
class UI {
  mostrarMensaje(mensaje, tipo, referencia) {
    const input = document.querySelector(`#${referencia}`);
    const refAlerta = document.querySelector(".alerta");

    if (!refAlerta) {
      const alerta = document.createElement("p");
      alerta.classList.add("alerta");

      if (tipo === "error") {
        alerta.classList.add("error");
      }
      alerta.textContent = mensaje;
      input.parentElement.appendChild(alerta);

      setTimeout(() => {
        alerta.remove();
      }, 3000);
    }
  }
  obtenerOrdenesUI() {
    limpiarHTML(containerOrdenes);
    const ordenes = administrarOrdenes.obtenerOrdenes();
    console.log(ordenes);
    ordenes.forEach((elemento) => {
      const { mesero, mesa, orden } = elemento;
      const div = document.createElement("div");
      div.innerHTML = `
        <h4>Mesa: ${mesa}</h4>
        <p><strong>Orden:</strong> ${orden}</p>
        <p><strong>Mesero:</strong> ${mesero}</p>
        <hr>
        `;
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Liberar orden";
      btnEliminar.onclick = () => administrarOrdenes.eliminar(elemento.id);
      div.appendChild(btnEliminar);
      containerOrdenes.appendChild(div);
    });
  }
}

class Ordenes {
  constructor() {
    this.ordenes = [];
  }
  agregarOrden(ordenObj) {
    this.ordenes = [...this.ordenes, ordenObj];
    localStorage.setItem("ordenes", JSON.stringify(this.ordenes));
    console.log(this.obtenerOrdenes());
  }
  obtenerOrdenes() {
    return JSON.parse(localStorage.getItem("ordenes"));
  }
  eliminar(id) {
    this.ordenes = this.ordenes.filter((elemento) => elemento.id !== id);
    ui.obtenerOrdenesUI();
  }
}

let ui = new UI();
let administrarOrdenes = new Ordenes();

//Funciones
function rellenarSelectMeseros() {
  meseros.forEach((mesero) => {
    const { nombre } = mesero;
    const option = document.createElement("option");
    option.textContent = nombre;
    option.value = nombre;
    meseroSelect.appendChild(option);
  });
}

function validarFormulario(e) {
  if (e.target.value.trim() === "") {
    ui.mostrarMensaje("Debes rellenar este campo", "error", e.target.id);
    return;
  }

  ordenObj[e.target.id] = e.target.value;
}

function limpiarHTML(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

function enviarOrden(e) {
  e.preventDefault();
  administrarOrdenes.agregarOrden({ ...ordenObj });
  formulario.reset();
  limpiarObj();
}

function limpiarObj() {
  Object.assign(ordenObj, {
    id: generarIdUnico(),
    mesero: "",
    mesa: "",
    orden: "",
  });
}

function generarIdUnico() {
  return Math.random().toString(36).substring(2) + Date.now();
}
