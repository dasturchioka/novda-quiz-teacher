<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import { Package } from '@/models'
import { Eye, Globe, Lock } from 'lucide-vue-next'
import { toRefs } from 'vue'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

const props = defineProps<{ singlePackage: Package }>()

const { singlePackage } = toRefs(props)
</script>

<template>
	<div
		class="single-package p-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 border dark:text-neutral-50 rounded-md transition-all relative hover:bg-neutral-200 dark:hover:bg-neutral-900"
		style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
	>
		<h1 class="sm:text-xl text-lg font-bold font-manrope truncate flex items-center">
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

			{{ singlePackage.name }}
		</h1>
		<p class="truncate">
			<b>{{ singlePackage.questions.length }}</b> ta savol
		</p>
		<Button class="w-full mt-6" variant="outline"><Eye class="size-4 mr-2" /> Ko'rish</Button>
	</div>
</template>
