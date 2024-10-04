<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import { Package } from '@/models'
import { Check, Eye, Globe, Lock, Pencil, X } from 'lucide-vue-next'
import { computed, ref, toRefs } from 'vue'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import Input from '@/components/ui/input/Input.vue'
import { usePackage } from './store'

const packageStore = usePackage()

const props = defineProps<{ singlePackage: Package }>()

const { singlePackage } = toRefs(props)

const newName = ref(singlePackage.value.name ?? '')

const isEditingPackage = ref(false)

const toggleEditingPackage = (payload: boolean) => {
	isEditingPackage.value = payload
}

const disableConfirmButton = computed(() => {
	if (newName.value.length <= 2) {
		return true
	}

	return false
})

const editPackage = async () => {
	await packageStore.editPackage(newName.value, singlePackage.value.oneId)
	isEditingPackage.value = false
}
</script>

<template>
	<div
		class="single-package p-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 border dark:text-neutral-50 rounded-md transition-all relative hover:bg-neutral-200 dark:hover:bg-neutral-900"
		style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
	>
		<div class="flex items-center">
			<HoverCard :open-delay="20" :close-delay="20">
				<HoverCardTrigger as-child
					><Lock
						class="size-5 mr-2 text-red-500 stroke-[3px]"
						v-if="singlePackage.status === 'Private'" />
					<Globe
						class="size-5 mr-2 text-green-500 stroke-[2px]"
						v-if="singlePackage.status === 'Public'"
				/></HoverCardTrigger>
				<HoverCardContent>{{
					singlePackage.status === 'Private'
						? "Paket faqatgina sizga ko'rinadi"
						: 'Paket hamma uchun ochiq'
				}}</HoverCardContent>
			</HoverCard>
			<h1
				v-show="!isEditingPackage"
				class="sm:text-xl text-lg font-bold font-manrope truncate group"
			>
				{{ singlePackage.name }}
				<button
					@click="toggleEditingPackage(true)"
					class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
				>
					<Pencil class="size-4" />
				</button>
			</h1>
			<form
				@submit.prevent="editPackage"
				class="flex items-center space-x-2"
				v-show="isEditingPackage"
			>
				<Input autofocus v-model:model-value="newName" />
				<button type="button" @click="toggleEditingPackage(false)">
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
			<b>{{ singlePackage.questionCount }}</b> ta savol
		</p>
		<Button
			@click="$router.push(`/package/${singlePackage.oneId}`)"
			class="w-full mt-6"
			variant="outline"
			><Eye class="size-4 mr-2" /> Ko'rish</Button
		>
	</div>
</template>
