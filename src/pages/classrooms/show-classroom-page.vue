<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { onMounted } from 'vue'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClipboardIcon, Download, StopCircle, Trash, UsersRound } from 'lucide-vue-next'
import { useClassroom } from '@/modules/classrooms/store'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import askBeforeAction from '@/components/app/ask-before-action.vue'
import { useExams } from '@/modules/exams/store'
import CreateExam from '@/modules/exams/create-exam.vue'
import { useLoading } from '@/stores/loading'
import Loading from '@/components/app/loading.vue'

const loadingStore = useLoading()
const examStore = useExams()
const route = useRoute()
const classroomStore = useClassroom()

const { loading } = storeToRefs(loadingStore)
const { singleClassroom, singleClassroomsStudents } = storeToRefs(classroomStore)

onMounted(async () => {
	await classroomStore.getSingleClassroom(route.params.oneId as string, 1)
})

const calculateSize = async (data: any) => {
	// Get keys (column headers)
	const keys = Object.keys(data[0])

	// Calculate the max length for each column
	const columnWidths = keys.map(key => {
		const maxLength = Math.max(
			key.length, // Header length
			...data.map((item: any) => (item[key] ? String(item[key]).length : 0)) // Data length
		)
		return { wch: maxLength + 2 } // Adding some padding (e.g., 2 extra characters)
	})

	return columnWidths
}

const exportStudents = async () => {
	const newStudentsFormat = singleClassroomsStudents.value.students.map((s, index) => {
		return {
			'Tartib raqam': index + 1,
			OneId: s.oneId,
			'Ism Familiya': s.fullname,
			Parol: s.password,
			Sinfxonalar: s.classrooms.map(classroom => classroom.name).join(', '),
			'Oxirgi natija': s.scores.length ? s.scores[s.scores.length - 1] : 'Mavjud emas',
		}
	})
	// Create a new worksheet from the JSON data
	const worksheet = XLSX.utils.json_to_sheet(newStudentsFormat)

	// Calculate the column widths
	const columnWidths = await calculateSize(newStudentsFormat)

	// Assign the column widths to the worksheet
	worksheet['!cols'] = columnWidths

	// Create a new workbook and append the worksheet
	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, `Talabalar`)

	// Generate the Excel file and trigger the download
	XLSX.writeFile(workbook, `${singleClassroom.value?.name}_talabalari.xlsx`)
}
</script>

