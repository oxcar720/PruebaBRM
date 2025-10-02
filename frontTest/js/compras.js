let carritoCount = 0;

// Cargar productos disponibles para comprar
async function cargarProductosCompra() {
  try {
    const data = await callBackend('GET', 'http://localhost:3000/products');
    const tbody = document.querySelector("#tablaComprasProductos tbody");
    tbody.innerHTML = '';

    data.forEach(p => {
      const fila = document.createElement('tr');
      console.log("data: ",p.id);
      fila.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombre_lote}</td>
        <td>${p.nombre}</td>
        <td>${p.precio}</td>
        <td>${p.cantidad_disponible}</td>
        <td>${new Date(p.fecha_ingreso).toLocaleDateString()}</td>
        <td>
          <button onclick="abrirModalCantidadCarrito(${p.id}, '${p.nombre}')">Añadir al carrito</button>
        </td>
      `;
      tbody.appendChild(fila);
    });

    // actualizar estado inicial del carrito
    await actualizarCarritoCount();
  } catch (err) {
    mostrarMensaje("Error cargando productos para comprar", true);
    console.error(err);
  }
}

// Abrir modal cantidad
function abrirModalCantidadCarrito(id, nombre) {
  document.getElementById("productoIdCarrito").value = id;
  document.getElementById("productoNombreCarrito").innerText = `Producto: ${nombre}`;
  document.getElementById("cantidadProductoCarrito").value = 1;
  document.getElementById("modalCantidadCarrito").style.display = "flex";
}
function cerrarModalCantidadCarrito() {
  document.getElementById("modalCantidadCarrito").style.display = "none";
}

// Confirmar añadir al carrito
async function confirmarAgregarCarrito(event) {
  event.preventDefault();
  const id_producto = document.getElementById("productoIdCarrito").value;
  const cantidad = document.getElementById("cantidadProductoCarrito").value;

  const res = await callBackend('POST', 'http://localhost:3000/cart', {
    id_producto,
    cantidad
  });

  if (res && !res.error) {
    mostrarMensaje("Producto añadido al carrito", false);
    cerrarModalCantidadCarrito();
    await actualizarCarritoCount();
  } else {
    mostrarMensaje(res.error || "Error al añadir al carrito", true);
  }
}

// Actualizar contador del carrito
async function actualizarCarritoCount() {
  const res = await callBackend('GET', 'http://localhost:3000/cart');
  if (res && res.productos) {
    carritoCount = res.productos.length;
    document.getElementById("btnVerCarrito").innerText = `Comprar (${carritoCount})`;
  }
}

// Abrir modal carrito completo
async function abrirCarrito() {
  const res = await callBackend('GET', 'http://localhost:3000/cart');
  if (!res || !res.productos) {
    mostrarMensaje("Error cargando carrito", true);
    return;
  }

  const tbody = document.querySelector("#tablaCarrito tbody");
  tbody.innerHTML = '';

  res.productos.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre_lote}</td>
      <td>${p.nombre}</td>
      <td>${p.precio_unitario}</td>
      <td>${p.cantidad}</td>
      <td><button onclick="eliminarProductoCarrito(${p.id})">Eliminar</button></td>
    `;
    tbody.appendChild(fila);
  });

  document.getElementById("modalCarrito").style.display = "flex";
}
function cerrarModalCarrito() {
  document.getElementById("modalCarrito").style.display = "none";
}

// Eliminar producto del carrito
async function eliminarProductoCarrito(id_producto) {
  const res = await callBackend('DELETE', `http://localhost:3000/cart/${id_producto}`);
  if (res && !res.error) {
    mostrarMensaje("Producto eliminado del carrito", false);
    abrirCarrito(); // recargar modal
    actualizarCarritoCount();
  } else {
    mostrarMensaje(res.error || "Error al eliminar producto", true);
  }
}

// Limpiar todo el carrito
async function limpiarCarrito() {
  if (!confirm("¿Seguro que deseas limpiar el carrito?")) return;

  const res = await callBackend('DELETE', 'http://localhost:3000/cart');
  if (res && !res.error) {
    mostrarMensaje("Carrito limpiado", false);
    actualizarCarritoCount();
  } else {
    mostrarMensaje(res.error || "Error al limpiar carrito", true);
  }
}

// Confirmar compra
async function confirmarCompra() {
  const res = await callBackend('POST', 'http://localhost:3000/cart/buy');
  if (res && !res.error) {
    mostrarMensaje("Compra realizada con éxito", false);
    cerrarModalCarrito();
    actualizarCarritoCount();
    cargarProductosCompra(); // recargar stock
  } else {
    mostrarMensaje(res.error || "Error al realizar compra", true);
  }
}
