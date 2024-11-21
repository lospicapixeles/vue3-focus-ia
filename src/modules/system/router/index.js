import routerUsuarios from '../modules/usuarios/router'
import routerAulas from '../modules/aulas/router'
import routerCurso from '../modules/cursos/router'

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
        },
        {
            name: 'cursos',
            path: '/cursos',
            ...routerCurso
        }
    ]
}
