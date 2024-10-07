export interface Teacher {
	id: string
	oneId: string
	fullname: string
	password: string
	bio?: string
	[key: string]: any
}

export interface Question {
	id: string
	questionText: string
	optionA: string
	optionB: string
	optionC: string
	optionD: string
	answer: string
	img?: string
	package?: Package
	packageId?: string
}

export interface Package {
	id: string
	oneId: string
	name: string
	status: StatusPackage
	teacher: Teacher
	questions: Question[]
	teacherId: string
	[key: string]: any
}

export interface Classroom {
	id: string
	oneId: string
	name: string
	teacher: Teacher
	students: Student[]
	teacherId: string
	[key: string]: any
}

export interface Student {
	id: string
	oneId: string
	fullname: string
	classrooms: Classroom[]
	password: string
	scores: Score[]
	[key: string]: any
}

export interface Score {
	id: string
	oneId: string
	correctAnswers: number
	exam: Exam
	student: Student
	examId: string
	questionsNumber: number
	studentId: string
	[key: string]: any
}

export interface Exam {
	id: string
	oneId: string
	packageOfExam: Package
	name: string
	classroom: Classroom
	teacher: Teacher
	students: Student[]
	packageId: string
	classromId: string
	active: boolean
	teacherId: string
	score: Score[]
	[key: string]: any
}

export type StatusPackage = 'Private' | 'Public'
