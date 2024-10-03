<script lang="ts" setup>
import Header from '@/components/ui/header/Header.vue'
import CreatePackage from '@/modules/packages/create-package.vue'
import SinglePackage from '@/modules/packages/single-package.vue'
import { usePackage } from '@/modules/packages/store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const packageStore = usePackage()
const { packages } = storeToRefs(packageStore)

onMounted(async () => {
	await packageStore.getAllPackages()
})
</script>

<template>
	<div class="packages-page">
		<Header>Paketlar</Header>
		<div v-if="packages.length" class="single-packages w-full">
			<div class="wrapper grid my-6">
				<SinglePackage v-for="p in packages" :key="p.id" :single-package="p" />
				<CreatePackage as-what="card" />
			</div>
		</div>
		<div v-else class="my-6">
			<h1 class="text-xl font-manrope">Hozircha sizda paketlar mavjud emas</h1>
			<CreatePackage as-what="button" class="my-2" />
		</div>
	</div>
</template>

<style scoped>
.single-packages .wrapper {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	grid-gap: 10px;
}
</style>
