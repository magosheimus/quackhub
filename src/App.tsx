import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { TokenPreview } from './dev/TokenPreview'
import { BoardView } from './components/board/BoardView'
import { BacklogView } from './components/backlog/BacklogView'
import { SprintHistoryView } from './components/sprint/SprintHistoryView'
import { SprintDetailView } from './components/sprint/SprintDetailView'
import { CardPage } from './components/card/CardPage'
import { InboxView } from './components/inbox/InboxView'
import { DraftsView } from './components/drafts/DraftsView'
import { SettingsView } from './components/settings/SettingsView'
import { AnalyticsView } from './components/analytics/AnalyticsView'

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
          <Route path="/" element={<Navigate to="/inbox" replace />} />
          <Route path="/inbox" element={<InboxView />} />
          <Route path="/rascunhos" element={<DraftsView />} />
          <Route path="/board" element={<BoardView />} />
          <Route path="/backlog" element={<BacklogView />} />
          <Route path="/configuracoes" element={<SettingsView />} />
          <Route path="/analytics" element={<AnalyticsView />} />
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
