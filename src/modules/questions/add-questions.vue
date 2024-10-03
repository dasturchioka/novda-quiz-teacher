<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import { Question } from '@/models'
import { CheckCheck, PlusCircle } from 'lucide-vue-next'
import { ref, toRefs } from 'vue'
import { usePackage } from '../packages/store'

const props = defineProps<{ type: 'short' | 'long', packageOneId: string }>()

const {packageOneId} = toRefs(props)

const packageStore = usePackage()

const questionDetails = ref<Question>({
	id: '',
	questionText: '',
	answer: '',
	optionA: '',
	optionB: '',
	optionC: '',
	optionD: '',
	img: '',
})


const submit = async () => {
  const form = new FormData()

  form.append('questionText', questionDetails.value.questionText)
	form.append('optionA', questionDetails.value.optionA)
	form.append('optionB', questionDetails.value.optionB)
	form.append('optionC', questionDetails.value.optionC)
	form.append('optionD', questionDetails.value.optionD)
	form.append('answer', questionDetails.value.answer)
	form.append('img', questionDetails.value.img as any)

  await packageStore.addQuestionToPackage(form, packageOneId.value)
}

const handleImage = (e: any) => {
	questionDetails.value.img = e.target.files[0]
}
</script>

<template>
	<Dialog>
		<DialogTrigger as-child>
			<Button v-if="type === 'long'"> <PlusCircle class="size-5 mr-2" /> Qo'shish </Button>
			<Button v-else-if="type === 'short'" size="icon"> <PlusCircle class="size-5" /></Button>
		</DialogTrigger>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Savol qo'shish</DialogTitle>
				<DialogDescription> Savolni qo'shib saqlashni bosing </DialogDescription>
			</DialogHeader>
			<form @submit.prevent="submit" class="flex flex-col justify-center">
				<div class="form-groups space-y-2">
					<div class="form-group">
						<Label for="questionText">Savol <span class="text-red-500">*</span></Label>
						<Input
							required
							id="questionText"
							placeholder="Savol matni"
							v-model:model-value.trim="questionDetails.questionText"
						/>
					</div>

					<div class="form-group">
						<Label for="optionA">A variant <span class="text-red-500">*</span></Label>
						<Input
							required
							id="optionA"
							placeholder="A variant"
							v-model:model-value.trim="questionDetails.optionA"
						/>
					</div>
					<div class="form-group">
						<Label for="optionB">B variant <span class="text-red-500">*</span></Label>
						<Input
							required
							id="optionB"
							placeholder="B variant"
							v-model:model-value.trim="questionDetails.optionB"
						/>
					</div>
					<div class="form-group">
						<Label for="optionC">C variant <span class="text-red-500">*</span></Label>
						<Input
							required
							id="optionC"
							placeholder="C variant"
							v-model:model-value.trim="questionDetails.optionC"
						/>
					</div>
					<div class="form-group">
						<Label for="optionD">D variant <span class="text-red-500">*</span></Label>
						<Input
							required
							id="optionD"
							placeholder="D variant"
							v-model:model-value.trim="questionDetails.optionD"
						/>
					</div>
					<div class="form-group">
						<Label for="answer">To'g'ri javob <span class="text-red-500">*</span></Label>
						<Input
							required
							id="answer"
							placeholder="To'g'ri javob variantdagisi bilan bir xil bo'lsin!"
							v-model:model-value.trim="questionDetails.answer"
						/>
					</div>
					<div class="form-group">
						<Label for="img">Savol rasmi</Label>
						<input
							accept="image/*"
							class="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
							type="file"
							id="img"
							placeholder="Savol rasmi"
							@change="handleImage"
						/>
					</div>
				</div>
				<Button class="self-end w-auto mt-6"><CheckCheck class="size-5 mr-2" /> Qo'shish</Button>
			</form>
		</DialogContent>
	</Dialog>
</template>
