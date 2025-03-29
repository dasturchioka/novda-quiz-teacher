<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import { Plus, Save } from 'lucide-vue-next'
import { onMounted, ref, toRefs } from 'vue'
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
import { useExams } from './store'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Classroom } from '@/models'

const examsStore = useExams()
const prop = defineProps<{ asWhat: 'card' | 'button'; classroom: Classroom }>()

const { asWhat, classroom } = toRefs(prop)

const examDetails = ref({
	name: '',
	packageOneId: '',
	classroomOneId: classroom.value.oneId,
})

console.log(examDetails.value)

const startExam = async () => {
	await examsStore.startExam(examDetails.value)
	examDetails.value.name = ''
}

const packages = ref()
const classrooms = ref()

onMounted(async () => {
	const response = await examsStore.getDataPreExam()

	packages.value = response?.packages
	classrooms.value = response?.classrooms
})
</script>

<template>
	<div class="start-exam my-0">
		<Dialog>
			<DialogTrigger as-child
				><Button v-if="asWhat === 'button'"><Plus class="size-5 mr-2" /> Imtihon yaratish</Button>
				<Button v-if="asWhat === 'card'" class="h-full px-4 w-full" variant="outline"
					><Plus class="size-5 mr-2" /> Imtihon yaratish</Button
				>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Imtihon yaratish</DialogTitle>
					<DialogDescription>
						Qaysi sinfga va qaysi savollar paketi bilan imtihon ochmoqchi bo'lsangiz ularni tanlab
						keyin yaratishni bosing</DialogDescription
					>
				</DialogHeader>
				<form @submit.prevent="startExam" class="space-y-4 w-full">
					<div class="form-group space-y-1">
						<Label for="name">Nomini kiriting</Label>
						<Input
							placeholder="Mikroiqtisodiyot imtihoni"
							v-model:model-value="examDetails.name"
							id="name"
						/>
					</div>
					<div v-if="!classroom" class="form-group w-full">
						<Select class="w-full" v-model:model-value="examDetails.classroomOneId">
							<SelectTrigger class="w-full">
								<SelectValue placeholder="Sinfxonani tanlang" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Mavjud sinfxonalar</SelectLabel>
									<SelectItem v-for="c in classrooms" :value="c.oneId" :key="c.oneId">
										{{ c.name }}
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div class="form-group">
						<Select v-model:model-value="examDetails.packageOneId">
							<SelectTrigger class="w-full">
								<SelectValue placeholder="Paketni tanlang" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Mavjud Savol paketlari</SelectLabel>
									<SelectItem v-for="p in packages" :value="p.oneId" :key="p.oneId">
										{{ p.name }}
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<Button type="submit" class="w-full"><Save class="size-5 mr-2" /> Yaratish</Button>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</template>
