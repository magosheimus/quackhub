import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingText } from '@/components/feedback/loading-text'
import { Panel } from '@/components/layout/panel'
import { AUTH_ERRORS, AUTH_TEXTS } from '@/features/auth/constants/texts'
import { useSetPasswordPage } from '@/features/auth/hooks/useSetPasswordPage'
import { LOGIN_PATH } from '@/features/auth/lib/redirect'
import { COMMON_TEXTS } from '@/shared/constants/texts'

export function SetPasswordPage() {
  const {
    isLoading,
    hasInvalidLink,
    password,
    setPassword,
    confirmation,
    setConfirmation,
    issueMessage,
    canSubmit,
    isSaving,
    submit,
  } = useSetPasswordPage()

  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-6">
      <Panel className="flex w-full max-w-sm flex-col gap-5 p-6">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-3xl text-fg">
            {COMMON_TEXTS.brand}
          </span>
          <span className="text-body text-fg-muted">
            {AUTH_TEXTS.setPasswordSubtitle}
          </span>
        </div>

        {isLoading ? (
          <LoadingText />
        ) : hasInvalidLink ? (
          <div className="flex flex-col gap-3">
            <p role="alert" className="text-sm text-danger">
              {AUTH_ERRORS.invalidLink}
            </p>
            <Link
              to={LOGIN_PATH}
              className="text-caption underline hover:text-fg"
            >
              {AUTH_TEXTS.backToLogin}
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-caption">{AUTH_TEXTS.newPassword}</span>
              <Input
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-caption">{AUTH_TEXTS.confirmPassword}</span>
              <Input
                type="password"
                autoComplete="new-password"
                required
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                aria-invalid={issueMessage !== null}
              />
            </label>
            <p
              role={issueMessage ? 'alert' : undefined}
              className={issueMessage ? 'text-sm text-danger' : 'text-caption'}
            >
              {issueMessage ?? AUTH_TEXTS.passwordHint}
            </p>
            <Button type="submit" disabled={!canSubmit}>
              {isSaving ? AUTH_TEXTS.savingPassword : AUTH_TEXTS.savePassword}
            </Button>
          </form>
        )}
      </Panel>
    </main>
  )
}