<template>
	<div class="min-h-screen font-manrope">
		<div v-if="!singleClassroom && loading">
			<Loading />
		</div>
		<div v-else-if="singleClassroom" class="max-w-7xl mx-auto space-y-6">
			<header class="bg-blue-500 text-white p-6 rounded-lg shadow-md">
				<h1 class="text-3xl font-bold font-noto">Sinfxona: {{ singleClassroom.name }}</h1>
				<p class="">{{ singleClassroom.oneId }}</p>
			</header>

			<Card class="w-full">
				<CardHeader>
					<CardTitle>Talabalar</CardTitle>
					<CardDescription>{{
						singleClassroomsStudents.students && singleClassroomsStudents.students.length
							? `${singleClassroomsStudents.students.length} ta talaba`
							: ''
					}}</CardDescription>
				</CardHeader>
				<CardContent>
					<div v-if="singleClassroomsStudents.students.length" class="overflow-x-auto">
						<div class="inline-block min-w-full align-middle">
							<div class="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
								<Table class="overflow-x-scroll w-full">
									<TableHeader>
										<TableRow>
											<TableHead class="whitespace-nowrap">№</TableHead>
											<TableHead class="whitespace-nowrap">OneId</TableHead>
											<TableHead class="whitespace-nowrap">Ism Familiya</TableHead>
											<TableHead class="whitespace-nowrap">Parol</TableHead>
											<TableHead class="whitespace-nowrap">Sinfxonalar</TableHead>
											<TableHead class="whitespace-nowrap">Oxirgi natija</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow
											v-for="(student, index) in singleClassroomsStudents.students"
											:key="index"
										>
											<TableCell class="whitespace-nowrap"
												><b>{{ index + 1 }}</b></TableCell
											>
											<TableCell class="whitespace-nowrap">{{ student.oneId }}</TableCell>
											<TableCell class="whitespace-nowrap"
												><b>{{ student.fullname }}</b></TableCell
											>
											<TableCell class="whitespace-nowrap">{{ student.password }}</TableCell>
											<TableCell class="whitespace-nowrap">
												<Badge
													v-for="c in student.classrooms"
													:key="c.id"
													variant="default"
													class="bg-blue-500 hover:bg-blue-400 mr-1 mb-1"
												>
													{{ c.name }}
												</Badge>
											</TableCell>
											<TableCell class="whitespace-nowrap">{{
												student.lastScore ?? "Yo'q"
											}}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</div>
						<Button class="mt-4" @click="exportStudents">
							<Download class="size-5 mr-2" /> Yuklab olish
						</Button>
					</div>
					<div v-else class="text-center py-8 bg-gray-50 rounded-lg">
						<UsersRound class="size-16 text-gray-400 mx-auto mb-3" />
						<p class="text-gray-600 mb-3 font-semibold font-manrope">Hali talabalar qo'shilmagan</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Imtihonlar</CardTitle>
					<CardDescription>{{
						singleClassroom.exams && singleClassroom.exams.length
							? `${singleClassroom.exams.length} ta imtihon`
							: ''
					}}</CardDescription>
				</CardHeader>
				<CardContent>
					<div
						v-if="!singleClassroom.exams || singleClassroom.exams.length === 0"
						class="text-center py-8 bg-gray-50 rounded-lg"
					>
						<ClipboardIcon class="size-16 text-gray-400 mx-auto mb-3" />
						<p class="text-gray-600 mb-3 font-semibold font-manrope">Hali imtihonlar mavjud emas</p>
						<CreateExam :classroom="singleClassroom" as-what="button" />
					</div>
					<ul v-else class="space-y-2">
						<li
							v-for="exam in singleClassroom.exams"
							:key="exam.name"
							class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition duration-150 ease-in-out"
						>
							<div class="flex items-center justify-between flex-wrap space-y-4">
								<div>
									<h4 class="text-lg font-medium text-gray-800">{{ exam.name }}</h4>
									<p class="text-gray-600">
										Paketi: <b>{{ exam.packageOfExam.name }},</b>
										<b>{{ exam.packageOfExam.questionsCount }} ta savol</b>
									</p>
								</div>
								<div v-if="exam.active" class="text-right">
									<p class="text-sm text-gray-500">Imtihondagi talabalar</p>
									<p class="text-2xl font-bold text-indigo-600">{{ exam.studentsCount }}</p>
								</div>
							</div>
							<div class="mt-4 flex justify-end">
								<div v-if="exam.active">
									<askBeforeAction
										description="Siz ushbu imtihonni tugatmoqchisiz, imtihonni tugatmagan talabalarning natijalari saqlanmaydi"
										@do:action="examStore.finishExam(exam.oneId)"
									>
										<template #trigger>
											<Button variant="destructive">
												<StopCircle class="size-5 mr-2" /> Tugatish
											</Button>
										</template>
									</askBeforeAction>
								</div>
								<div v-else class="flex items-center space-x-2">
									<askBeforeAction @do:action="examStore.deleteExam(exam.oneId)">
										<template #trigger>
											<Button variant="destructive"> <Trash class="size-5" /> </Button>
										</template>
									</askBeforeAction>
									<Button><Download class="size-5 mr-2" /> Natijalarni olish </Button>
								</div>
							</div>
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
		<div v-else-if="!singleClassroom && !loading">Ma'lumot topilmadi</div>
	</div>
</template>
