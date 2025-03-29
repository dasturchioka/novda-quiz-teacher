<script setup lang="ts">
import DeleteItem from '@/components/app/ask-before-action.vue'
import Button from '@/components/ui/button/Button.vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { config } from '@/config'
import { Question } from '@/models/'
import { CheckCheck, Trash } from 'lucide-vue-next'
import { ref, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePackage } from './store'

const route = useRoute()
const packageStore = usePackage()

const props = defineProps<{ question: Question; index: number }>()

const { question } = toRefs(props)

const editedQuestionDetails = ref({ ...question.value })

const showImage = ref(false)

watch(
	() => showImage.value,
	val => console.log(question.value)
)

const newImg = ref<File | null>()
const imgTag = ref<HTMLImageElement>()

const handleNewImg = (e: any) => {
	newImg.value = e.target.files[0]
	if (imgTag.value) {
		if (newImg.value) {
			imgTag.value.src = URL.createObjectURL(newImg.value)
		}
	}
}

const clearImg = () => {
	newImg.value = null
	if (imgTag.value) imgTag.value.src = ''
}

const submit = async () => {
	const form = new FormData()
	try {
		form.append('questionText', editedQuestionDetails.value.questionText)
		form.append('optionA', editedQuestionDetails.value.optionA)
		form.append('optionB', editedQuestionDetails.value.optionB)
		form.append('optionC', editedQuestionDetails.value.optionC)
		form.append('optionD', editedQuestionDetails.value.optionD)
		form.append('answer', editedQuestionDetails.value.answer)
		if (newImg.value) {
			form.append('img', newImg.value as File)
		}
		form.append('id', editedQuestionDetails.value.id)

		await packageStore.editQuestion(form, route.params.oneId as string)
	} catch (error) {
		console.error(error)
	} finally {
		form.delete('questionText')
		form.delete('optionA')
		form.delete('optionB')
		form.delete('optionC')
		form.delete('optionD')
		form.delete('answer')
		form.delete('img')
	}
}

const deleteImgOfQuestion = async () => {
	await packageStore.deleteImageOfQuestion(question.value.id)
}

watch(
	() => newImg.value,
	val => {
		console.log(val)
	}
)
</script>

<template>
	<div class="w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden">
		<div class="p-6 md:p-8 w-full">
			<h2 class="text-2xl md:text-3xl font-bold text-left mb-6">{{ index }} - savol</h2>
			<form @submit.prevent class="space-y-6">
				<div
					v-if="editedQuestionDetails && editedQuestionDetails.img"
					class="flex items-center justify-between"
				>
					<label for="show-image" class="text-sm md:text-base font-medium">Show Image</label>
					<Checkbox
						id="show-image"
						v-model:checked="showImage"
						type="checkbox"
						class="form-checkbox h-5 w-5 text-blue-600"
					/>
				</div>
				<div v-else class="flex-col items-center justify-between">
					<div class="relative flex justify-center items-center flex-col">
						<img
							accept="image/*"
							v-show="newImg"
							ref="imgTag"
							alt="Savol rasmi"
							class="w-full max-h-64 object-contain rounded-lg"
						/>
						<Button
							v-show="newImg"
							@click="clearImg"
							type="button"
							class="my-4"
							variant="destructive"
						>
							<Trash class="size-5" />
						</Button>
					</div>
					<label for="show-image" class="text-sm md:text-base font-medium">Rasm qo'shish</label>
					<input
						id="show-image"
						@change="handleNewImg"
						type="file"
						class="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
					/>
				</div>

				<div
					v-if="showImage && editedQuestionDetails.img"
					class="space-y-2 flex flex-col items-center justify-center"
				>
					<a target="_blank" :href="config.SERVER_BASE + editedQuestionDetails.img">
						<img
							accept="image/*"
							ref="imgTag"
							:src="config.SERVER_BASE + editedQuestionDetails.img"
							alt="Savol rasmi"
							class="w-full max-h-64 object-contain rounded-lg"
						/>
					</a>
					<DeleteItem description="Bu rasm qayta tiklanmaydi!" @do:action="deleteImgOfQuestion">
						<template #trigger>
							<Button class="my-4" type="button" variant="destructive">
								<Trash class="size-5" />
							</Button>
						</template>
					</DeleteItem>
					<input
						type="file"
						@change="handleNewImg"
						class="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
					/>
				</div>

				<div class="space-y-2">
					<label for="questionText" class="text-sm md:text-base font-medium">Savol matni</label>
					<Textarea
						id="questionText"
						v-model:model-value="editedQuestionDetails.questionText"
						placeholder="Savolingizni kiriting"
						required
					></Textarea>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="optionA" class="text-sm md:text-base font-medium">A javob</Label>
						<Input
							id="optionA"
							v-model:model-value="editedQuestionDetails.optionA"
							type="text"
							placeholder="A javobni kiriting"
							required
						/>
					</div>
					<div class="space-y-2">
						<Label for="optionB">B javob</Label>
						<Input
							id="optionA"
							v-model:model-value="editedQuestionDetails.optionB"
							type="text"
							placeholder="B javobni kiriting"
							required
						/>
					</div>
					<div class="space-y-2">
						<Label for="optionC">C javob</Label>
						<Input
							id="optionC"
							v-model:model-value="editedQuestionDetails.optionC"
							type="text"
							placeholder="C javobni kiriting"
							required
						/>
					</div>
					<div class="space-y-2">
						<Label for="optionD">D javob</Label>
						<Input
							id="optionD"
							v-model:model-value="editedQuestionDetails.optionD"
							type="text"
							placeholder="D javobni kiriting"
							required
						/>
					</div>
				</div>

				<div class="space-y-2">
					<Label for="answer">To'g'ri javob</Label>
					<Input
						id="answer"
						v-model:model-value="editedQuestionDetails.answer"
						type="text"
						placeholder="To'g'ri javobni variantdagisi bilan bir xil kiriting"
						required
					/>
				</div>

				<div class="buttons flex flex-wrap items-center gap-4">
					<Button @click="submit" type="submit">
						<CheckCheck class="size-5 mr-2" /> Yangilash
					</Button>
					<DeleteItem @do:action="packageStore.deleteQuestion(editedQuestionDetails.id)">
						<template #trigger>
							<Button class="w-auto" variant="destructive">
								<Trash class="size-5 mr-2" /> O'chirish
							</Button>
						</template>
					</DeleteItem>
				</div>
			</form>
		</div>
	</div>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
