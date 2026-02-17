import { motion, type HTMLMotionProps } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-ghost-primary text-white rounded-full shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)] active:scale-[0.98]',
  secondary:
    'bg-white border border-gray-100 text-ghost-text rounded-full hover:bg-gray-50 active:scale-[0.98]',
  outline:
    'bg-transparent border border-gray-200 text-ghost-text rounded-full hover:bg-gray-50 active:scale-[0.98]',
  ghost:
    'bg-transparent text-ghost-subtext rounded-full hover:bg-gray-100/50 active:scale-[0.98]',
  icon:
    'bg-white border border-gray-50 shadow-[var(--shadow-soft)] rounded-full aspect-square flex items-center justify-center hover:shadow-[var(--shadow-float)] active:scale-[0.95]',
}

export default function Button({
  variant = 'primary',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={twMerge(
        'px-6 py-3.5 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  )
}
