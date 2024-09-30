<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue'
import { Plus } from 'lucide-vue-next'
import { toRefs } from 'vue'

const prop = defineProps<{ asWhat: 'card' | 'button' }>()

const { asWhat } = toRefs(prop)
</script>

<template>
	<div class="create-package">
		<Button v-if="asWhat === 'button'"><Plus class="size-5 mr-2" /> Yangi paket qo'shish</Button>
		<Button v-if="asWhat === 'card'" class="h-full px-4 w-full"
		variant="outline"
			><Plus class="size-5 mr-2" /> Yangi paket qo'shish</Button
		>
	</div>
</template>
