<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { type HeaderVariants, headerVariants } from '.'
import { cn } from '@/lib/utils'

const props = defineProps<{
	variant?: HeaderVariants['variant']
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<h1 :class="cn(headerVariants({ variant }), props.class)">
		<slot />
	</h1>
</template>
