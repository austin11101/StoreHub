import { BrowserRouter } from 'react-router-dom'
import AppRouter from './app/router/AppRouter'
import { AuthProvider } from './features/auth/auth-provider'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
