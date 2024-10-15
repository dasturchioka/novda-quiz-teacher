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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'

const loadingStore = useLoading()
const examStore = useExams()
const route = useRoute()
const classroomStore = useClassroom()

const { loading } = storeToRefs(loadingStore)
const { singleClassroom, singleClassroomsStudents } = storeToRefs(classroomStore)

onMounted(async () => {
	await classroomStore.getSingleClassroom(route.params.oneId as string, 1)
	console.log(singleClassroom.value)
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
	const worksheet = XLSX.utils.json_to_sheet(newStudentsFormat)

	const columnWidths = await calculateSize(newStudentsFormat)

	worksheet['!cols'] = columnWidths

	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, `Talabalar`)

	XLSX.writeFile(workbook, `${singleClassroom.value?.name}_talabalari.xlsx`)
}

const exportScores = async (examOneId: string) => {
	const existExam = singleClassroom.value.exams.find(e => e.oneId === examOneId)

	const newScoresFormat = existExam.scores.map((s, index) => {
		return {
			'№': index + 1,
			Talaba: `${s.student.fullname}, ${s.student.oneId}`,
			Imtihon: existExam.name,
			'Savollar soni': s.questionsNumber,
			"To'g'ri javoblar soni": s.correctAnswers,
			Foiz: `${s.percentage}%`,
			'Natija id': s.id,
		}
	})
	const worksheet = XLSX.utils.json_to_sheet(newScoresFormat)

	const columnWidths = await calculateSize(newScoresFormat)

	worksheet['!cols'] = columnWidths

	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, `Natijalar`)

	XLSX.writeFile(workbook, `${existExam.name}_${singleClassroom.value.name}_natijalari.xlsx`)
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
							<div class="mt-4 flex space-x-2 justify-end">
								<div class="scores flex items-center space-x-4">
									<p v-if="exam.active" class="text-sm font-semibold">
										Nechta kishi imtihonni yakunladi?
									</p>
									<Dialog>
										<DialogTrigger as-child>
											<Button v-if="exam.active">Natijalar</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Imtihonni yakunlaganlar</DialogTitle>
												<DialogDescription>
													To'liq natijalarni imtihonni tugatgandan keyin ko'rsangiz bo'ladi
												</DialogDescription>
											</DialogHeader>
											<div class="flex flex-col gap-2">
												<p class="font-bold text-lg">{{ exam.scores.length }} ta talaba</p>
												<div class="flex gap-2">
													<p v-for="(student, index) in exam.scores" :key="index">
														{{ student.student.fullname }},
													</p>
												</div>
											</div>
											<DialogClose as-child>
												<Button>Yopish</Button>
											</DialogClose>
										</DialogContent>
									</Dialog>
								</div>
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
									<Button @click="exportScores(exam.oneId)">
										<Download class="size-5 mr-2" /> Natijalarni olish
									</Button>
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
