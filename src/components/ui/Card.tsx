import { FC, ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
}

export const Card: FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>}
      <div className="text-gray-600">{children}</div>
    </div>
  )
}
