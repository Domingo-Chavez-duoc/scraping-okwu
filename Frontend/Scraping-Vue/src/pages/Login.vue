<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUsuarioAPI } from '@/api/productos.js' // Consumiendo desde tu archivo real

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const cargando = ref(false)

const manejarLogin = async () => {
  errorMsg.value = ''
  cargando.value = true
  
  try {
    // Enviamos los datos al backend a través de Axios
    const data = await loginUsuarioAPI(email.value, password.value)
    
    // Suponiendo que el backend responde con la estructura:
    // data.token -> El string del token JWT o de sesión
    // data.user  -> El objeto con: id, email, full_name, role, is_active, created_at
    
    if (data.user && data.user.is_active) {
      // Guardamos el token para los Guards de ruta
      localStorage.setItem('user_token', data.token)
      
      // Guardamos los datos del usuario mapeados exactamente como me los pasaste
      localStorage.setItem('user_id', data.user.id)
      localStorage.setItem('user_email', data.user.email)
      localStorage.setItem('user_name', data.user.full_name)
      localStorage.setItem('user_role', data.user.role)
      localStorage.setItem('user_created_at', data.user.created_at)
      
      // Navegación fluida al Inventario tras el éxito
      router.push('/inventario')
    } else if (data.user && !data.user.is_active) {
      errorMsg.value = 'El usuario se encuentra inactivo en el sistema.'
    }
    
  } catch (error) {
    // Captura el mensaje enviado por el throw de Axios
    errorMsg.value = error.message
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h2>eCommerce-X</h2>
      <p class="subtitle">Portal de Gestión Integrada</p>
      
      <form @submit.prevent="manejarLogin">
        <div class="form-group">
          <label>Email de Usuario:</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="correo@ecommerce.com" 
            required 
          />
        </div>
        
        <div class="form-group">
          <label>Contraseña:</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>
        
        <p v-if="errorMsg" class="error-box">{{ errorMsg }}</p>
        
        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Verificando Usuario...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.login-card {
  background: #2c3e50;
  color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 380px;
}
h2 { margin-bottom: 5px; text-align: center; color: #42b883; }
.subtitle { text-align: center; color: #bdc3c7; font-size: 14px; margin-bottom: 25px; }
.form-group { margin-bottom: 20px; display: flex; flex-direction: column; }
label { margin-bottom: 8px; font-size: 13px; color: #ecf0f1; }
input {
  padding: 12px;
  background: #34495e;
  border: 1px solid #455a64;
  color: white;
  border-radius: 6px;
  font-size: 14px;
}
input:focus { border-color: #42b883; outline: none; }
button {
  width: 100%;
  padding: 12px;
  background: #42b883;
  border: none;
  color: #2c3e50;
  font-weight: bold;
  font-size: 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover { background: #33a06f; }
button:disabled { background: #7f8c8d; cursor: not-allowed; color: #bdc3c7; }
.error-box {
  background: #e74c3c;
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
  margin-bottom: 15px;
}
</style>