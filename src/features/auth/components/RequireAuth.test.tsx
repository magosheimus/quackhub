import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Session } from '@supabase/supabase-js'
import { AuthContext, type AuthState } from '@/features/auth/hooks/authContext'
import { RequireAuth } from './RequireAuth'

function renderAt(state: AuthState) {
  return render(
    <AuthContext.Provider value={state}>
      <MemoryRouter initialEntries={['/board']}>
        <Routes>
          <Route path="/login" element={<p>tela de login</p>} />
          <Route
            path="/board"
            element={
              <RequireAuth>
                <p>conteúdo protegido</p>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('RequireAuth', () => {
  it('sem sessão, manda para /login', () => {
    renderAt({ session: null, isLoading: false })
    expect(screen.getByText('tela de login')).toBeInTheDocument()
  })

  it('com sessão, mostra o conteúdo', () => {
    renderAt({ session: {} as Session, isLoading: false })
    expect(screen.getByText('conteúdo protegido')).toBeInTheDocument()
  })

  it('enquanto carrega a sessão, não redireciona', () => {
    renderAt({ session: null, isLoading: true })
    expect(screen.queryByText('tela de login')).not.toBeInTheDocument()
    expect(screen.queryByText('conteúdo protegido')).not.toBeInTheDocument()
  })
})
