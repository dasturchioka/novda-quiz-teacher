<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import { ref } from 'vue'

const showPassword = ref(false)

const togglePassword = () => {
	showPassword.value = !showPassword.value
}
</script>

<template>
	<div class="register-page h-screen flex flex-col justify-center items-center">
		<div class="w-full max-w-md mx-auto p-6">
			<Tabs defaultValue="register" class="w-full">
				<TabsList class="grid w-full grid-cols-2">
					<TabsTrigger value="register">Ro'yxatdan o'tish</TabsTrigger>
					<TabsTrigger value="login">Login</TabsTrigger>
				</TabsList>
				<TabsContent value="register">
					<form class="space-y-4">
						<div class="space-y-2">
							<Label for="register-fullname">Ism familiya</Label>
							<Input id="register-fullname" placeholder="Faqat lotin harflarida" required />
						</div>
						<div class="space-y-2">
							<Label for="register-password">Parol</Label>
							<div class="relative">
								<Input
									id="register-password"
									:type="[showPassword ? 'text' : 'password']"
									placeholder="Kamida 8 ta belgi"
									required
								/>
								<Button
									variant="ghost"
									type="button"
									class="absolute right-3 top-1/2 -translate-y-1/2"
									@click="togglePassword"
								>
									<EyeOffIcon v-if="showPassword" class="h-4 w-4 text-gray-500" />
									<EyeIcon v-else class="h-4 w-4 text-gray-500" />
								</Button>
							</div>
						</div>
						<Button type="submit" class="w-full">Ro'yxatdan o'tish</Button>
					</form>
				</TabsContent>
				<TabsContent value="login">
					<form @submit.prevent="" class="space-y-4">
						<div class="space-y-2">
							<Label for="login-oneid">OneId</Label>
							<Input id="login-oneid" placeholder="Tizim sizga bergan oneId" required />
						</div>
						<div class="space-y-2">
							<Label for="login-password">Parol</Label>
							<div class="relative">
								<Input
									id="login-password"
									:type="[showPassword ? 'text' : 'password']"
									placeholder="Parolingizni eslang"
									required
								/>
								<Button
									variant="ghost"
									type="button"
									class="absolute right-3 top-1/2 -translate-y-1/2"
									@click="togglePassword"
								>
									<EyeOffIcon v-if="showPassword" class="h-4 w-4 text-gray-500" />
									<EyeIcon v-else class="h-4 w-4 text-gray-500" />
								</Button>
							</div>
						</div>
						<Button type="submit" class="w-full">Login</Button>
					</form>
				</TabsContent>
			</Tabs>
		</div>
		<footer>
			<a href="https://dasturchioka.uz" target="_blank" class="font-semibold"
				><b class="text-blue-400">@</b> dasturchioka</a
			>
		</footer>
	</div>
</template>
