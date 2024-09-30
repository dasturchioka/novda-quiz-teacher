<script lang="ts" setup>
import Header from '@/components/ui/header/Header.vue'
import CreatePackage from '@/modules/package/create-package.vue'
import { onMounted } from 'vue'
import { usePackage } from '@/modules/package/store'
import { storeToRefs } from 'pinia'
import SinglePackage from '@/modules/package/single-package.vue'
import { Package, StatusPackage, Teacher } from '@/models'
import { ScrollArea } from '@/components/ui/scroll-area'

const packageStore = usePackage()
const { packages } = storeToRefs(packageStore)

onMounted(async () => {
	await packageStore.getAllPackages()
})
</script>

<template>
	<div class="packages-page overflow-x-scroll">
		<Header>Paketlar</Header>
		<div class="single-packages w-full">
			<div class="wrapper grid my-6">
				<SinglePackage
					:single-package="{name: 'Mikroiqtisodiyot', id: '2323', oneId: 'PK433433',questions: [], teacher: {fullname: 'Sardor Aminov'} as Teacher, status: 'Private' as any, teacherId: '' }"
				/>
				<SinglePackage
					:single-package="{name: 'Wow', id: '2323', oneId: 'PK433433',questions: [], teacher: {fullname: 'Sardor Aminov'} as Teacher, status: 'Private' as any, teacherId: '' }"
				/>
				<SinglePackage
					:single-package="{name: 'Mikroiqtisodiyot', id: '2323', oneId: 'PK433433',questions: [], teacher: {fullname: 'Sardor Aminov'} as Teacher, status: 'Private' as any, teacherId: '' }"
				/>
				<SinglePackage
					:single-package="{name: 'Wow', id: '2323', oneId: 'PK433433',questions: [], teacher: {fullname: 'Sardor Aminov'} as Teacher, status: 'Private' as any, teacherId: '' }"
				/>
				<CreatePackage as-what="card"/>
			</div>
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
