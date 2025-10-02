
async function cargarUsuarios() {
  try {
    const data = await callBackend('GET', 'http://localhost:3000/users');
    const tbody = document.querySelector("#tablaUsuarios tbody");
    tbody.innerHTML = '';
    if(data)
        data.forEach(u => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${u.id}</td>
            <td>${u.nombre_login}</td>
            <td>${u.nombre || ''}</td>
            <td>${u.correo || ''}</td>
            <td>${u.telefono || ''}</td>
            <td>${u.rolUsuario?.nombre || u.rol_id}</td>
            <td>
            <button onclick="actualizarUsuario(${u.id})">Actualizar</button>
            <button onclick="eliminarUsuario(${u.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
        });
  } catch (err) {
    mostrarMensaje("Error cargando usuarios", true);
    console.error(err);
  }
}

async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

  try {
    const resp = await callBackend('DELETE', `http://localhost:3000/user/${id}`);
    
    if (resp && !resp.error) {
      mostrarMensaje("Usuario eliminado correctamente", false);
      cargarUsuarios();
    } else {
      mostrarMensaje(resp.error || "Error eliminando usuario", true);
    }
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    mostrarMensaje("Error eliminando usuario", true);
  }
}

function crearUsuario() {
  document.getElementById("modalCrearUsuario").style.display = "flex";
}

function cerrarModalCrearUsuario() {
  document.getElementById("modalCrearUsuario").style.display = "none";
}

async function guardarNuevoUsuario(event) {
  event.preventDefault();

  const usuario = {
    nombre_login: document.getElementById("nuevoLogin").value.trim(),
    password: document.getElementById("nuevoPassword").value,
    nombre: document.getElementById("nuevoNombre").value.trim(),
    correo: document.getElementById("nuevoCorreo").value.trim(),
    telefono: document.getElementById("nuevoTelefono").value.trim(),
    rol_id: parseInt(document.getElementById("nuevoRol").value)
  };

  try {
    const resp = await callBackend("POST", "http://localhost:3000/create_user", usuario);
    if (resp && !resp.error) {
      mostrarMensaje("Usuario creado con éxito", false);
      cerrarModalCrearUsuario();
      cargarUsuarios(); // refrescar tabla
    } else {
      mostrarMensaje(resp.error || "Error creando usuario", true);
    }
  } catch (err) {
    console.error("Error creando usuario:", err);
    mostrarMensaje("Error creando usuario", true);
  }
}

function actualizarUsuario(id) {
  const tbody = document.querySelector("#tablaUsuarios tbody");
  const filas = tbody.querySelectorAll("tr");
  let usuario = null;

  filas.forEach(f => {
    if (parseInt(f.children[0].innerText) === id) {
      usuario = {
        id: id,
        login: f.children[1].innerText,
        nombre: f.children[2].innerText,
        correo: f.children[3].innerText,
        telefono: f.children[4].innerText,
        rol: f.children[5].innerText
      };
    }
  });

  if (!usuario) {
    mostrarMensaje("No se encontró el usuario en la tabla", true);
    return;
  }

  document.getElementById("editId").value = usuario.id;
  document.getElementById("editLogin").value = usuario.login;
  document.getElementById("editNombre").value = usuario.nombre;
  document.getElementById("editCorreo").value = usuario.correo;
  document.getElementById("editTelefono").value = usuario.telefono;

  const selectRol = document.getElementById("editRol");
  if (usuario.rol.toLowerCase() === "admin") {
    selectRol.value = "1";
  } else if (usuario.rol.toLowerCase() === "cliente") {
    selectRol.value = "2";
  } else {
    selectRol.value = usuario.rol;
  }

  document.getElementById("modalActualizarUsuario").style.display = "flex";
}


function cerrarModalActualizarUsuario() {
  document.getElementById("modalActualizarUsuario").style.display = "none";
}

async function guardarUsuarioActualizado(event) {
  event.preventDefault();

  const id = document.getElementById("editId").value;
  const usuario = {
    nombre_login: document.getElementById("editLogin").value.trim(),
    nombre: document.getElementById("editNombre").value.trim(),
    correo: document.getElementById("editCorreo").value.trim(),
    telefono: document.getElementById("editTelefono").value.trim(),
    rol_id: parseInt(document.getElementById("editRol").value)
  };

  try {
    const resp = await callBackend("PUT", `http://localhost:3000/user/${id}`, usuario);
    if (resp && !resp.error) {
      mostrarMensaje("Usuario actualizado con éxito", false);
      cerrarModalActualizarUsuario();
      cargarUsuarios(); // refrescar tabla
    } else {
      mostrarMensaje(resp.error || "Error actualizando usuario", true);
    }
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    mostrarMensaje("Error actualizando usuario", true);
  }
}