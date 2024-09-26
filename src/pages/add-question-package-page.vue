<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { Package } from '@/stores/question-package'
import { CirclePlus } from 'lucide-vue-next'
import { ref } from 'vue'
import { useQuestionPackage } from '@/stores/question-package'

const packageStore = useQuestionPackage()

const questionPackage = ref<Package>({
	name: '',
	oneId: '',
})
</script>

<template>
	<div class="add-question-package-page h-full flex justify-center items-center">
		<div class="container mx-auto sm:px-4 px-2 flex justify-center items-center">
			<form
				@submit.prevent="packageStore.addQuestionPackage(questionPackage.name)"
				class="flex flex-col items-center sm:w-[80%]"
			>
				<h1 class="text-4xl font-bold mb-8">Savol paketi yaratish</h1>
				<div class="form-group flex items-center space-x-4 w-full">
					<Input
						id="package-name"
						placeholder="Nom (Faqat lotin harflarida)"
						v-model:model-value="questionPackage.name"
						class="w-full"
						pattern="[a-zA-Z0-9]*"
					/>
					<Button type="submit"><CirclePlus class="w-4 h-4 mr-2" /> Yaratish</Button>
				</div>
			</form>
		</div>
	</div>
</template>
