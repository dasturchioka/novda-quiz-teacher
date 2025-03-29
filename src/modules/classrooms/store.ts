import { teacherInstance } from '@/http'
import { Classroom, Student } from '@/models'
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

	async function getAllClassrooms(students: number = 0) {
		try {
			const oneId = Cookies.get('oneId')

			const response = await teacherInstance.get(
				`/get-classrooms?students=${students}&teacherOneId=${oneId}`
			)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			classrooms.value = response.data.classrooms
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function editClassroom(name: string, classroomOneId: string) {
		try {
			const response = await teacherInstance.put(`/edit-classroom/${classroomOneId}`, { name })

			if (!response) {
				toast('Internet yoki server bilan aloqa mavjud emas')
				return
			}

			if (response.data.status !== 'ok') {
				toast(response.data.msg)
				return
			}

			const data = await response.data

			if (singleClassroom.value?.oneId === classroomOneId) {
				singleClassroom.value.name = data.classroom.name
			}

			const existClassroom = classrooms.value.find(c => {
				return c.oneId === classroomOneId
			})

			if (existClassroom) existClassroom.name = data.classroom.name

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

	async function getSingleClassroom(classRoomOneId: string, students: number = 0) {
		try {
			const response = await teacherInstance.get(
				`/get-single-classroom?students=${students}&classroomOneId=${classRoomOneId}`
			)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			singleClassroom.value = response.data.classroom
			singleClassroomsStudents.value.classRoomOneId = classRoomOneId
			singleClassroomsStudents.value.students = response.data.students
			return
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function removeStudentFromClassroom(payload: {
		classroomOneId: string
		studentOneId: string
	}) {
		try {
			const response = await teacherInstance.put(`/remove-student`, {
				classroomOneId: payload.classroomOneId,
				studentOneId: payload.studentOneId,
			})

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			const data = await response.data

			if (data.status === 'bad') {
				toast(data.msg)
				return
			}

			singleClassroomsStudents.value.students = singleClassroomsStudents.value.students.filter(
				student => student.oneId !== payload.studentOneId
			)
			toast('Talaba sinfdan muvaffaqiyatli olib tashlandi')
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	async function deleteClassroom(payload: { classroomOneId: string }) {
		try {
			const teacherOneId = Cookies.get('oneId')
			const response = await teacherInstance.delete(
				`/delete-classroom/${payload.classroomOneId}/${teacherOneId}`
			)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			const data = await response.data

			if (data.status === 'bad') {
				toast(data.msg)
				return
			}

			classrooms.value = classrooms.value.filter(
				classroom => classroom.oneId !== payload.classroomOneId
			)
			if (singleClassroom.value && singleClassroom.value.oneId === payload.classroomOneId) {
				singleClassroom.value = null
			}
			if (singleClassroomsStudents.value.classRoomOneId === payload.classroomOneId) {
				singleClassroomsStudents.value = {
					classRoomOneId: '',
					students: [],
				}
			}
			toast(data.msg)
		} catch (error: any) {
			toast(
				error.message ||
					error.response.data.msg ||
					"Qandaydir xatolik yuzaga keldi, boshqatdan urinib ko'ring"
			)
		}
	}

	return {
		classrooms,
		createClassroom,
		singleClassroom,
		singleClassroomsStudents,
		getAllClassrooms,
		editClassroom,
		getSingleClassroom,
		removeStudentFromClassroom,
		deleteClassroom
	}
})
