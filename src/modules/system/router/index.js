export default {
    name: 'home',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: 'principal',
            path: '/',
            component: () => import('../views/Home.vue')
        },
    ]
}