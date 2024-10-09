import { teacherInstance } from '@/http'
import { Teacher } from '@/models'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export const useProfile = defineStore('profile-store', () => {
	const profile = ref<Teacher>()

	async function getProfile() {
		try {
			const teacherOneId = Cookies.get('oneId')

			const response = await teacherInstance.get(`/get-profile/${teacherOneId}`)

			if (!response) {
				toast("Server yoki internet bilan aloqa yo'q , boshqatdan urinib ko'ring")
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			profile.value = response.data.teacher
			return
		} catch (error) {
			toast(error.message || error.response.data.msg || error)
		}
	}

	return { getProfile, profile }
})
