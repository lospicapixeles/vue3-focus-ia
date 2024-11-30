export default {
    name: 'emociones',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: '',
            path: '/emociones',
            component: () => import('../views/Index.vue'),
        },
    ]
}
