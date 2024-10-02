import { teacherInstance } from '@/http'
import { Package } from '@/models'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export const usePackage = defineStore('package-store', () => {
	const packages = ref<Package[]>([])

	async function createPackage(name: string) {
		try {
			if (!name) {
				toast('Nomini kiriting')
				return
			}

			const oneId = Cookies.get('oneId')

			const response = await teacherInstance.post('/create-question-package', {
				name,
				teacherOneId: oneId,
			})

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			packages.value.push(response.data.package)
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

	async function getAllPackages() {
		try {
			const response = await teacherInstance.get('/get-all-packages')

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			packages.value = response.data.packages
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	return { packages, createPackage, getAllPackages }
})
