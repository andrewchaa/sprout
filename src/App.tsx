import { FC } from 'react'
import { Layout } from './components/Layout'
import { OfflineIndicator } from './components/OfflineIndicator'
import { InstallPrompt } from './components/InstallPrompt'
import Timer from './components/timer/Timer'

const App: FC = () => {
  return (
    <>
      <OfflineIndicator />
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Timer />
        </div>
      </Layout>
      <InstallPrompt />
    </>
  )
}

export default App
