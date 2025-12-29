'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Key, Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [hasSession, setHasSession] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)
  const [isReset, setIsReset] = useState(false)

  // Check if user has a valid session (from reset link)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setHasSession(true)
          if (user.email) {
            setEmail(user.email)
          }
        }
      } catch (err) {
        // No session, user needs to request reset
        setHasSession(false)
      }
    }
    checkSession()
  }, [])


  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      })

      if (resetError) {
        throw resetError
      }

      setIsSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      
      // Verify user is authenticated (from reset link)
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Invalid or expired reset link. Please request a new one.')
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        throw updateError
      }

      setIsReset(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isReset) {
    return (
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Password Reset</h1>
          <p className="text-slate-600 mb-6">
            Your password has been successfully reset.
          </p>
          <Link href="/login" className="btn-primary text-sm">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (isSent) {
    return (
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Check Your Email</h1>
          <p className="text-slate-600 mb-6">
            We sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-slate-500">
            Click the link in the email to reset your password.
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

  if (hasSession) {
    return (
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-8 h-8 text-brand-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Reset Password
            </h1>
            <p className="text-slate-600">
              Enter your new password
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
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

            <div>
              <label htmlFor="password" className="label">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
                minLength={8}
              />
              <p className="text-xs text-slate-500 mt-1">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password || !confirmPassword}
              className="btn-primary w-full justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Reset Password
          </h1>
          <p className="text-slate-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleRequestReset} className="space-y-6">
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
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Remember your password?{' '}
          <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <div className="card p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

