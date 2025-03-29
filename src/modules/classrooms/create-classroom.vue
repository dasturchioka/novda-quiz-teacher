<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import { Plus, Save } from 'lucide-vue-next'
import { ref, toRefs } from 'vue'
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
import { useClassroom } from './store'

const classroomStore = useClassroom()
const prop = defineProps<{ asWhat: 'card' | 'button' }>()

const { asWhat } = toRefs(prop)

const newClassroomName = ref('')

const createClassroom = async () => {
	await classroomStore.createClassroom(newClassroomName.value)
	newClassroomName.value = ''
}
</script>

<template>
	<div class="create-classroom">
		<Dialog>
			<DialogTrigger as-child
				><Button v-if="asWhat === 'button'"
					><Plus class="size-5 mr-2" /> Yangi sinf yaratish</Button
				>
				<Button v-if="asWhat === 'card'" class="h-full px-4 w-full" variant="outline"
					><Plus class="size-5 mr-2" /> Yangi sinf yaratish</Button
				>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Yangi sinf yaratish</DialogTitle>
					<DialogDescription> Sinf nomini kiritish orqali sinfxona yarating</DialogDescription>
				</DialogHeader>
				<form @submit.prevent="createClassroom">
					<div class="form-group space-y-1 mb-6">
						<Label for="name">Nomini kiriting</Label>
						<Input placeholder="KM-60/23" v-model:model-value="newClassroomName" id="name" />
					</div>
					<Button type="submit" class="w-full"><Save class="size-5 mr-2" /> Yaratish</Button>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</template>
