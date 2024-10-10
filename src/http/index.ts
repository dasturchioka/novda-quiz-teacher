import axios, { AxiosInstance } from 'axios'
import { useLoading } from '@/stores/loading'
import { config } from '@/config'
import Cookies from 'js-cookie'

// Function to set interceptors
const setInterceptors = (instance: AxiosInstance) => {
	instance.interceptors.request.use(
		async config => {
			const loadingStore = useLoading()
			await loadingStore.setLoading(true)
			return config
		},
		async error => {
			const loadingStore = useLoading()
			await loadingStore.setLoading(false)
			return Promise.reject(error)
		}
	)

	instance.interceptors.response.use(
		async response => {
			const loadingStore = useLoading()
			await loadingStore.setLoading(false)
			return response
		},
		async error => {
			const loadingStore = useLoading()
			await loadingStore.setLoading(false)
			return Promise.reject(error)
		}
	)
}



// Example of usage:
export const teacherInstance = axios.create({
	baseURL: config.SERVER_API + '/teacher',
	headers: {
		Authorization: `Bearer ${Cookies.get("token")}`
	}
})

// Apply interceptors to all instances
setInterceptors(teacherInstance)
