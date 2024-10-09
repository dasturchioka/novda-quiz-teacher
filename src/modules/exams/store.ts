import { teacherInstance } from '@/http'
import { Exam } from '@/models'
import Cookies from 'js-cookie'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useClassroom } from '../classrooms/store'

export const useExams = defineStore('exams-store', () => {
	const allExams = ref<Exam[]>()
	const classroomStore = useClassroom()

	const { singleClassroom } = storeToRefs(classroomStore)

	async function startExam(payload: {
		name: string
		packageOneId: string
		classroomOneId: string
	}) {
		try {
			const teacherOneId = Cookies.get('oneId')

			const response = await teacherInstance.post('/start-exam', { ...payload, teacherOneId })

			if (!response) {
				toast("Imtihon ochilmadi, boshqatdan urinib ko'ring")
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			const data = await response.data

			if (!singleClassroom.value) return

			singleClassroom.value.exams.push(data.exam)

			toast(data.msg)
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function finishExam(examOneId: string) {
		try {
			const teacherOneId = Cookies.get('oneId')

			const response = await teacherInstance.put('/finish-exam', { examOneId, teacherOneId })

			if (!response) {
				toast("Imtihon tugatilmadi, boshqatdan urinib ko'ring")
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			const data = await response.data

			if (!singleClassroom.value) return

			singleClassroom.value.exams = singleClassroom.value.exams.map((e: Exam) => {
				if (e.oneId === data.exam.oneId) {
					return { ...data.exam, active: false }
				}
			})

			allExams.value?.push(data.exam)
			toast(data.msg)
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function deleteExam(examOneId: string) {
		try {
			const response = await teacherInstance.delete(`/delete-exam/${examOneId}`)

			if (!response) {
				toast("Imtihon tugatilmadi, boshqatdan urinib ko'ring")
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			const data = await response.data

			if (!singleClassroom.value) return

			singleClassroom.value.exams = singleClassroom.value.exams.filter((e: Exam) => {
				return e.oneId !== examOneId
			})

			allExams.value?.push(data.exam)
			toast(data.msg)
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function getExams(all: string) {
		try {
			const teacherOneId = Cookies.get('oneId')

			const response = await teacherInstance.get(`/get-exams/${teacherOneId}?all=${all}`)

			if (!response) {
				toast("Internet yoki server bilan aloqa yo'q, boshqatdan urinib ko'ring")
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			const data = await response.data

			allExams.value = data.exams
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function getDataPreExam() {
		try {
			const teacherOneId = Cookies.get('oneId')

			const response = await teacherInstance.get('/get-data-pre-exam/' + teacherOneId)

			if (!response) {
				toast("Internet yoki server bilan aloqa yo'q, boshqatdan urinib ko'ring")
				return { packages: null, classrooms: null }
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return { packages: null, classrooms: null }
			}

			const data = await response.data

			return { packages: data.packages, classrooms: data.classrooms }
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	return {
		startExam,
		allExams,
		getExams,
		getDataPreExam,
		finishExam,
		deleteExam,
	}
})
