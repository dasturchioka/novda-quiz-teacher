import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Cookie from 'js-cookie'

// Define routes
const routes: RouteRecordRaw[] = [
	{
		name: 'default-layout',
		path: '/',
		component: () => import('@/layouts/default-layout.vue'),
		redirect: '/groups',
		beforeEnter: (to, from, next) => {
			const token = Cookie.get('token')
			if (token) {
				next() // Proceed to the route
			} else {
				next('/auth') // Redirect to the auth page
			}
		},
		children: [
			{
				name: 'default-groups',
				path: 'groups',
				component: () => import('@/pages/groups/groups-page.vue'),
				meta: {
					layout: 'default',
				},
			},
			{
				name: 'default-students',
				path: 'students',
				component: () => import('@/pages/students/students-page.vue'),
				meta: {
					layout: 'default',
				},
			},
			{
				name: 'default-packages',
				path: 'packages',
				component: () => import('@/pages/packages/packages-page.vue'),
				meta: {
					layout: 'default',
				},
			},
			{
				name: 'default-exams',
				path: 'exams',
				component: () => import('@/pages/exams/exams-page.vue'),
				meta: {
					layout: 'default',
				},
			},
			{
				name: 'default-community',
				path: 'community',
				component: () => import('@/pages/community/community-page.vue'),
				meta: {
					layout: 'default',
				},
			},
		],
	},
	{
		name: 'auth-layout',
		path: '/auth',
		component: () => import('@/layouts/auth-layout.vue'),
		beforeEnter: (to, from, next) => {
			const token = Cookie.get('token')
			if (!token) {
				next() // Proceed to the route
			} else {
				next('/') // Redirect to the default layout if already authenticated
			}
		},
		children: [
			{
				name: 'auth-base',
				path: '',
				component: () => import('@/pages/auth-page.vue'),
				meta: {
					layout: 'auth',
				},
			},
		],
	},
]

// Create and export router instance
const router = createRouter({
	history: createWebHistory(),
	routes,
})

// Optional: Add global navigation guard (for demonstration purposes)
router.beforeEach((to, from, next) => {
	const token = Cookie.get('token')
	if (to.path !== '/auth' && !token) {
		next('/auth') // Redirect to auth if trying to access a protected route
	} else {
		next() // Proceed
	}
})

export default router
