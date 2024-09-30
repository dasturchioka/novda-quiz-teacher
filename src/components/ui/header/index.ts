import { type VariantProps, cva } from 'class-variance-authority'

export { default as Header } from './Header.vue'

export const headerVariants = cva(
	'font-extrabold sm:text-2xl md:text-3xl text-xl flex items-center font-manrope',
	{
		variants: {
			variant: {
				default: 'text-neutral-900 dark:text-neutral-50',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

export type HeaderVariants = VariantProps<typeof headerVariants>
