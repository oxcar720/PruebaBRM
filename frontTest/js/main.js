// js/main.js

function getToken(){
    return localStorage.getItem("globalTokenSesion");
}
async function callBackend(metodo, url, body = undefined) {
  try {
    const token = getToken();
    const opciones = {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    };
    if (body) opciones.body = JSON.stringify(body);

    const res = await fetch(url, opciones);
    const data = await res.json();
    if(data.error){
        mostrarMensaje(data.error, true);
        return null;
    }
    return data;
  } catch (error) {
    console.error("Error en callBackend:", error);
    mostrarMensaje(error.mensaje, true);
    return null;
  }
}

// Función general para mostrar mensajes
function mostrarMensaje(mensaje, esError = false, duracion=10000) {
  const div = document.getElementById('mensaje');
  div.textContent = mensaje;
  div.className = esError ? 'mensaje error' : 'mensaje exito';
  setTimeout(()=>{
    div.textContent='';
    div.className='';
  }, duracion)
}

// Función de login
async function login() {
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;

  if (!usuario || !password) {
    mostrarMensaje("Debe ingresar usuario y contraseña", true);
    return;
  }

  const data = await callBackend('POST', 'http://localhost:3000/login', { nombre_login: usuario, password });

  if (data && data.token) {
    localStorage.setItem("globalTokenSesion", data.token);
    localStorage.setItem("usuarioNombre", data.usuario.nombre);
    localStorage.setItem("usuarioRol", data.usuario.rol);
    window.location.href = "/frontTest/gestion/mainGestion.html";
  } else if (data && data.error) {
    mostrarMensaje(data.error, true);
  }
}

async function cargarSeccion(seccion) {
  try {
    async function cargarContenido(url){
        const resp = await fetch(url);
        const html = await resp.text();
        document.getElementById('contenido').innerHTML = html;
    }
    let url = '';
    switch(seccion) {
      case 'usuarios':
        url = './seccionUsuarios.html';
        cargarContenido(url).then(()=>cargarUsuarios());
        break;
      case 'productos':
        url = './seccionProductos.html';
        cargarContenido(url).then(()=>cargarProductos());
        break;
      case 'ventas':
        url = './seccionVentas.html';
        cargarContenido(url).then(()=>cargarVentas());
        break;
      case 'compras':
        url = './seccionCompras.html';
        cargarContenido(url).then(()=>cargarProductosCompra());
        break;
      case 'logs':
        url= './seccionLogs.html';
        cargarContenido(url).then(()=>cargarLogs());
        break;
      default:
        return;
    }
  } catch(err) {
    mostrarMensaje("Error cargando la sección", true);
    console.error(err);
  }
}


window.onload = () => {
  const nombre = localStorage.getItem("usuarioNombre");
  const rol = localStorage.getItem("usuarioRol");
  const token = getToken();
  const pagina = window.location.pathname;

  const esPaginaLogin = pagina.endsWith("/index.html") || pagina.endsWith("/frontTest/") || pagina.endsWith("/frontTest");

  if (token && nombre && rol) {
    if (esPaginaLogin) {
      window.location.href = "/frontTest/gestion/mainGestion.html";
      return;
    }
    const infoUsuario = document.getElementById("info-usuario");
    if (infoUsuario) {
      infoUsuario.innerHTML = `
        Usuario: ${nombre} | Tipo: ${rol}
        <button id="logoutBtn" style="margin-left:10px;">Cerrar sesión</button>
      `;
      document.getElementById("logoutBtn").onclick = logout;
    }
  } else {
    if (!esPaginaLogin) {
      window.location.href = "/frontTest/index.html";
    }
  }
};

function logout() {
  localStorage.removeItem("usuarioNombre");
  localStorage.removeItem("usuarioRol");
  localStorage.removeItem("tokenSesion"); // si lo guardas así
  globalTokenSesion = null;
  window.location.href = "/frontTest/index.html";
}
