import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Teacher } from '@/models'
import { teacherInstance } from '@/http'
import { toast } from 'vue-sonner'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

export const useAuth = defineStore('auth-store', () => {
	const teacherInfo = ref<Teacher>()
	const router = useRouter()

	async function register(data: Teacher) {
		try {
			const response = await teacherInstance.post('/register', data)

			if (response.data.status !== 'ok') {
				toast(response.data.msg)
				return
			}

			Cookies.set('token', response.data.token)
			Cookies.set('oneId', response.data.teacher.oneId)
			teacherInfo.value = response.data.teacher
			toast(response.data.msg)
			await router.push('/')
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function login(data: Teacher) {
		try {
			const response = await teacherInstance.post('/login', data)

			if (response.data.status !== 'ok') {
				toast(response.data.msg)
				return
			}

			Cookies.set('token', response.data.token)
			Cookies.set('oneId', response.data.teacher.oneId)
			teacherInfo.value = response.data.teacher
			toast(response.data.msg)
			await router.push('/')
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function check() {
		const token = Cookies.get('token')
		const oneId = Cookies.get('oneId')

		try {
			if (!token || !oneId) {
				await router.push('/auth')
				Cookies.remove('token')
				Cookies.remove('oneId')
				toast('Boshqatdan tizimga kiring')
				return
			}

			const response = await teacherInstance.get(`/check/${oneId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				await router.push('/auth')
				Cookies.remove('token')
				Cookies.remove('oneId')
				return
			}

			if (response.data.status === 'ok') {
				Cookies.set('token', response.data.token)
				Cookies.set('oneId', response.data.teacher.oneId)
				teacherInfo.value = response.data.teacher
			}
		} catch (error: any) {
			console.log(error)
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
		check,
		login,
	}
})
