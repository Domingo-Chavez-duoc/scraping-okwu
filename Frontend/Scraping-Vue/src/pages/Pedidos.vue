<script setup>
import { ref, onMounted } from 'vue'
import { obtenerPedidos, crearPedidoAPI, eliminarPedidoAPI } from '@/api/productos.js'

const pedidos = ref([])
const clienteNuevo = ref('')
const totalNuevo = ref('') // Cambiado a string temporal para que el placeholder se vea limpio
const cargando = ref(true)
const nombreUsuario = localStorage.getItem('user_name') || 'Usuario'

const errorApi = ref('')
const statusError = ref(false)

const cargarPedidosDelSistema = async () => {
  errorApi.value = ''
  statusError.value = false
  cargando.value = true

  try {
    pedidos.value = await obtenerPedidos()
  } catch (error) {
    console.error(error)
    errorApi.value = "Conexión a base de datos rechazada."
    statusError.value = true
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarPedidosDelSistema()
})

const ejecutarAltaPedido = async () => {
  if (!clienteNuevo.value || !totalNuevo.value || totalNuevo.value <= 0) return
  
  try {
    const nuevoPedido = { cliente: clienteNuevo.value, total: Number(totalNuevo.value) }
    const guardado = await crearPedidoAPI(nuevoPedido)
    pedidos.value.push(guardado)
    clienteNuevo.value = ''
    totalNuevo.value = ''
  } catch (error) {
    alert("Error de integridad: El microservicio no respondió.");
  }
}

const ejecutarBajaPedido = async (id) => {
  try {
    await eliminarPedidoAPI(id)
    pedidos.value = pedidos.value.filter(p => p.id !== id)
  } catch (error) {
    alert("Operación denegada. Verifique la conexión.");
  }
}
</script>

<template>
  <div class="layout-container">
    <header class="top-nav">
      <div class="brand">eCommerce-X</div>
      <nav class="nav-links">
        <router-link to="/inventario">Inventario</router-link>
        <router-link to="/pedidos" class="active">Pedidos</router-link>
      </nav>
      
      <div class="user-controls">
        <span class="user-name">{{ nombreUsuario }}</span>
        <button @click="cerrarSesion" class="btn-outline">SALIR</button>
      </div>
    </header>

    <main class="main-content">
      <div class="page-header">
        <h1 class="page-title">Gestión de Pedidos</h1>
        <p class="page-subtitle">Módulo CRUD conectado a PostgreSQL</p>
      </div>

      <div v-if="statusError" class="alert-box">
        <div class="alert-text"><strong>SISTEMA OFFLINE:</strong> {{ errorApi }}</div>
        <button @click="cargarPedidosDelSistema" class="btn-solid">REINTENTAR</button>
      </div>

      <div class="form-section">
        <h3 class="section-title">Nuevo Registro</h3>
        <div class="bw-form-row">
          <input 
            v-model="clienteNuevo" 
            type="text" 
            class="bw-input" 
            placeholder="Nombre completo del cliente" 
            :disabled="statusError" 
          />
          <input 
            v-model="totalNuevo" 
            type="number" 
            class="bw-input" 
            placeholder="Total facturado (Ej: 15990)" 
            :disabled="statusError" 
          />
          <button @click="ejecutarAltaPedido" class="btn-solid" :disabled="statusError">CREAR PEDIDO</button>
        </div>
      </div>

      <div class="table-section">
        <h3 class="section-title">Historial de Transacciones</h3>
        <div v-if="cargando" class="loading-state">Leyendo registros...</div>
        
        <div class="table-container" v-else>
          <table class="bw-table">
            <thead>
              <tr>
                <th>ID Orden</th>
                <th>Cliente</th>
                <th>Total</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pedidos.length === 0 && !statusError">
                <td colspan="4" class="empty-state">No existen transacciones registradas.</td>
              </tr>
              <tr v-for="pedido in pedidos" :key="pedido.id">
                <td><strong>#{{ pedido.id }}</strong></td>
                <td>{{ pedido.cliente }}</td>
                <td>${{ pedido.total }}</td>
                <td style="text-align: right;">
                  <button @click="ejecutarBajaPedido(pedido.id)" class="btn-outline">ELIMINAR</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* HERENCIA DE ESTILOS GLOBALES (Mismo Layout) */
.layout-container { font-family: 'Helvetica Neue', Arial, sans-serif; min-height: 100vh; background: #fafafa; color: #000; }
.top-nav { display: flex; justify-content: space-between; align-items: center; padding: 0 40px; height: 70px; background: #fff; border-bottom: 1px solid #eaeaea; }
.brand { font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
.nav-links { display: flex; gap: 30px; }
.nav-links a { text-decoration: none; color: #999; font-weight: 500; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; }
.nav-links a:hover { color: #000; }
.nav-links a.active { color: #000; font-weight: 700; border-bottom: 2px solid #000; padding-bottom: 24px; }
.user-controls { display: flex; align-items: center; gap: 20px; }
.user-name { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #555; }
.main-content { padding: 40px; max-width: 1000px; margin: 0 auto; }
.page-header { margin-bottom: 40px; }
.page-title { font-size: 2rem; font-weight: 700; margin: 0 0 5px 0; letter-spacing: -0.5px; }
.page-subtitle { color: #666; font-size: 0.95rem; margin: 0; }

/* BOTONES */
.btn-outline { background: transparent; border: 1px solid #000; color: #000; padding: 6px 12px; font-size: 0.7rem; font-weight: bold; letter-spacing: 1px; cursor: pointer; transition: 0.3s; }
.btn-outline:hover { background: #000; color: #fff; }
.btn-solid { background: #000; border: 1px solid #000; color: #fff; padding: 10px 20px; font-size: 0.75rem; font-weight: bold; letter-spacing: 1px; cursor: pointer; transition: 0.3s; white-space: nowrap; }
.btn-solid:hover:not(:disabled) { background: transparent; color: #000; }
.btn-solid:disabled { background: #ccc; border-color: #ccc; cursor: not-allowed; }

/* ALERTAS Y ESTADOS */
.alert-box { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border: 2px solid #000; background: #fff; margin-bottom: 30px; }
.loading-state { padding: 20px 0; color: #666; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }

/* FORMULARIO CRUD B&W */
.form-section { background: #fff; padding: 30px; border: 1px solid #eaeaea; margin-bottom: 40px; }
.section-title { margin: 0 0 20px 0; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #000; display: inline-block; padding-bottom: 5px;}
.bw-form-row { display: flex; gap: 15px; align-items: center; }
.bw-input { flex: 1; padding: 12px 15px; font-size: 0.9rem; border: 1px solid #ddd; outline: none; transition: 0.3s; background: #fafafa; }
.bw-input:focus { border-color: #000; background: #fff; }
.bw-input:disabled { background: #f0f0f0; cursor: not-allowed; }

/* TABLA MINIMALISTA */
.table-section { margin-top: 20px; }
.table-container { background: #fff; border: 1px solid #eaeaea; }
.bw-table { width: 100%; border-collapse: collapse; text-align: left; }
.bw-table th { border-bottom: 2px solid #000; padding: 15px 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.bw-table td { border-bottom: 1px solid #f0f0f0; padding: 15px 20px; font-size: 0.95rem; color: #333; }
.bw-table tbody tr:hover { background-color: #fafafa; }
.empty-state { text-align: center; padding: 40px; color: #999; }
</style>