<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import { Trash } from 'lucide-vue-next'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { usePackage } from './store'
import { toRefs } from 'vue'

const props = defineProps<{ id: string }>()

const { id } = toRefs(props)

const packageStore = usePackage()
</script>

<template>
	<div class="delete-package">
		<AlertDialog>
			<AlertDialogTrigger as-child>
				<Button class="w-full" variant="destructive"> <slot name="trigger"></slot> </Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
					<AlertDialogDescription>
						Ushbu paketni o'chirib yubormoqchimisiz?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Yo'q</AlertDialogCancel>
					<AlertDialogAction @click="">Ha</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</div>
</template>
