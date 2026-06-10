import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // URL del FastAPI de tu compañero
  headers: {
    'Content-Type': 'application/json'
  }
})

// --- SERVICIO DE AUTENTICACIÓN REAL ---
export const loginUsuarioAPI = async (email, password) => {
  try {
    const respuesta = await API.post('/auth/login', { email, password })
    // El backend debería retornar algo como: { token: "...", user: { id, email, full_name, role, ... } }
    return respuesta.data 
  } catch (error) {
    // Manejo de errores específicos de Axios
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || "Error en las credenciales")
    }
    throw new Error("No hay conexión con el servidor backend")
  }
}

// ... (aquí mantienes tus otras funciones de obtenerProductos, obtenerPedidos, etc.)