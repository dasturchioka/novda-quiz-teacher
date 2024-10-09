<script lang="ts" setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProfile } from '@/modules/profile/store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const profileStore = useProfile()

const { profile } = storeToRefs(profileStore)

onMounted(async () => {
	await profileStore.getProfile()
	console.log(profile.value)
})
</script>

<template>
	<div class="profile page">
		<div v-if="profile" class="min-h-screen font-manrope">
			<div class="max-w-7xl mx-auto space-y-6">
				<header class="bg-blue-500 text-white p-6 rounded-lg shadow-md">
					<h1 class="text-3xl font-bold font-noto">Profil</h1>
				</header>

				<Card class="w-full">
					<CardHeader>
						<CardTitle>{{ profile.fullname }}</CardTitle>
						<CardDescription>{{ profile.oneId }}</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</div>
	</div>
</template>
