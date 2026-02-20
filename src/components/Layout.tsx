import { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-emerald-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Sprout PWA</h1>
          <p className="text-emerald-100 text-sm">Progressive Web App Skeleton</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Built with React, TanStack Query, Tailwind CSS, and Vite PWA
          </p>
        </div>
      </footer>
    </div>
  )
}
