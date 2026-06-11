const API_URL = "http://localhost:8000/api"; // Ajustar al puerto del FastAPI

// --- MÓDULO DE AUTENTICACIÓN ---
export async function loginUsuario(email, password) {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!respuesta.ok) throw new Error("Credenciales inválidas o error de servidor");
  return await respuesta.json(); // Espera el Token y los datos del Usuario
}

// --- MÓDULO DE INVENTARIO (Scraping Normalizado) ---
export async function obtenerProductos() {
  const respuesta = await fetch(`${API_URL}/productos`);
  if (!respuesta.ok) throw new Error("Error al obtener el catálogo");
  return await respuesta.json(); // Retorna el array de productos normalizados
}

// --- MÓDULO DE PEDIDOS (CRUD) ---
export async function obtenerPedidos() {
  const respuesta = await fetch(`${API_URL}/pedidos`);
  if (!respuesta.ok) throw new Error("Error al cargar pedidos");
  return await respuesta.json();
}

export async function crearPedidoAPI(pedido) {
  const respuesta = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
  });
  return await respuesta.json();
}

export async function eliminarPedidoAPI(id) {
  const respuesta = await fetch(`${API_URL}/pedidos/${id}`, {
    method: 'DELETE'
  });
  return respuesta.ok;
}