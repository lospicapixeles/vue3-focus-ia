export default {
    name: 'cursos',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: '',
            path: '/cursos',
            component: () => import('../views/Index.vue'),
        },
    ]
}
