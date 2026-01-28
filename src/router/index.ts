import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw>  = [
    {
        path: '/',
        name: 'Main',
        redirect: '/business',
        component: () => import("@/Layouts/Layout.vue"),
        children: [
            {
                path: '/business',
                name: 'Business',
                component: () => import('@/views/Business.vue'),
                meta: {
                    requiresAuth: true,
                    id: 0,
                    icon: 'fa-solid fa-briefcase',
                    title: 'Business' as string,
                }
            },
            {
                path: '/employee',
                name: 'Employee',
                component: () => import("@/views/Employee.vue"),
                meta: {
                    requiresAuth: true,
                    id: 1,
                    icon: 'fa-regular fa-address-card',
                    title: 'Employee' as string,
                }
            },
            {
                path: '/categories',
                name: 'Categories',
                component: () => import('@/views/Categories.vue'),
                meta: {
                    requiresAuth: true,
                    id: 2,
                    icon: 'fa-solid fa-layer-group',
                    title: 'Categories' as string,
                }
            },
            {
                path: '/creator',
                name: 'Creator',
                component: () => import('@/views/Creator.vue'),
                meta: {
                    requiresAuth: true,
                    id: 3,
                    icon: 'fa-brands fa-creative-commons-share',
                    title: 'Creator' as string,
                }
            },
            {
                path: '/income',
                name: 'Income',
                component: () => import('@/views/Income.vue'),
                meta: {
                    requiresAuth: true,
                    id: 4,
                    icon: 'fa-regular fa-file-lines',
                    title: 'Income' as string,
                }
            },
            {
                path: '/market',
                name: 'Market',
                component: () => import('@/views/Market.vue'),
                meta: {
                    requiresAuth: true,
                    id: 5,
                    icon: 'fa-solid fa-shop',
                    title: 'Market' as string,
                }
            },
            {
                path: '/measure',
                name: 'Measure',
                component: () => import('@/views/Measure.vue'),
                meta: {
                    requiresAuth: true,
                    id: 6,
                    icon: 'fa-solid fa-scale-unbalanced-flip',
                    title: 'Measure' as string,
                }
            },
            {
                path: '/outgoing',
                name: 'OutgoingProduct',
                component: () => import('@/views/OutgoingProduct.vue'),
                meta: {
                    requiresAuth: true,
                    id: 7,
                    icon: 'fa-solid fa-file-lines',
                    title: 'OutgoingProduct' as string,
                }
            },
            {
                path: '/position',
                name: 'Position',
                component: () => import('@/views/Position.vue'),
                meta: {
                    requiresAuth: true,
                    id: 8,
                    icon: 'fa-solid fa-image-portrait',
                    title: 'Position' as string,
                }
            },
            {
                path: '/product',
                name: 'Product',
                component: () => import('@/views/Product.vue'),
                meta: {
                    requiresAuth: true,
                    id: 9,
                    icon: 'fa-brands fa-product-hunt',
                    title: 'Product' as string,
                }
            },
            {
                path: '/room',
                name: 'Room',
                component: () => import('@/views/Room.vue'),
                meta: {
                    requiresAuth: true,
                    id: 10,
                    icon: 'fa-solid fa-house',
                    title: 'Room' as string,
                }
            },
            {
                path: '/tag',
                name: 'TagVue',
                component: () => import('@/views/TagVue.vue'),
                meta: {
                    requiresAuth: true,
                    id: 11,
                    icon: 'fa-solid fa-tag',
                    title: 'TagVue' as string,
                }
            },
            {
                path: '/warehouse',
                name: 'WareHouse',
                component: () => import('@/views/WareHouse.vue'),
                meta: {
                    requiresAuth: true,
                    id: 12,
                    icon: 'fa-solid fa-warehouse',
                    title: 'WareHouse' as string,
                }
            },
            {
                path: '/userProfile',
                name: 'UserProfile',
                component: () => import('@/views/UserProfile.vue'),
                meta: {
                    requiresAuth: true,
                    id: 13,
                    icon: 'fa-solid fa-user',
                    title: 'UserProfile' as string,
                }
            },
            {
                path: '/task',
                name: 'TaskVue',
                component: () => import('../components/TaskVue.vue'),
                meta: {
                    requiresAuth: true,
                    title: 'TaskVue' as string,
                }
            }
        ]
    },

]
const router = createRouter({
    history: createWebHistory(),
    routes,
    linkExactActiveClass: 'bg-gray-600',
})
const defaultApp = 'Frontend'

router.beforeEach((to, from) => {
    document.title = `${to.meta.title}` || defaultApp
})
export default router