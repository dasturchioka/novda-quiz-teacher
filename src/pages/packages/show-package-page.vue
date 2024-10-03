<script lang="ts" setup>
import HoverCard from '@/components/ui/hover-card/HoverCard.vue'
import HoverCardContent from '@/components/ui/hover-card/HoverCardContent.vue'
import HoverCardTrigger from '@/components/ui/hover-card/HoverCardTrigger.vue'
import EditQuestion from '@/modules/packages/edit-question.vue'
import { usePackage } from '@/modules/packages/store'
import AddQuestions from '@/modules/questions/add-questions.vue'
import { Globe, Lock, User } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const packageStore = usePackage()

const { singlePackage, singlePackageQuestions } = storeToRefs(packageStore)

onMounted(async () => {
	await packageStore.getSinglePackage(route.params.oneId as string, 1)
})

</script>

<template>
	<div class="show-package">
		<div v-if="singlePackage">
			<div class="top bg-neutral-200 sm:p-6 p-4 rounded-lg">
				<h1 class="sm:text-3xl text-xl font-noto font-bold flex items-center">
					{{ singlePackage.name }}
					<HoverCard :open-delay="20" :close-delay="20">
						<HoverCardTrigger as-child
							><Lock
								class="sm:size-6 size-4 ml-2 text-red-500 stroke-[3px]"
								v-if="singlePackage.status === 'Private'" />
							<Globe
								class="sm:size-6 size-4 ml-2 text-red-500 stroke-[3px]"
								v-if="singlePackage.status === 'Public'"
						/></HoverCardTrigger>
						<HoverCardContent>{{
							singlePackage.status === 'Private'
								? "Paket faqatgina sizga ko'rinadi"
								: 'Paket hamma uchun ochiq'
						}}</HoverCardContent>
					</HoverCard>
				</h1>
				<p class="flex items-center font-manrope font-semibold mt-2">
					<User class="size-5 mr-2" /> {{ singlePackage.teacher.fullname }}
				</p>
			</div>
			<div class="questions">
				<div
					v-if="
						singlePackageQuestions && singlePackageQuestions.packageOneId === singlePackage.oneId
					"
					class="flex flex-col justify-center my-6 space-y-4"
				>
					<AddQuestions type="long" :package-one-id="String(route.params.oneId)" />
					<div v-for="(question, index) in singlePackageQuestions.questions" :key="index">
						<EditQuestion :question="question" :index="index + 1" />
					</div>
				</div>
				<div v-else class="flex flex-col items-center justify-center my-6 space-y-4">
					<h2 class="sm:text-xl text-lg text-center font-manrope font-semibold">
						Bu paketda savollar mavjud emas
					</h2>
					<AddQuestions type="long" :package-one-id="String(route.params.oneId)" />
				</div>
			</div>
		</div>
	</div>
</template>
