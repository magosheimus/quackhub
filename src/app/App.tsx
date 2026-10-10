import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { BoardPage } from '@/features/board/pages/BoardPage'
import { BacklogPage } from '@/features/backlog/pages/BacklogPage'
import { SprintHistoryPage } from '@/features/sprints/pages/SprintHistoryPage'
import { CardPage } from '@/features/tasks/pages/CardPage'
import { InboxPage } from '@/features/inbox/pages/InboxPage'
import { DraftsPage } from '@/features/drafts/pages/DraftsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { AnalyticsPage } from '@/features/analytics/pages/AnalyticsPage'

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
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/rascunhos" element={<DraftsPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/sprints" element={<SprintHistoryPage />} />
          <Route path="/cards/:id" element={<CardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
