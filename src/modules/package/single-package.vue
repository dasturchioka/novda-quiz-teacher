<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import { Package } from '@/models'
import { toRefs } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{ singlePackage: Package }>()

const { singlePackage } = toRefs(props)
</script>

<template>
	<div
		class="single-package p-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 rounded-md transition-all hover:bg-neutral-200 dark:hover:bg-neutral-900"
		style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
	>
		<h1 class="sm:text-2xl text-lg font-bold font-manrope truncate">{{ singlePackage.name }}</h1>
		<p class="truncate">
			<b>{{ singlePackage.questions.length }}</b> ta savol
		</p>
		<Button class="w-full mt-6" variant="outline">Ko'rish</Button>
	</div>
</template>
