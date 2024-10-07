<script lang="ts" setup>
import AskBeforeAction from '@/components/app/delete-item.vue'
import { Button } from '@/components/ui/button/'
import { Exam } from '@/models'
import { Power, PowerOff, Search } from 'lucide-vue-next'
import { toRefs } from 'vue'

const props = defineProps<{ singleExam: Exam }>()

const { singleExam } = toRefs(props)
</script>

<template>
	<div
		class="single-package p-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 border dark:text-neutral-50 rounded-md transition-all relative hover:bg-neutral-200 dark:hover:bg-neutral-900"
		style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
	>
		<div class="flex items-center">
			<h1 class="sm:text-xl text-lg font-bold font-manrope truncate group flex items-center">
				{{ singleExam.name }}
			</h1>
		</div>
		<p class="truncate text-sm">
			<b>{{ singleExam.oneId }}</b>
		</p>
		<p class="truncate" v-if="singleExam.active">
			<b>{{ singleExam.studentsCount }}</b> ta o'quvchi
		</p>
		<p class="truncate" v-else>
			<b>{{ singleExam.studentsCount }}</b> ta o'quvchi qatnashdi
		</p>
		<p class="truncate">
			<b>{{ singleExam.classroom }}</b> ga biriktirilgan
		</p>
		<div class="active flex items-center space-x-2 mt-2"></div>
		<Button
			@click="$router.push(`/exam/${singleExam.oneId}`)"
			class="w-full mt-1"
			variant="outline"
		>
			<Search class="size-4 mr-2" /> Batafsil
		</Button>
		<AskBeforeAction
			v-if="singleExam.active"
			title="Imtihonni tugatmoqchimisiz?"
			description="Siz tugatganingizdan keyin imtihonni hali yakunlamagan talabalarning natijalari saqlanmaydi!"
		>
			<template #trigger>
				<Button class="w-full mt-2" variant="destructive">
					<PowerOff class="size-4 mr-2" /> Tugatish
				</Button>
			</template>
		</AskBeforeAction>
		<p v-if="!singleExam.active" class="italic text-center text-red-500 mt-2">Imtihon tugatilgan</p>
	</div>
</template>
