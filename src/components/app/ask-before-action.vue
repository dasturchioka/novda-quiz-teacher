<script lang="ts" setup>
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

const emit = defineEmits(['do:action'])
defineProps<{ title?: string; description?: string }>()
</script>

<template>
	<div class="delete-item">
		<AlertDialog>
			<AlertDialogTrigger as-child>
				<slot name="trigger"></slot>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{{ title ?? `Ishonchingiz komilmi?` }}</AlertDialogTitle>
					<AlertDialogDescription>
						{{ description ?? `Bu ma'lumotlar qayta tiklanmaydi` }}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Yo'q</AlertDialogCancel>
					<AlertDialogAction @click="emit('do:action')">Ha</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</div>
</template>
