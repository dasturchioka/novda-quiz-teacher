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
import Button from '../ui/button/Button.vue';

const emit = defineEmits(['do:action'])
</script>

<template>
	<div class="delete-package">
		<AlertDialog>
			<AlertDialogTrigger as-child>
				<slot name="trigger"></slot>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
					<AlertDialogDescription> Bu ma'lumotlar qayta tiklanmaydi </AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Yo'q</AlertDialogCancel>
					<AlertDialogAction @click="emit('do:action')">Ha</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</div>
</template>
