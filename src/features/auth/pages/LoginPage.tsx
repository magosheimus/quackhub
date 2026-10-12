import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingText } from '@/components/ui/loading-text'
import { Panel } from '@/components/ui/panel'
import { Separator } from '@/components/ui/separator'
import { AUTH_TEXTS } from '@/features/auth/constants/texts'
import { useLoginPage } from '@/features/auth/hooks/useLoginPage'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { PRIVACY_PATH } from '@/features/privacy/constants/paths'
import { PRIVACY_TEXTS } from '@/features/privacy/constants/texts'

export function LoginPage() {
  const {
    isLoadingSession,
    isSignedIn,
    redirectTo,
    oauthError,
    email,
    setEmail,
    password,
    setPassword,
    canSubmit,
    isSigningIn,
    submit,
    signInWithGoogle,
    isRedirecting,
  } = useLoginPage()

  if (isLoadingSession) {
    return <LoadingText />
  }

  if (isSignedIn) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-6">
      <Panel className="flex w-full max-w-sm flex-col gap-5 p-6">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-3xl text-fg">
            {COMMON_TEXTS.brand}
          </span>
          <span className="text-subtle">{AUTH_TEXTS.subtitle}</span>
        </div>

        {oauthError && (
          <p role="alert" className="text-sm text-danger">
            {oauthError}
          </p>
        )}

        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-caption">{AUTH_TEXTS.email}</span>
            <Input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={AUTH_TEXTS.emailPlaceholder}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-caption">{AUTH_TEXTS.password}</span>
            <Input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <Button type="submit" disabled={!canSubmit}>
            {isSigningIn ? AUTH_TEXTS.submitting : AUTH_TEXTS.submit}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-caption">{AUTH_TEXTS.divider}</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={signInWithGoogle}
          disabled={isRedirecting}
        >
          {AUTH_TEXTS.google}
        </Button>
        <Link
          to={PRIVACY_PATH}
          className="self-center text-caption underline hover:text-fg"
        >
          {PRIVACY_TEXTS.linkLabel}
        </Link>
      </Panel>
    </main>
  )
}
