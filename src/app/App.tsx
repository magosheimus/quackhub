import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { TokenPreview } from '@/dev/TokenPreview'
import { BoardView } from '@/features/board/pages/BoardView'
import { BacklogView } from '@/features/backlog/pages/BacklogView'
import { SprintHistoryView } from '@/features/sprints/pages/SprintHistoryView'
import { CardPage } from '@/features/tasks/pages/CardPage'
import { InboxView } from '@/features/inbox/pages/InboxView'
import { DraftsView } from '@/features/drafts/pages/DraftsView'
import { SettingsView } from '@/features/settings/pages/SettingsView'
import { AnalyticsView } from '@/features/analytics/pages/AnalyticsView'

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
          <Route path="/cards/:id" element={<CardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
