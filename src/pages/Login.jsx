import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmail, signInWithGoogle } from "../firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked by the browser. Allow popups and try again.");
      } else if (err.code === "auth/cancelled-popup-request") {
        setError("Another sign-in popup is already open.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError(
          "This domain is not authorized for Google sign-in. Add your Vercel domain in Firebase Console → Authentication → Settings → Authorized domains."
        );
      } else if (err.code === "auth/operation-not-allowed") {
        setError(
          "Google sign-in is not enabled. Enable Google provider in Firebase Console → Authentication → Sign-in method."
        );
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Check connection and try again.");
      } else {
        setError(
          `Failed to sign in with Google (${err.code || "unknown"}). ${
            err.message ? err.message : ""
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-[var(--ui-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-black font-bold text-lg">
            CT
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold text-white">Consi Tracker</p>
            <p className="text-xs text-white/50">Command center</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="ui-card p-8">
          <h1 className="ui-h1 text-center mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-white/55 text-center mb-8">
            Sign in to continue tracking your consistency
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.10)] text-white/80 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="ui-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ui-input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="ui-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ui-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/55 cursor-pointer">
                <input type="checkbox" className="rounded bg-[#0b0b0b]" />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-white/65 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full ui-btn ui-btn-primary"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-[#111111] text-white/50">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full ui-btn ui-btn-secondary"
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

          <p className="mt-8 text-center text-sm text-white/55">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-white/90 hover:text-white font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
