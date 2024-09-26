import { computed } from 'vue'

export const useOneId = () => {
	const PREFIX = 'PK'

	const randomOneId = computed(() => {
		return PREFIX + Math.floor(Math.random() * 999999)
	})

	return { randomOneId }
}
