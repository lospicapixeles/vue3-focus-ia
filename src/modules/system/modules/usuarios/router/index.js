export default {
    name: 'usuarios',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: '',
            path: '/usuarios',
            component: () => import('../views/Index.vue'),
        },
    ]
}