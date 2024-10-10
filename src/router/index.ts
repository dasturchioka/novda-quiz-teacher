import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Cookie from 'js-cookie'
import DefaultLayout from '@/layouts/default-layout.vue'
import AuthLayout from '@/layouts/auth-layout.vue'

// Define routes
const routes: RouteRecordRaw[] = [
	{
		name: 'default-layout',
		path: '/',
		component: DefaultLayout,
		redirect: '/classrooms',
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
				name: 'default-classrooms',
				path: 'classrooms',
				component: () => import('@/pages/classrooms/classrooms-page.vue'),
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
				name: 'default-community',
				path: 'community',
				component: () => import('@/pages/community/community-page.vue'),
				meta: {
					layout: 'default',
				},
			},
			{
				name: 'default-profile',
				path: 'profile',
				component: () => import('@/pages/profile/profile-page.vue'),
				meta: {
					layout: 'default',
				},
			},
			{
				name: 'default-show-package',
				path: 'package/:oneId',
				component: () => import('@/pages/packages/show-package-page.vue'),
				meta: {
					layout: 'default',
				},
			},
			{
				name: 'default-show-classroom',
				path: 'classroom/:oneId',
				component: () => import('@/pages/classrooms/show-classroom-page.vue'),
				meta: {
					layout: 'default',
				},
			},
		],
	},
	{
		name: 'auth-layout',
		path: '/auth',
		component: AuthLayout,
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

// reroute when the error happens
router.onError((error, to) => {
	if (error.message.includes('Failed to fetch dynamically imported module')) {
		window.location = to.fullPath as any
	}
})

export default router
