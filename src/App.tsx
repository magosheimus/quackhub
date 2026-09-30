import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { TokenPreview } from './dev/TokenPreview'
import { BoardView } from './components/board/BoardView'
import { BacklogView } from './components/backlog/BacklogView'
import { SprintHistoryView } from './components/sprint/SprintHistoryView'
import { SprintDetailView } from './components/sprint/SprintDetailView'
import { CardPage } from './components/card/CardPage'
import { InboxView } from './components/inbox/InboxView'
import { AgendaView } from './components/agenda/AgendaView'

function Placeholder({ label }: { label: string }) {
  return (
    <div className="text-base text-[--text-primary]">
      {label} — ainda não implementado
    </div>
  )
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
          <Route path="/" element={<AgendaView />} />
          <Route path="/board" element={<BoardView />} />
          <Route path="/backlog" element={<BacklogView />} />
          <Route path="/inbox" element={<InboxView />} />
          <Route
            path="/configuracoes"
            element={<Placeholder label="Configurações" />}
          />
          <Route
            path="/analytics"
            element={<Placeholder label="Analytics" />}
          />
          <Route path="/debug-tokens" element={<TokenPreview />} />
          <Route path="/sprints" element={<SprintHistoryView />} />
          <Route path="/sprints/:id" element={<SprintDetailView />} />
          <Route path="/cards/:id" element={<CardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
