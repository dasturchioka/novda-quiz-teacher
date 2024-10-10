<script lang="ts" setup>
import Header from '@/components/ui/header/Header.vue'
import CreateClassroom from '@/modules/classrooms/create-classroom.vue'
import SingleClassroom from '@/modules/classrooms/single-classroom.vue'
import { useClassroom } from '@/modules/classrooms/store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useLoading } from '@/stores/loading'
import Loading from '@/components/app/loading.vue'

const loadingStore = useLoading()
const classroomStore = useClassroom()

const { classrooms } = storeToRefs(classroomStore)
const { loading } = storeToRefs(loadingStore)

onMounted(async () => {
	await classroomStore.getAllClassrooms()
})
</script>

<template>
	<div class="classrooms-page">
		<Header>Sinfxonalar</Header>
		<div v-if="!classrooms.length && loading">
			<Loading />
		</div>
		<div v-if="classrooms.length" class="single-classroom w-full">
			<div class="wrapper grid my-6">
				<SingleClassroom v-for="c in classrooms" :key="c.id" :single-classroom="c" />
				<CreateClassroom as-what="card" />
			</div>
		</div>
		<div v-else class="my-6">
			<h1 class="text-xl font-manrope">Hozircha sizda sinfxonalar mavjud emas</h1>
			<CreateClassroom as-what="button" class="my-2" />
		</div>
	</div>
</template>

<style scoped>
.single-classroom .wrapper {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	grid-gap: 10px;
}
</style>
