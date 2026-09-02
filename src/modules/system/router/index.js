import routerUsuarios from '../modules/usuarios/router'
import routerAulas from '../modules/aulas/router'
import routerCurso from '../modules/cursos/router'
import routerSesion from '../modules/sesions/router'
import routerLive from '../modules/live/router'
import routerEmocion from '../modules/emociones/router'

export default {
    name: 'home',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: 'principal',
            icon: 'pi pi-home',
            path: '/',
            component: () => import('../views/Home.vue')
        },
        {
            name: 'usuarios',
            icon: 'pi pi-users',
            path: '/usuarios',
            ...routerUsuarios
        },
        {
            name: 'aulas',
            icon: 'pi pi-building',
            path: '/aulas',
            ...routerAulas
        },
        {
            name: 'cursos',
            icon: 'pi pi-book',
            path: '/cursos',
            ...routerCurso
        },
        {
            name: 'sesions',
            icon: 'pi pi-clock',
            path: '/horarios',
            ...routerSesion
        },
        {
            name: 'lives',
            icon: 'pi pi-video',
            path: '/lives',
            hidden: true,
            ...routerLive
        },
        {
            name: 'emociones',
            icon: 'pi pi-face-smile',
            path: '/emociones',
            ...routerEmocion
        }
    ]
}
