<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import { Input as AppInput } from '@/components/ui/input/'
import Label from '@/components/ui/label/Label.vue'
import { Package, Question } from '@/stores/question-package'
import { Send, Trash } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionPackage } from '@/stores/question-package'
import { storeToRefs } from 'pinia'

const questionStore = useQuestionPackage()
const router = useRouter()
const { loading } = storeToRefs(questionStore)

async function restart() {
	localStorage.removeItem('question-package')
	await router.push('/add-package')
}

const packageName = computed(() => {
	const questionPackage = JSON.parse(localStorage.getItem('question-package') as string) as Package

	return questionPackage.name
})

const packageOneId = computed(() => {
	const questionPackage = JSON.parse(localStorage.getItem('question-package') as string) as Package

	return questionPackage.oneId
})

const question = ref<Question>({
	packageName: '',
	packageOneId: '',
	answer: '',
	img: undefined,
	optionA: '',
	optionB: '',
	optionC: '',
	optionD: '',
	question: '',
})

async function addQuestion() {
	console.log(question.value.img)

	const response = await questionStore.addQuestions(
		{ ...question.value, packageOneId: packageOneId.value, packageName: packageName.value },
		question.value.img as File
	)

	if (response?.status === 'ok') {
		question.value = {
			packageName: '',
			answer: '',
			img: undefined,
			optionA: '',
			optionB: '',
			optionC: '',
			optionD: '',
			question: '',
			packageOneId: '',
		}
	}
}

const handleImage = (e: any) => {
	e.preventDefault()
	question.value.img = e.target.files[0]
}
</script>

<template>
	<div
		class="add-questions-page container mx-auto sm:px-4 px-2 flex h-screen flex-col"
	>
		<form @submit.prevent="addQuestion" class="sm:mt-10 mt-6">
			<h1 class="text-2xl font-semibold mb-4 text-center">
				<b>{{ packageName }}</b> to'plami uchun savollar tuzish
			</h1>
			<div class="groups space-y-4 flex flex-col">
				<div class="form-group">
					<Label for="file">Rasm <small class="italic">(majburiy emas)</small></Label>
					<input
						@change="handleImage"
						id="file"
						accept="image/*"
						class="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
						type="file"
					/>
				</div>
				<div class="form-group">
					<Label for="question">Savol <b class="text-red-500">*</b> </Label>
					<AppInput required v-model.trim:model-value="question.question" id="question" />
				</div>
				<div class="form-group">
					<Label for="optionA">A javob <b class="text-red-500">*</b> </Label>
					<AppInput required v-model.trim:model-value="question.optionA" id="optionA" />
				</div>
				<div class="form-group">
					<Label for="optionB">B javob <b class="text-red-500">*</b> </Label>
					<AppInput required id="optionB" v-model.trim:model-value="question.optionB" />
				</div>
				<div class="form-group">
					<Label for="optionC">C javob <b class="text-red-500">*</b> </Label>
					<AppInput required id="optionC" v-model.trim:model-value="question.optionC" />
				</div>
				<div class="form-group">
					<Label for="optionD">D javob <b class="text-red-500">*</b> </Label>
					<AppInput required id="optionD" v-model.trim:model-value="question.optionD" />
				</div>
				<div class="form-group">
					<Label for="correctAnswer">To'g'ri javob <b class="text-red-500">*</b> </Label>
					<AppInput required id="correctAnswer" v-model.trim:model-value="question.answer" />
				</div>
				<Button :disabled="loading" type="submit" class="py-6"
					><Send class="w-4 h-4 mr-2" /> Jo'natish</Button
				>
				<Button :disabled="loading" type="button" class="py-6" @click="restart" variant="destructive"
					><Trash class="w-4 h-4 mr-2" /> Restart</Button
				>
			</div>
		</form>
	</div>
</template>
