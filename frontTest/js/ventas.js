async function cargarVentas() {
  try {
    const data = await callBackend('GET', 'http://localhost:3000/buy/list/clients');
    const tbody = document.querySelector("#tablaCompras tbody");
    tbody.innerHTML = '';
    if(data && data.historial)
    data.historial.forEach(c => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${c.id_compra}</td>
        <td>${c.cliente.nombre_login} (${c.cliente.nombre || '-'})</td>
        <td>${c.cliente.correo || '-'}</td>
        <td>${c.cliente.telefono || '-'}</td>
        <td>${new Date(c.fecha_compra).toLocaleString()}</td>
        <td>${c.precio_total}</td>
        <td>${c.cantidad_total_productos}</td>
        <td>
          <button onclick='verDetalleCompra(${JSON.stringify(JSON.stringify(c))})'>
            Ver Detalle
          </button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    mostrarMensaje("Error cargando compras", true);
    console.error(err);
  }
}

function verDetalleCompra(compraStr) {
  const compra = JSON.parse(compraStr);

  // Info principal de la compra
  const infoDiv = document.getElementById("infoCompra");
  infoDiv.innerHTML = `
    <p><strong>ID Compra:</strong> ${compra.id_compra}</p>
    <p><strong>Cliente:</strong> ${compra.cliente.nombre_login} (${compra.cliente.nombre || '-'})</p>
    <p><strong>Correo:</strong> ${compra.cliente.correo || '-'}</p>
    <p><strong>Teléfono:</strong> ${compra.cliente.telefono || '-'}</p>
    <p><strong>Fecha:</strong> ${new Date(compra.fecha_compra).toLocaleString()}</p>
    <p><strong>Precio Total:</strong> ${compra.precio_total}</p>
    <p><strong>Cantidad Productos:</strong> ${compra.cantidad_total_productos}</p>
  `;

  // Tabla de productos
  const tbody = document.querySelector("#tablaProductosCompra tbody");
  tbody.innerHTML = '';
  compra.productos.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.id_producto}</td>
      <td>${p.nombre_lote}</td>
      <td>${p.nombre}</td>
      <td>${p.precio_unitario}</td>
      <td>${p.cantidad}</td>
    `;
    tbody.appendChild(fila);
  });

  document.getElementById("modalDetalleCompra").style.display = "flex";
}

function cerrarModalDetalleCompra() {
  document.getElementById("modalDetalleCompra").style.display = "none";
}
