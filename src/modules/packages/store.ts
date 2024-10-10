import { teacherInstance } from '@/http'
import { Package, Question } from '@/models'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Document, ImageRun, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver' // For saving the file locally

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
			const oneId = Cookies.get('oneId')
			console.log(oneId)

			const response = await teacherInstance.get(
				`/get-all-packages?questions=${questions}&teacherOneId=${oneId}`
			)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
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

	async function editPackage(name: string, packageOneId: string) {
		try {
			const response = await teacherInstance.put(`/edit-package/${packageOneId}`, { name })

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			const data = await response.data

			if (singlePackage.value?.oneId === packageOneId) {
				singlePackage.value.name = data.package.name
			}

			const existPackage = packages.value.find(p => {
				return p.oneId === packageOneId
			})

			if (existPackage) existPackage.name = data.package.name

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

	async function deletePackage(packageOneId: string) {
		try {
			const response = await teacherInstance.delete(`/delete-package/${packageOneId}`)

			if (!response) {
				toast('Server yoki internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status === 'bad') {
				toast(response.data.msg)
				return
			}

			if (singlePackage.value?.oneId === packageOneId) {
				singlePackage.value = {} as Package
			}

			packages.value = packages.value.filter(p => p.oneId !== packageOneId)

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

	const fetchImageAsBase64 = async (url: string) => {
		const response = await fetch(url)
		const blob = await response.blob()
		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader()
			reader.onloadend = () => {
				const base64String = reader.result as string

				// Ensure the base64 string only contains image data, strip out the data URL prefix
				const base64Data = base64String.split(',')[1] // Strip out 'data:image/*;base64,' prefix
				resolve(base64Data)
			}
			reader.onerror = reject
			reader.readAsDataURL(blob) // Convert to base64
		})
	}

	const exportQuestions = async (
		includeAnswers: boolean,
		questions: Question[],
		packageName: string
	) => {
		// Create a new document
		const doc = new Document({
			sections: [
				{
					children: await Promise.all(
						questions.map(async (question, index) => {
							const questionParagraphs: Paragraph[] = [
								// Add question number and text
								new Paragraph({
									children: [
										new TextRun({
											text: `${index + 1}. ${question.questionText}`,
											bold: true,
											size: '13.5pt',
										}),
									],
								}),
							]

							// Add question image if available
							if (question.img) {
								try {
									const base64Image = await fetchImageAsBase64(question.img)
									questionParagraphs.push(
										new Paragraph({
											children: [
												new ImageRun({
													data: base64Image, // Split base64 header to get pure data
													transformation: {
														width: 400, // Adjust the width and height as needed
														height: 300,
													},
												}),
											],
										})
									)
								} catch (error) {
									console.error('Failed to fetch image:', error)
								}
							}

							// Add question options
							questionParagraphs.push(
								new Paragraph({
									children: [new TextRun(`A. ${question.optionA}`)],
								}),
								new Paragraph({
									children: [new TextRun(`B. ${question.optionB}`)],
								}),
								new Paragraph({
									children: [new TextRun(`C. ${question.optionC}`)],
								}),
								new Paragraph({
									children: [new TextRun(`D. ${question.optionD}`)],
								})
							)

							// Add correct answer if requested
							if (includeAnswers) {
								questionParagraphs.push(
									new Paragraph({
										children: [
											new TextRun({
												text: `To'g'ri javob: ${question.answer}`,
												bold: true,
											}),
										],
									})
								)
							}

							return questionParagraphs
						})
					).then(paragraphs => paragraphs.flat()), // Flatten the array of arrays
				},
			],
		})

		// Convert the document to a Blob (browser-friendly)
		const blob = await Packer.toBlob(doc)

		// Save the file
		saveAs(blob, `${packageName}_${includeAnswers ? 'with' : 'without'}_answers.docx`)
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
		exportQuestions,
		editPackage,
		deletePackage,
	}
})
