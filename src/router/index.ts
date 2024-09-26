import { Package } from '@/stores/question-package'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
	{
		name: 'default-layout',
		path: '/',
		component: () => import('@/layouts/default-layout.vue'),
		redirect: '/add-package',
		children: [
			{
				name: 'default-add-question-package',
				path: 'add-package',
				component: () => import('@/pages/add-question-package-page.vue'),
				async beforeEnter(to, from, next) {
					const existPackage = JSON.parse(
						localStorage.getItem('question-package') as string
					) as Package

					if (existPackage) {
						// Prevent navigation if package exists
						await router.push(`/add-questions/${existPackage.oneId}`)
						return next(false)
					}

					// Allow navigation
					return next(true)
				},
			},
			{
				name: 'default-add-questions',
				path: 'add-questions/:id',
				component: () => import('@/pages/add-questions-page.vue'),
				async beforeEnter(to, from, next) {
					const existPackage = JSON.parse(
						localStorage.getItem('question-package') as string
					) as Package

					if (existPackage === null || existPackage.oneId !== to.params.id) {
						// Prevent navigation if package does not exist or ID doesn't match
						await router.push('/add-package')
						return next(false)
					}

					// Allow navigation
					return next(true)
				},
			},
		],
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
