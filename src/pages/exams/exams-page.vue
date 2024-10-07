<script lang="ts" setup>
import Header from '@/components/ui/header/Header.vue'
import SingleExam from '@/modules/exams/single-exam.vue'
import { useExams } from '@/modules/exams/store'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, onMounted } from 'vue'
const CreateExam = defineAsyncComponent(() => import('@/modules/exams/create-exam.vue'))

const examsStore = useExams()

const { allExams } = storeToRefs(examsStore)

onMounted(async () => {
	await examsStore.getExams('false')
})
</script>

<template>
	<div class="exams-page">
		<Header>Imtihonlar</Header>
		<div v-if="allExams && allExams.length" class="single-classroom w-full my-6">
			<div class="wrapper grid">
				<SingleExam v-for="exam in allExams" :key="exam.id" :single-exam="exam" />
				<CreateExam as-what="card" class="my-4" />
			</div>
		</div>
		<div v-else class="my-6">
			<h1 class="text-xl font-manrope">Hozircha imtihonlar mavjud emas</h1>
			<CreateExam v-if="!allExams || !allExams.length" as-what="button" class="my-4" />
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