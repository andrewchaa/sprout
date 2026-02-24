import { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-emerald-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <h1 className="text-xl font-bold tracking-tight">Sprout</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
