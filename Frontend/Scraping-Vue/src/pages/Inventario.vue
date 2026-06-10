<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerProductos } from '@/api/productos.js' // 👈 Ruta corregida a tu archivo real

const router = useRouter()
const productos = ref([])
const cargando = ref(true)
const errorApi = ref('')
const nombreUsuario = localStorage.getItem('user_name') || 'Usuario'

onMounted(async () => {
  try {
    // Axios maneja la respuesta directamente en .data, que ya procesamos en productos.js
    productos.value = await obtenerProductos()
  } catch (error) {
    errorApi.value = 'Error al conectar con el microservicio de inventario.'
    console.error(error)
  } finally {
    cargando.value = false
  }
})

const cerrarSesion = () => {
  localStorage.clear()
  router.push('/login')
}
</script>