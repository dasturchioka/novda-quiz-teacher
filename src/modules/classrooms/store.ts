import { teacherInstance } from '@/http'
import { Classroom, Package, Question, Student } from '@/models'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export const useClassroom = defineStore('classroom-store', () => {
	const classrooms = ref<Classroom[]>([])
	const singleClassroomsStudents = ref<{
		classRoomOneId: string
		students: Student[]
	}>({
		classRoomOneId: '',
		students: [],
	})
	const singleClassroom = ref<Classroom>()

	async function createClassroom(name: string) {
		try {
			if (!name) {
				toast('Nomini kiriting')
				return
			}

			const oneId = Cookies.get('oneId')

			const response = await teacherInstance.post('/create-classroom', {
				name,
				teacherOneId: oneId,
			})

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			classrooms.value.push(response.data.classroom)
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
			const oneId = Cookies.get('oneId')
			console.log(oneId);
			
			const response = await teacherInstance.get(
				`/get-all-packages?questions=${questions}&teacherOneId=${oneId}`
			)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			// packages.value = response.data.packages
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	// async function getSinglePackage(oneId: string, questions: number = 0) {
	// 	try {
	// 		const response = await teacherInstance.get(
	// 			`/get-single-package/${oneId}?questions=${questions}`
	// 		)

	// 		if (!response) {
	// 			toast('Server yoki internet bilan aloqa mavjud emas')
	// 			return
	// 		}

	// 		if (response.data.status === 'bad') {
	// 			toast(response.data.msg)
	// 			return
	// 		}

	// 		singlePackage.value = response.data.singlePackage
	// 		if (
	// 			singlePackageQuestions.value &&
	// 			singlePackageQuestions.value.packageOneId === response.data.singlePackage.oneId
	// 		) {
	// 			// Update the questions
	// 			singlePackageQuestions.value.questions = response.data.questions
	// 		} else {
	// 			// If the packageOneId is different or singlePackageQuestions is null, update the whole object
	// 			singlePackageQuestions.value = {
	// 				packageOneId: response.data.singlePackage.oneId,
	// 				questions: response.data.questions,
	// 			}
	// 		}

	// 		return
	// 	} catch (error: any) {
	// 		toast(
	// 			error.message ||
	// 				error.response.data.msg ||
	// 				"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
	// 		)
	// 	}
	// }

	// async function addQuestionToPackage(data: FormData, packageOneId: string) {
	// 	try {
	// 		const response = await teacherInstance.post('/add-question/' + packageOneId, data)

	// 		if (!response) {
	// 			toast('Server yoki internet bilan aloqa mavjud emas')
	// 			return
	// 		}

	// 		if (response.data.status === 'bad') {
	// 			toast(response.data.msg)
	// 			return
	// 		}

	// 		if (
	// 			singlePackageQuestions.value &&
	// 			singlePackageQuestions.value.packageOneId === response.data.packageOneId
	// 		) {
	// 			// Update the questions
	// 			singlePackageQuestions.value.questions.push(response.data.question)
	// 		}

	// 		toast(response.data.msg)
	// 		return
	// 	} catch (error: any) {
	// 		toast(
	// 			error.message ||
	// 				error.response.data.msg ||
	// 				"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
	// 		)
	// 	}
	// }

	return {
		classrooms,
		createClassroom,
		getAllPackages,
		getSinglePackage,
		addQuestionToPackage,
		singleClassroom,
		singleClassroomsStudents,
	}
})
