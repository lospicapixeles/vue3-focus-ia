export default {
    name: 'horarios',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: '',
            path: '/horarios',
            component: () => import('../views/Index.vue'),
        },
    ]
}
