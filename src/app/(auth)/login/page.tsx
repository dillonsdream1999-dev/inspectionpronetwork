'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const authError = searchParams.get('error')

  useEffect(() => {
    if (authError === 'auth' || authError === 'auth_callback_error') {
      setError('Authentication failed. Please try again.')
    }

    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          window.location.href = redirect
        }
      } catch (err) {
        console.error('Failed to check user:', err)
        // Continue - user can still login
      }
    }
    checkUser()
  }, [authError, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
        },
      })

      if (signInError) {
        throw signInError
      }

      setIsSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send login link')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Check Your Email</h1>
          <p className="text-slate-600 mb-6">
            We sent a magic link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-slate-500">
            Click the link in the email to sign in. It will expire in 1 hour.
          </p>
          <button
            onClick={() => {
              setIsSent(false)
              setEmail('')
            }}
            className="btn-ghost mt-6 text-sm"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">
            Sign in with your email to access your dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@company.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="btn-primary w-full justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Send Magic Link
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          No account? One will be created automatically when you sign in.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <div className="card p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

