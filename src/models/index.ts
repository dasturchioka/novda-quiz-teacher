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

export enum StatusPackage {
	Private,
	Public,
}
