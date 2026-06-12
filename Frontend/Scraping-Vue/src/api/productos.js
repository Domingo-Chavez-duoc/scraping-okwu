import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // URL del FastAPI
  headers: {
    'Content-Type': 'application/json'
  }
})

// --- SERVICIO DE AUTENTICACIÓN REAL (CON MOCK INCLUIDO) ---
export const loginUsuarioAPI = async (email, password) => {
  
  // Usuario Mock para pruebas de Frontend
  if (email === 'mock@ecommerce.com' && password === '1234') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: "token_falso_de_prueba_jwt",
          user: {
            id: 999,
            email: "mock@ecommerce.com",
            full_name: "Usuario Frontend", // Este nombre aparecerá arriba a la derecha
            role: "admin",
            is_active: true,
            created_at: "2026-06-10T12:00:00Z"
          }
        })
      }, 800) // Simulamos 800ms de latencia de red
    })
  }

  // CÓDIGO REAL PARA CUANDO EL BACKEND ESTÉ LISTO
  try {
    const respuesta = await API.post('/auth/login', { email, password })
    return respuesta.data 
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || "Error en las credenciales")
    }
    throw new Error("No hay conexión con el servidor backend")
  }
}

// --- MÓDULO DE INVENTARIO ---
export const obtenerProductos = async () => {
  const respuesta = await API.get('/productos')
  return respuesta.data 
}

// --- MÓDULO DE PEDIDOS (CRUD) ---
export const obtenerPedidos = async () => {
  const respuesta = await API.get('/pedidos')
  return respuesta.data
}

export const crearPedidoAPI = async (nuevoPedido) => {
  const respuesta = await API.post('/pedidos', nuevoPedido)
  return respuesta.data
}

export const eliminarPedidoAPI = async (id) => {
  const respuesta = await API.delete(`/pedidos/${id}`)
  return respuesta.data
}