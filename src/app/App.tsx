import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import {
  HOME_PATH,
  LOGIN_PATH,
  SET_PASSWORD_PATH,
} from '@/features/auth/lib/redirect'
import { SetPasswordPage } from '@/features/auth/pages/SetPasswordPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { BoardPage } from '@/features/board/pages/BoardPage'
import { BacklogPage } from '@/features/backlog/pages/BacklogPage'
import { SprintHistoryPage } from '@/features/sprints/pages/SprintHistoryPage'
import { CardPage } from '@/features/tasks/pages/CardPage'
import { InboxPage } from '@/features/inbox/pages/InboxPage'
import { DraftsPage } from '@/features/drafts/pages/DraftsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { SETTINGS_PATH } from '@/features/settings/constants/paths'
import { DRAFTS_PATH } from '@/features/drafts/constants/paths'
import { AnalyticsPage } from '@/features/analytics/pages/AnalyticsPage'
import { Toaster } from '@/components/ui/toaster'
import { PrivacyPage } from '@/features/privacy/pages/PrivacyPage'
import { PRIVACY_PATH } from '@/features/privacy/constants/paths'
import { DailyTrackerPage } from '@/features/dailyTracker/pages/DailyTrackerPage'

function Layout() {
  return (
    <RequireAuth>
      <AppShell>
        <Outlet />
      </AppShell>
    </RequireAuth>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={LOGIN_PATH} element={<LoginPage />} />
          <Route path={SET_PASSWORD_PATH} element={<SetPasswordPage />} />
          <Route path={PRIVACY_PATH} element={<PrivacyPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to={HOME_PATH} replace />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path={DRAFTS_PATH} element={<DraftsPage />} />
            <Route path="/diario" element={<DailyTrackerPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/backlog" element={<BacklogPage />} />
            <Route path={SETTINGS_PATH} element={<SettingsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/sprints" element={<SprintHistoryPage />} />
            <Route path="/cards/:id" element={<CardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  )
}

export default App
