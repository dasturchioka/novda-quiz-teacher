<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>

<template>
	<div class="app min-h-screen">
		<Toaster position="top-center" />
		<RouterView></RouterView>
	</div>
</template>

<style scoped></style>
