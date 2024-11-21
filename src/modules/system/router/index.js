import routerUsuarios from '../modules/usuarios/router'
import routerAulas from '../modules/aulas/router'

export default {
    name: 'home',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: 'principal',
            path: '/',
            component: () => import('../views/Home.vue')
        },
        {
            name: 'usuarios',
            path: '/usuarios',
            ...routerUsuarios
        },
        {
            name: 'aulas',
            path: '/aulas',
            ...routerAulas
        }
    ]
}
