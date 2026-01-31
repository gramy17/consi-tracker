import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpWithEmail, signInWithGoogle } from "../firebase/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(email, password, displayName);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed.");
      } else {
        setError("Failed to sign up with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-black font-bold text-lg">
            CT
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold text-white">Consi Tracker</p>
            <p className="text-xs text-neutral-500">Command center</p>
          </div>
        </div>

        {/* Signup Card */}
        <div className="p-8 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <h1 className="text-xl font-semibold text-white text-center mb-2">
            Create your account
          </h1>
          <p className="text-sm text-neutral-500 text-center mb-8">
            Start building consistent habits today
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#1a1a1a] border border-[#262626] text-neutral-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Display name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1a1a1a]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-[#111111] text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm font-medium text-white hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:text-neutral-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
