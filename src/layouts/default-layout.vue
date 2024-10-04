<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
	MenuIcon,
	XIcon,
	UsersRound,
	Boxes,
	CircleDashed,
	ListCheck,
	Globe,
	X,
} from 'lucide-vue-next'
import { useAuth } from '@/stores/auth'
import Cookies from 'js-cookie'

const visibilityBetaComponent = ref(Cookies.get('beta-component'))

const authStore = useAuth()

const navItems = [
	{ href: '/classrooms', label: 'Sinfxonalar', icon: Boxes },
	{ href: '/students', label: 'Talabalar', icon: UsersRound },
	{ href: '/exams', label: 'Imtihonlar', icon: CircleDashed },
	{ href: '/packages', label: 'Paketlar', icon: ListCheck },
	{ href: '/community', label: 'Hamjamiyat', icon: Globe },
]

const route = useRoute()
const sidebarOpen = ref(false)
const isMobile = ref(false)
const currentPath = computed(() => {
	return route.path
})

const checkMobile = () => {
	isMobile.value = window.innerWidth <= 768
	if (!isMobile.value) {
		sidebarOpen.value = true
	}
}

const toggleSidebar = () => {
	sidebarOpen.value = !sidebarOpen.value
}

const closeBetaComponent = () => {
	Cookies.set('beta-component', 'false')
	visibilityBetaComponent.value = Cookies.get('beta-component')
}

onMounted(() => {
	checkMobile()
	window.addEventListener('resize', checkMobile)
})

onMounted(async () => {
	await authStore.check()
})

onUnmounted(() => {
	window.removeEventListener('resize', checkMobile)
})
</script>

<template>
	<div class="flex h-screen bg-background overflow-y-hidden overflow-x-hidden w-full">
		<!-- Sidebar -->
		<aside
			:class="[
				'fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform duration-300 ease-in-out md:relative bg-neutral-50 dark:bg-neutral-900 shadow',
				sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
			]"
		>
			<div class="flex h-full flex-col justify-between">
				<div class="first-part">
					<div class="flex h-14 items-center border-b px-4">
						<h1 class="font-bold tracking-tighter font-manrope text-2xl">
							Teacher <b class="text-blue-500">.</b>
						</h1>
						<button
							v-if="isMobile"
							@click="toggleSidebar"
							class="ml-auto rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
						>
							<XIcon class="h-4 w-4" />
						</button>
					</div>
					<nav class="flex-1 space-y-2 overflow-y-auto p-2 h-auto max-h-[400px]">
						<RouterLink
							v-for="item in navItems"
							:to="item.href"
							:key="item.href"
							:href="item.href"
							:class="[
								'flex items-center rounded-md px-3 py-2 font-medium transition-colors font-noto',
								currentPath === item.href
									? 'bg-blue-500 text-neutral-50 hover:text-neutral-50 hover:bg-blue-500'
									: 'text-neutral-900 dark:hover:bg-neutral-800 hover:bg-neutral-200',
							]"
						>
							<component :is="item.icon" class="mr-2 h-4 w-4" />
							{{ item.label }}
						</RouterLink>
					</nav>
				</div>
				<div
					v-if="visibilityBetaComponent === 'true'"
					class="beta bg-blue-700 text-neutral-50 mx-2 rounded-md p-4 justify-self-end mb-4"
				>
					<h1 class="text-xl flex items-center font-bold font-manrope mb-4">
						Sayt beta holatda!
						<button @click="closeBetaComponent"><X class="size-5 ml-2" /></button>
					</h1>
					<p class="text-sm font-noto">
						Saytga yangi imkoniyat va qulayliklar qo'shiladi va texnik muammolar tez orada hal
						qilinadi
					</p>
				</div>
			</div>
		</aside>

		<!-- Main content -->
		<div class="flex flex-1 flex-col">
			<!-- Mobile header with toggle button -->
			<header v-if="isMobile" class="flex h-14 items-center border-b bg-background px-4">
				<button
					@click="toggleSidebar"
					class="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
				>
					<MenuIcon class="h-4 w-4" />
				</button>
			</header>

			<!-- Scrollable main content -->
			<main class="flex-1 overflow-y-auto overflow-x-hidden">
				<div class="container mx-auto sm:p-4 p-2 w-full">
					<RouterView></RouterView>
				</div>
			</main>
		</div>
	</div>
</template>

<style scoped>
.router-link-active.router-link-exact-active {
}
</style>
