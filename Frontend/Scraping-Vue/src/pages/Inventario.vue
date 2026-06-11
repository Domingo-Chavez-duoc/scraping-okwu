<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerProductos } from '@/api/productos.js'

const router = useRouter()
const productos = ref([])
const cargando = ref(true)
const errorApi = ref('')
const nombreUsuario = localStorage.getItem('user_name') || 'Usuario'
const statusError = ref(false)

const cargarInventario = async () => {
  errorApi.value = ''
  statusError.value = false
  cargando.value = true
  
  try {
    productos.value = await obtenerProductos()
  } catch (error) {
    errorApi.value = 'Error al conectar con el microservicio de inventario.'
    statusError.value = true
    console.error(error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarInventario()
})

const cerrarSesion = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<template>
  <div class="layout-container">
    <header class="top-nav">
      <div class="brand">eCommerce-X</div>
      <nav class="nav-links">
        <router-link to="/inventario" class="active">Inventario</router-link>
        <router-link to="/pedidos">Pedidos</router-link>
      </nav>
      <div class="user-controls">
        <span class="user-name">{{ nombreUsuario }}</span>
        <button @click="cerrarSesion" class="btn-outline">SALIR</button>
      </div>
    </header>

    <main class="main-content">
      <div class="page-header">
        <h1 class="page-title">Control de Inventario</h1>
        <p class="page-subtitle">Sincronización en tiempo real vía Web Scraping</p>
      </div>

      <div v-if="statusError" class="alert-box">
        <div class="alert-text"><strong>SISTEMA OFFLINE:</strong> {{ errorApi }}</div>
        <button @click="cargarInventario" class="btn-solid">REINTENTAR</button>
      </div>

      <div v-if="cargando" class="loading-state">
        <span class="spinner"></span> Sincronizando datos...
      </div>

      <div class="table-container" v-else>
        <table class="bw-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Detalle</th>
              <th>Precio Reg.</th>
              <th>Oferta</th>
              <th>Variantes</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="productos.length === 0 && !statusError">
              <td colspan="6" class="empty-state">No hay registros en el catálogo actual.</td>
            </tr>
            <tr v-for="(prod, index) in productos" :key="index">
              <td>
                <img :src="prod.url_imagen || 'https://via.placeholder.com/50'" class="product-img" alt="img" />
              </td>
              <td><strong>{{ prod.nombre }}</strong></td>
              <td>${{ prod.precio_regular }}</td>
              <td>{{ prod.precio_oferta ? '$' + prod.precio_oferta : '-' }}</td>
              <td>{{ prod.variantes }}</td>
              <td>
                <span :class="prod.disponibilidad_stock ? 'status-ok' : 'status-bad'">
                  {{ prod.disponibilidad_stock ? 'DISPONIBLE' : 'AGOTADO' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* CONTENEDOR PRINCIPAL */
.layout-container { font-family: 'Helvetica Neue', Arial, sans-serif; min-height: 100vh; background: #fafafa; color: #000; }

/* NAVBAR B&W */
.top-nav { display: flex; justify-content: space-between; align-items: center; padding: 0 40px; height: 70px; background: #fff; border-bottom: 1px solid #eaeaea; }
.brand { font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
.nav-links { display: flex; gap: 30px; }
.nav-links a { text-decoration: none; color: #999; font-weight: 500; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s; }
.nav-links a:hover { color: #000; }
.nav-links a.active { color: #000; font-weight: 700; border-bottom: 2px solid #000; padding-bottom: 24px; }
.user-controls { display: flex; align-items: center; gap: 20px; }
.user-name { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #555; }

/* CONTENIDO */
.main-content { padding: 40px; max-width: 1200px; margin: 0 auto; }
.page-header { margin-bottom: 30px; }
.page-title { font-size: 2rem; font-weight: 700; margin: 0 0 5px 0; letter-spacing: -0.5px; }
.page-subtitle { color: #666; font-size: 0.95rem; margin: 0; }

/* BOTONES */
.btn-outline { background: transparent; border: 1px solid #000; color: #000; padding: 6px 15px; font-size: 0.75rem; font-weight: bold; cursor: pointer; transition: 0.3s; }
.btn-outline:hover { background: #000; color: #fff; }
.btn-solid { background: #000; border: 1px solid #000; color: #fff; padding: 8px 16px; font-size: 0.75rem; font-weight: bold; cursor: pointer; transition: 0.3s; }
.btn-solid:hover { background: transparent; color: #000; }

/* ALERTAS Y ESTADOS */
.alert-box { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border: 2px solid #000; background: #fff; margin-bottom: 20px; }
.loading-state { text-align: center; padding: 40px; color: #666; font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase; }

/* TABLA MINIMALISTA */
.table-container { background: #fff; border: 1px solid #eaeaea; }
.bw-table { width: 100%; border-collapse: collapse; text-align: left; }
.bw-table th { border-bottom: 2px solid #000; padding: 15px 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #000; }
.bw-table td { border-bottom: 1px solid #f0f0f0; padding: 15px 20px; font-size: 0.9rem; color: #333; vertical-align: middle; }
.bw-table tbody tr:hover { background-color: #fafafa; }
.empty-state { text-align: center; padding: 40px; color: #999; }
.product-img { object-fit: cover; border-radius: 2px; border: 1px solid #eaeaea; }

/* BADGES (Estados B&W) */
.status-ok { font-size: 0.7rem; font-weight: bold; border: 1px solid #000; padding: 4px 8px; border-radius: 12px; }
.status-bad { font-size: 0.7rem; font-weight: bold; background: #000; color: #fff; padding: 4px 8px; border-radius: 12px; }
</style>