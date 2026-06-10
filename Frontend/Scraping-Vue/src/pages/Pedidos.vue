<script setup>
import { ref, onMounted } from 'vue'
import { obtenerPedidos, crearPedidoAPI, eliminarPedidoAPI } from '@/api/productos.js' // 👈 Ruta corregida

const pedidos = ref([])
const clienteNuevo = ref('')
const totalNuevo = ref(0)
const cargando = ref(true)
const nombreUsuario = localStorage.getItem('user_name') || 'Usuario'

const cargarPedidosDelSistema = async () => {
  try {
    pedidos.value = await obtenerPedidos()
  } catch (error) {
    console.error("Error al traer pedidos desde el backend", error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarPedidosDelSistema()
})

const ejecutarAltaPedido = async () => {
  if (!clienteNuevo.value || totalNuevo.value <= 0) return
  
  try {
    const nuevoPedido = { cliente: clienteNuevo.value, total: totalNuevo.value }
    const guardado = await crearPedidoAPI(nuevoPedido)
    pedidos.value.push(guardado) // Agrega a la vista el objeto que el backend insertó en PostgreSQL
    clienteNuevo.value = ''
    totalNuevo.value = 0
  } catch (error) {
    alert("No se pudo registrar el pedido en el backend");
  }
}

const ejecutarBajaPedido = async (id) => {
  try {
    await eliminarPedidoAPI(id)
    pedidos.value = pedidos.value.filter(p => p.id !== id) // Remueve de la tabla visual
  } catch (error) {
    alert("Error al intentar eliminar el registro en el backend");
  }
}
</script>