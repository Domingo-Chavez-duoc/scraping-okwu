<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUsuarioAPI } from '@/api/productos.js'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const statusError = ref(false)
const cargando = ref(false)

const manejarLogin = async () => {
  errorMsg.value = ''
  statusError.value = false
  cargando.value = true
  
  try {
    const data = await loginUsuarioAPI(email.value, password.value)
    
    if (data.user && data.user.is_active) {
      localStorage.setItem('user_token', data.token)
      localStorage.setItem('user_id', data.user.id)
      localStorage.setItem('user_email', data.user.email)
      localStorage.setItem('user_name', data.user.full_name)
      localStorage.setItem('user_role', data.user.role)
      localStorage.setItem('user_created_at', data.user.created_at)
      
      router.push('/inventario')
    } else if (data.user && !data.user.is_active) {
      errorMsg.value = 'El usuario se encuentra inactivo en el sistema.'
    }
    
  } catch (error) {
    errorMsg.value = error.message
    if (error.message.includes("conexión") || error.message.includes("Network")) {
      statusError.value = true
    }
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="split-layout">
    
    <div class="video-container">
      <video autoplay loop muted playsinline class="bg-video">
        <source  src="/204306-923909642.mp4" type="video/mp4">
        Tu navegador no soporta videos.
      </video>
      <div class="video-overlay">
        <h1 class="brand-title">eCommerce-X</h1>
        <p class="brand-subtitle">Portal de Gestión Integrada</p>
      </div>
    </div>

    <div class="form-container">
      <div class="login-wrapper">
        <h2>Bienvenido</h2>
        <p class="instruction">Ingresa tus credenciales para acceder al sistema.</p>

        <div v-if="statusError" class="alert-box critical">
          <strong>Backend Inactivo:</strong> Verifica que FastAPI esté corriendo para conectar al servidor.
        </div>

        <form @submit.prevent="manejarLogin" class="bw-form">
          <div class="input-group">
            <input 
              v-model="email" 
              type="email" 
              id="email" 
              required 
              placeholder=" " 
            />
            <label for="email">Correo Electrónico</label>
          </div>
          
          <div class="input-group">
            <input 
              v-model="password" 
              type="password" 
              id="password" 
              required 
              placeholder=" " 
            />
            <label for="password">Contraseña</label>
          </div>
          
          <div v-if="errorMsg && !statusError" class="alert-box error">
            {{ errorMsg }}
          </div>
          
          <button type="submit" :disabled="cargando || statusError" class="btn-submit">
            {{ cargando ? 'VERIFICANDO...' : 'INICIAR SESIÓN' }}
          </button>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* RESET Y LAYOUT PRINCIPAL */
.split-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  /* Ignora márgenes globales de Vite si los hay */
  position: absolute; 
  top: 0; 
  left: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* =========================================
   MITAD IZQUIERDA (VIDEO)
   ========================================= */
.video-container {
  flex: 1;
  position: relative;
  background-color: #000;
  overflow: hidden;
  /* En pantallas pequeñas, el video desaparece para dejar solo el login */
}

.bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translateX(-50%) translateY(-50%);
  object-fit: cover;
  opacity: 0.6; /* Oscurece un poco el video para que resalte el texto */
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  z-index: 2;
}

.brand-title {
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -2px;
  margin: 0;
}

.brand-subtitle {
  font-size: 1.2rem;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 10px;
}

/* =========================================
   MITAD DERECHA (FORMULARIO)
   ========================================= */
.form-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  color: #000;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 40px;
}

.login-wrapper h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  letter-spacing: -1px;
}

.instruction {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 40px;
}

.bw-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Inputs de estilo minimalista (solo línea inferior) */
.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 10px 0;
  font-size: 1rem;
  color: #000;
  border: none;
  border-bottom: 2px solid #ddd;
  outline: none;
  background: transparent;
  transition: border-color 0.3s ease;
}

.input-group label {
  position: absolute;
  top: 10px;
  left: 0;
  font-size: 1rem;
  color: #999;
  pointer-events: none;
  transition: 0.3s ease all;
}

/* Animación del Label cuando el input está enfocado o tiene texto */
.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  top: -20px;
  font-size: 0.8rem;
  color: #000;
  font-weight: bold;
}

.input-group input:focus {
  border-bottom: 2px solid #000;
}

/* Botón Blanco y Negro */
.btn-submit {
  margin-top: 20px;
  width: 100%;
  padding: 15px;
  background-color: #000;
  color: #fff;
  border: 2px solid #000;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  background-color: #fff;
  color: #000;
}

.btn-submit:disabled {
  background-color: #ccc;
  border-color: #ccc;
  color: #fff;
  cursor: not-allowed;
}

/* Alertas adaptadas al diseño B&W */
.alert-box {
  padding: 15px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  border-left: 4px solid;
}
.alert-box.critical { background-color: #f9f9f9; border-color: #000; color: #000; }
.alert-box.error { background-color: #f9f9f9; border-color: #000; color: #000; }

/* Responsive: Apilar en pantallas pequeñas */
@media (max-width: 768px) {
  .split-layout { flex-direction: column; }
  .video-container { display: none; /* Oculta el video en móviles para ahorrar espacio */ }
}
</style>