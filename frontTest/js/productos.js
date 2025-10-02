// Cargar Productos
async function cargarProductos() {
  try {
    const data = await callBackend('GET', 'http://localhost:3000/products'); // Ajusta a tu endpoint real
    const tbody = document.querySelector("#tablaProductos tbody");
    tbody.innerHTML = '';

    data.forEach(p => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombre_lote}</td>
        <td>${p.nombre}</td>
        <td>${p.precio}</td>
        <td>${p.cantidad_disponible}</td>
        <td>${new Date(p.fecha_ingreso).toLocaleDateString()}</td>
        <td>
          <button onclick="actualizarProducto(${p.id})">Actualizar</button>
          <button onclick="eliminarProducto(${p.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    mostrarMensaje("Error cargando productos", true);
    console.error(err);
  }
}

// Crear Producto
function crearProducto() {
  document.getElementById("modalCrearProducto").style.display = "flex";
}
function cerrarModalCrearProducto() {
  document.getElementById("modalCrearProducto").style.display = "none";
}
async function guardarNuevoProducto(event) {
  event.preventDefault();
  const nombre_lote = document.getElementById("nuevoLoteProducto").value;
  const nombre = document.getElementById("nuevoNombreProducto").value;
  const precio = document.getElementById("nuevoPrecioProducto").value;
  const cantidad_disponible = document.getElementById("nuevoStockProducto").value;
  const fecha_ingreso = document.getElementById("nuevaFechaIngresoProducto").value;

  const res = await callBackend('POST', 'http://localhost:3000/create_product', {
    nombre_lote, nombre, precio, cantidad_disponible, fecha_ingreso
  });

  if (res && res.mensaje) {
    mostrarMensaje(res.mensaje, false);
    cerrarModalCrearProducto();
    cargarProductos();
  } else {
    mostrarMensaje(res.error || "Error al crear producto", true);
  }
}

// Actualizar Producto
function actualizarProducto(id) {
  const filas = document.querySelectorAll("#tablaProductos tbody tr");
  let producto = null;

  filas.forEach(f => {
    if (parseInt(f.children[0].innerText) === id) {
      producto = {
        id: id,
        nombre_lote: f.children[1].innerText,
        nombre: f.children[2].innerText,
        precio: f.children[3].innerText,
        cantidad_disponible: f.children[4].innerText,
        fecha_ingreso: f.children[5].innerText
      };
    }
  });

  if (!producto) {
    mostrarMensaje("No se encontró el producto en la tabla", true);
    return;
  }

  document.getElementById("editIdProducto").value = producto.id;
  document.getElementById("editLoteProducto").value = producto.nombre_lote;
  document.getElementById("editNombreProducto").value = producto.nombre;
  document.getElementById("editPrecioProducto").value = producto.precio;
  document.getElementById("editStockProducto").value = producto.cantidad_disponible;

  // Convertir fecha a formato yyyy-mm-dd para el input
  const fechaISO = new Date(producto.fecha_ingreso);
  document.getElementById("editFechaIngresoProducto").value = fechaISO.toISOString().split("T")[0];

  document.getElementById("modalActualizarProducto").style.display = "flex";
}

function cerrarModalActualizarProducto() {
  document.getElementById("modalActualizarProducto").style.display = "none";
}

async function guardarProductoActualizado(event) {
  event.preventDefault();
  const id = document.getElementById("editIdProducto").value;
  const nombre_lote = document.getElementById("editLoteProducto").value;
  const nombre = document.getElementById("editNombreProducto").value;
  const precio = document.getElementById("editPrecioProducto").value;
  const cantidad_disponible = document.getElementById("editStockProducto").value;
  const fecha_ingreso = document.getElementById("editFechaIngresoProducto").value;

  const res = await callBackend('PUT', `http://localhost:3000/update_product/${id}`, {
    nombre_lote, nombre, precio, cantidad_disponible, fecha_ingreso
  });

  if (res && res.mensaje) {
    mostrarMensaje(res.mensaje, false);
    cerrarModalActualizarProducto();
    cargarProductos();
  } else {
    mostrarMensaje(res.error || "Error al actualizar producto", true);
  }
}

// Eliminar Producto
async function eliminarProducto(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

  const res = await callBackend('DELETE', `http://localhost:3000/delete_product/${id}`);
  if (res && res.mensaje) {
    mostrarMensaje(res.mensaje, false);
    cargarProductos();
  } else {
    mostrarMensaje(res.error || "Error al eliminar producto", true);
  }
}
