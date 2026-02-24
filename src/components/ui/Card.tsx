import { FC, HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  children: ReactNode
  className?: string
}

export const Card: FC<CardProps> = ({ title, children, className = '', ...props }) => {
  return (
    <div className={`rounded-xl shadow-sm border border-amber-100 ${className}`} {...props}>
      {title && <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>}
      <div className="text-gray-600">{children}</div>
    </div>
  )
}
