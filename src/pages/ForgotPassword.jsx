import React, { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A20] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[rgba(119,0,201,0.65)] to-[rgba(204,229,242,0.65)] flex items-center justify-center text-white font-bold text-lg">
            CT
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold text-white">Consi Tracker</p>
            <p className="text-xs text-white/60">Command center</p>
          </div>
        </div>

        {/* Forgot Password Card */}
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-6">
          <h1 className="text-xl font-semibold text-white text-center mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-white/60 text-center mb-6">
            Enter your email and we'll send you a reset link
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
                Password reset email sent! Check your inbox.
              </div>
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium text-sm"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white/60">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <p className="text-center text-sm text-white/60">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
