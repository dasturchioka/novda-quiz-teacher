export interface Teacher {
	id: string
	oneId: string
	fullname: string
	password: string
	bio?: string
	[key: string]: any
}

export interface Question {
	question: string
	answer: string
	optionA: string
	optionB: string
	optionC: string
	optionD: string
	img?: File // for now, then it will be => string (file url)
	packageName: string
	packageOneId: string
}

export interface Package {
	name: string
	oneId: string
	teacherId?: string
	questions?: Question[]
}