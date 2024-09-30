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
import { usePackage } from './store'

const packageStore = usePackage()
const prop = defineProps<{ asWhat: 'card' | 'button' }>()

const { asWhat } = toRefs(prop)

const newPackageName = ref('')

const createPackage = async () => {
	await packageStore.createPackage(newPackageName.value)
	newPackageName.value = ''
}
</script>

<template>
	<div class="create-package">
		<Dialog>
			<DialogTrigger as-child
				><Button v-if="asWhat === 'button'"
					><Plus class="size-5 mr-2" /> Yangi paket qo'shish</Button
				>
				<Button v-if="asWhat === 'card'" class="h-full px-4 w-full" variant="outline"
					><Plus class="size-5 mr-2" /> Yangi paket qo'shish</Button
				>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Yangi paket yaratish</DialogTitle>
					<DialogDescription>
						Oldin savol paketi, keyin esa uning savollarini yaratishingiz mumkin
					</DialogDescription>
				</DialogHeader>
				<form @submit.prevent="createPackage">
					<div class="form-group space-y-1 mb-6">
						<Label for="name">Nomini kiriting</Label>
						<Input placeholder="Mikroiqtisodiyot" v-model:model-value="newPackageName" id="name" />
					</div>
					<Button type="submit" class="w-full"><Save class="size-5 mr-2" /> Yaratish</Button>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</template>
