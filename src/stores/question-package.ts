import { defineStore } from 'pinia'
import { useOneId } from '@/composables/useOneId'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import axios from 'axios'
import { ref } from 'vue'
import { Question } from '@/models'



export const useQuestionPackage = defineStore('question-package-store', () => {
	const router = useRouter()
	const loading = ref(false)

	async function addQuestionPackage(name: string) {
		try {
			loading.value = true

			if (!name.length) {
				toast('Nomini kiritishingiz zarur')
				return
			}

			const { randomOneId } = useOneId()

			localStorage.setItem('question-package', JSON.stringify({ name, oneId: randomOneId.value }))

			await router.push(`/add-questions/${randomOneId.value}`)
		} catch (error: any) {
			toast(error.message || error || "Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring")
		} finally {
			loading.value = false
		}
	}

	async function addQuestions(question: Question, img: File) {
		try {
			loading.value = true
			if (img) {
				const formData = new FormData()

				formData.append('photo', img)
				formData.append('chat_id', '6148037654')
				formData.append('caption', JSON.stringify(question))

				const response = await axios.post(
					`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT}/sendPhoto`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				)

				if (!response) {
					toast("Savol yuborilmadi, boshqatdan urinib ko'ring")
					loading.value = false
					return { status: 'bad' }
				}

				if (!response.data.ok) {
					toast(response.data.description || "Savol yuborilmadi, boshqatdan urinib ko'ring")
					loading.value = false
					return { status: 'bad' }
				}

				toast("Savol qo'shildi")
				loading.value = false
				return { status: 'ok' }
			} else {
				const response = await axios.post(
					`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT}/sendMessage`,
					{ text: JSON.stringify(question), chat_id: '6148037654' },
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				)

				if (!response) {
					toast("Savol yuborilmadi, boshqatdan urinib ko'ring")
					loading.value = false
					return { status: 'bad' }
				}

				if (!response.data.ok) {
					toast(response.data.description || "Savol yuborilmadi, boshqatdan urinib ko'ring")
					loading.value = false
					return { status: 'bad' }
				}

				toast("Savol qo'shildi")
				loading.value = false
				return { status: 'ok' }
			}
		} catch (error: any) {
			toast(error.message || error || "Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring")
			loading.value = false
			return { status: 'bad' }
		}
	}

	return { addQuestionPackage, addQuestions, loading }
})
