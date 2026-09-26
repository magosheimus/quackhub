import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Navigate,
  Outlet,
} from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { TokenPreview } from './dev/TokenPreview'
import { BoardView } from './components/board/BoardView'
import { BacklogView } from './components/backlog/BacklogView'

function Placeholder({ label }: { label: string }) {
  return (
    <div className="text-base text-[--text-primary]">
      {label} — ainda não implementado
    </div>
  )
}

function ProjetoRedirect() {
  const { id } = useParams()
  return <Navigate to={`/projeto/${id}/board`} replace />
}

function Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Placeholder label="Agenda" />} />
          <Route path="/inbox" element={<Placeholder label="Inbox" />} />
          <Route path="/projeto/:id" element={<ProjetoRedirect />} />
          <Route path="/projeto/:id/backlog" element={<BacklogView />} />
          <Route
            path="/configuracoes"
            element={<Placeholder label="Configurações" />}
          />
          <Route
            path="/analytics"
            element={<Placeholder label="Analytics" />}
          />
          <Route path="/debug-tokens" element={<TokenPreview />} />
          <Route path="/projeto/:id/board" element={<BoardView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
