<script lang="ts" setup>
import { LoaderCircle } from 'lucide-vue-next'
import { useLoading } from '@/stores/loading'
import { storeToRefs } from 'pinia'

const loadingStore = useLoading()

const { loading } = storeToRefs(loadingStore)
</script>

<template>
	<div v-show="loading" class="loading">
		<LoaderCircle class="animate-spin size-8" />
		<h2 class="text-xl font-bold">Yuklanmoqda...</h2>
	</div>
</template>
