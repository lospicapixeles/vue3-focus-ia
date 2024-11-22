export default {
    name: 'lives',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: '',
            path: '/lives/:uuid/:sesions_id',
            component: () => import('../views/Index.vue'),
        },
    ]
}
