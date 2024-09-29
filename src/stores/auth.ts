import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Teacher } from '@/models'
import { teacherInstance } from '@/http'
import { toast } from 'vue-sonner'
import Cookies from 'js-cookie'

export const useAuth = defineStore('auth-store', () => {
	const teacherInfo = ref<Teacher>()

	async function register(data: Teacher) {
		try {
			const response = await teacherInstance.post('/register', data)

			if (response.data.status !== 'ok') {
				toast(response.data.msg)
				return
			}

			Cookies.set('token', response.data.token)
			teacherInfo.value = response.data.teacher
			toast(response.data.msg)
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	return {
		teacherInfo,
		register,
	}
})
