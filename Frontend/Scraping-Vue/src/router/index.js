import { createRouter, createWebHistory } from 'vue-router'

// 1. Definición de las rutas de la aplicación
const routes = [
  {
    path: '/',
    redirect: '/login' // Redirecciona la raíz automáticamente al Login
  },
  {
    path: '/login',
    name: 'Login',
    // Carga el componente Login.vue que ya tienes creado en tu carpeta pages
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/inventario',
    name: 'Inventario',
    // Aquí mostrarás el catálogo que consume los datos de scraping del backend (/api/productos)
    component: () => import('../pages/Inventario.vue')
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    // Aquí irá la interfaz para la gestión del CRUD de pedidos solicitado
    component: () => import('../pages/Pedidos.vue')
  },
  {
    // Ruta comodín (Catch-all) por si escriben una URL que no existe (Error 404)
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

// 2. Creación de la instancia del router
const router = createRouter({
  // Usamos el historial web nativo de HTML5
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 3. Guard de Navegación (Opcional pero recomendado para el requerimiento de Autenticación)
// Este guard evita que usuarios no autenticados entren a 'inventario' o 'pedidos'.
router.beforeEach((to, from, next) => {
  // Aquí puedes verificar si existe un token en el localStorage o en tu estado global
  const isAuthenticated = !!localStorage.getItem('user_token') 

  // Si la ruta requiere estar dentro del sistema y no está autenticado, al login
  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next() // Permite continuar la navegación
  }
})

export default router