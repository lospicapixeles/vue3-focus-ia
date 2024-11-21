export default {
    name: 'aulas',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: '',
            path: '/aulas',
            component: () => import('../views/Index.vue'),
        },
    ]
}
