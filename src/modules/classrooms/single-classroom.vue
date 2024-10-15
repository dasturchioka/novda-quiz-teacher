<script lang="ts" setup>
import DeleteItem from '@/components/app/ask-before-action.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { Classroom } from '@/models'
import { useClipboard } from '@vueuse/core'
import { Check, Clipboard, LogIn, Pencil, Trash, X } from 'lucide-vue-next'
import { computed, ref, toRefs } from 'vue'
import { useClassroom } from './store'

const classroomStore = useClassroom()

const props = defineProps<{ singleClassroom: Classroom }>()

const { singleClassroom } = toRefs(props)

const newName = ref(singleClassroom.value.name ?? '')

const isEditingClassroom = ref(false)

const toggleEditingClassroom = (payload: boolean) => {
	isEditingClassroom.value = payload
}

const disableConfirmButton = computed(() => {
	if (newName.value.length <= 2) {
		return true
	}

	return false
})

const editClassroom = async () => {
	await classroomStore.editClassroom(newName.value, singleClassroom.value.oneId)
	isEditingClassroom.value = false
}

const { copy, copied } = useClipboard({ source: singleClassroom.value.oneId })
</script>

<template>
	<div
		class="single-classroom p-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 border dark:text-neutral-50 rounded-md transition-all relative hover:bg-neutral-200 dark:hover:bg-neutral-900"
		style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
	>
		<div class="flex items-center">
			<h1
				v-show="!isEditingClassroom"
				class="sm:text-xl text-lg font-bold font-manrope truncate group flex items-center"
			>
				{{ singleClassroom.name }}
				<div
					class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2"
				>
					<button @click="toggleEditingClassroom(true)">
						<Pencil class="size-4" />
					</button>
					<DeleteItem
						@do:action="classroomStore.deleteClassroom({ classroomOneId: singleClassroom.oneId })"
					>
						<template #trigger>
							<button>
								<Trash class="size-4 text-red-500" />
							</button>
						</template>
					</DeleteItem>
				</div>
			</h1>
			<form
				@submit.prevent="editClassroom"
				class="flex items-center space-x-2"
				v-show="isEditingClassroom"
			>
				<Input autofocus v-model:model-value="newName" />
				<button type="button" @click="toggleEditingClassroom(false)">
					<X class="size-4" />
				</button>
				<button
					:disabled="disableConfirmButton"
					type="submit"
					class="disabled:text-gray-400 disabled:cursor-not-allowed"
				>
					<Check class="size-4" />
				</button>
			</form>
		</div>
		<p class="truncate">
			<b>{{ singleClassroom.oneId }}</b>
			<button @click="copy(singleClassroom.oneId)" class="bg-black rounded p-1 ml-2">
				<Clipboard v-show="!copied" class="size-3 stroke-[3] text-white" />
				<Check v-show="copied" class="size-3 stroke-[3] text-white" />
			</button>
		</p>
		<p class="truncate">
			<b>{{ singleClassroom.studentsCount }}</b> ta o'quvchi
		</p>
		<Button
			@click="$router.push(`/classroom/${singleClassroom.oneId}`)"
			class="w-full mt-6"
			variant="outline"
			><LogIn class="size-4 mr-2" /> Kirish</Button
		>
	</div>
</template>
