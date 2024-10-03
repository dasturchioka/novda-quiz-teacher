import { teacherInstance } from '@/http'
import { Package, Question } from '@/models'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export const usePackage = defineStore('package-store', () => {
	const packages = ref<Package[]>([])
	const singlePackageQuestions = ref<{
		packageOneId: string
		questions: Question[]
	}>({
		packageOneId: '',
		questions: [],
	})
	const singlePackage = ref<Package>()

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

	async function getAllPackages(questions: number = 0) {
		try {
			const response = await teacherInstance.get(`/get-all-packages?questions=${questions}`)

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

	async function getSinglePackage(oneId: string, questions: number = 0) {
		try {
			const response = await teacherInstance.get(
				`/get-single-package/${oneId}?questions=${questions}`
			)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			singlePackage.value = response.data.singlePackage
			if (
				singlePackageQuestions.value &&
				singlePackageQuestions.value.packageOneId === response.data.singlePackage.oneId
			) {
				// Update the questions
				singlePackageQuestions.value.questions = response.data.questions
			} else {
				// If the packageOneId is different or singlePackageQuestions is null, update the whole object
				singlePackageQuestions.value = {
					packageOneId: response.data.singlePackage.oneId,
					questions: response.data.questions,
				}
			}

			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function addQuestionToPackage(data: FormData, packageOneId: string) {
		try {
			const response = await teacherInstance.post('/add-question/' + packageOneId, data)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			if (
				singlePackageQuestions.value &&
				singlePackageQuestions.value.packageOneId === response.data.packageOneId
			) {
				// Update the questions
				singlePackageQuestions.value.questions.push(response.data.question)
			}

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

	async function deleteQuestion(id: string) {
		try {
			const response = await teacherInstance.delete(`/delete-question/${id}`)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			if (singlePackageQuestions.value) {
				singlePackageQuestions.value.questions = singlePackageQuestions.value.questions.filter(
					question => question.id !== id
				)
			}

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

	async function deleteImageOfQuestion(id: string) {
		try {
			const response = await teacherInstance.delete(`/delete-image-of-question/${id}`)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			if (singlePackageQuestions.value) {
				singlePackageQuestions.value.questions = singlePackageQuestions.value.questions.map(
					question => {
						if (question.id === id) {
							question.img = ''
						}
						return question
					}
				)
			}

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

	async function editQuestion(data: FormData, packageOneId: string) {
		try {
			const response = await teacherInstance.put(`/edit-question`, data, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			if (singlePackageQuestions.value.packageOneId === response.data.question.package.oneId) {
				if (singlePackageQuestions.value) {
					singlePackageQuestions.value.questions = singlePackageQuestions.value.questions.map(q => {
						if (q.id === response.data.question.id) {
							q = response.data.question
						}
						
						return q
					})
				}
			}

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
		packages,
		createPackage,
		getAllPackages,
		getSinglePackage,
		addQuestionToPackage,
		singlePackage,
		singlePackageQuestions,
		deleteQuestion,
		editQuestion,
		deleteImageOfQuestion,
	}
})
