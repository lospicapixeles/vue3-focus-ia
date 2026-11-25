export default {
    name: 'posturas',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: '',
            path: '/posturas',
            component: () => import('../views/Index.vue'),
        },
    ]
}
