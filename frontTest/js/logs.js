let paginaActual = 1;
let totalPaginas = 1;

async function cargarLogs(pagina = 1) {
  try {
    const data = await callBackend('GET', `http://localhost:3000/logs?page=${pagina}`);
    const tbody = document.querySelector("#tablaLogs tbody");
    tbody.innerHTML = '';
    if(data && data.logs){
        data.logs.forEach(log => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${log.id}</td>
            <td>${new Date(log.fecha_registro).toLocaleString()}</td>
            <td>${log.url_peticion}</td>
            <td>${log.tipo_peticion}</td>
            <td>${log.respuesta_status}</td>
            <td>
            <button onclick='verDetalleLog(${JSON.stringify(log)})'>Ver detalle</button>
            </td>
        `;
        tbody.appendChild(fila);
        });
    
        paginaActual = data.currentPage;
        totalPaginas = data.totalPages;

        document.getElementById("btnPrev").disabled = (paginaActual <= 1);
        document.getElementById("btnNext").disabled = (paginaActual >= totalPaginas);
    }
  } catch (err) {
    mostrarMensaje("Error cargando logs", true);
    console.error(err);
  }
}

function cambiarPagina(direccion) {
  const nuevaPagina = paginaActual + direccion;
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
    cargarLogs(nuevaPagina);
  }
}

function verDetalleLog(log) {
  document.getElementById("detalleId").innerText = log.id;
  document.getElementById("detalleFecha").innerText = new Date(log.fecha_registro).toLocaleString();
  document.getElementById("detalleUrl").innerText = log.url_peticion;
  document.getElementById("detalleTipo").innerText = log.tipo_peticion;
  document.getElementById("detalleStatus").innerText = log.respuesta_status;
  document.getElementById("detallePeticion").innerText = log.contenido_peticion || "N/A";
  document.getElementById("detalleRespuesta").innerText = log.contenido_respuesta || "N/A";

  document.getElementById("modalDetalleLog").style.display = "flex";
}

function cerrarModalLog() {
  document.getElementById("modalDetalleLog").style.display = "none";
}
