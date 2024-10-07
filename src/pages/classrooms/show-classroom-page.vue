<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { onMounted, ref } from 'vue'
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
import { Check, Clipboard, Download, User } from 'lucide-vue-next'
import { useClassroom } from '@/modules/classrooms/store'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const classroomStore = useClassroom()

const { singleClassroom, singleClassroomsStudents } = storeToRefs(classroomStore)

onMounted(async () => {
	await classroomStore.getSingleClassroom(route.params.oneId as string, 1)
})

const { copy, copied } = useClipboard({ source: route.params.oneId as string })

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

const exportToExcel = async () => {
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
	<div class="show-classroom-page">
		<div v-if="singleClassroom">
			<div class="top bg-neutral-200 sm:p-6 p-4 rounded-lg">
				<h1 class="sm:text-3xl text-xl font-noto font-bold flex items-center">
					{{ singleClassroom.name }}
				</h1>
				<p class="truncate">
					<b>{{ singleClassroom.oneId }}</b>
					<button @click="copy(singleClassroom.oneId)" class="bg-black rounded p-1 ml-2">
						<Clipboard v-show="!copied" class="size-3 stroke-[3] text-white" />
						<Check v-show="copied" class="size-3 stroke-[3] text-white" />
					</button>
				</p>
				<p class="flex items-center font-manrope font-semibold mt-2">
					<User class="size-5 mr-2" /> {{ singleClassroom.teacher.fullname }}
				</p>
			</div>
			<div
				v-if="singleClassroomsStudents.students.length"
				class="students flex flex-col items-center"
			>
				<Table class="w-full">
					<TableHeader>
						<TableRow>
							<TableHead class="w-[30px]">№</TableHead>
							<TableHead>Ism familiya va OneId</TableHead>
							<TableHead>Parol</TableHead>
							<TableHead>Sinfxonalar</TableHead>
							<TableHead>Oxirgi Natija</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow
							v-for="(student, index) in singleClassroomsStudents.students"
							:key="student.id"
						>
							<TableCell class="font-medium">{{ index + 1 }}</TableCell>
							<TableCell>
								<div>{{ student.fullname }}</div>
								<div class="text-sm text-gray-500">{{ student.oneId }}</div>
							</TableCell>
							<TableCell>
								<div class="flex items-center space-x-2">
									<span>{{ student.password }}</span>
								</div>
							</TableCell>
							<TableCell>
								<div class="flex flex-wrap gap-1">
									<Badge
										v-for="classroom in student.classrooms"
										:key="classroom.name"
										variant="secondary"
									>
										{{ classroom.name }}
									</Badge>
								</div>
							</TableCell>
							<TableCell>{{
								student.scores.length
									? student.scores[student.scores.length - 1].questionsNumber +
									  '/' +
									  student.scores[student.scores.length - 1].correctAnswers
									: "Yo'q"
							}}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
				<Button class="self-end my-4" @click="exportToExcel">
					<Download class="size-5 mr-2" /> Yuklab olish
				</Button>
			</div>
			<div v-else class="my-4 font-manrope font-semibold text-xl">
				Bu sinfda hali o'quvchilar yo'q
			</div>
		</div>
		<div v-else>Ma'lumot topilmadi</div>
	</div>
</template>
