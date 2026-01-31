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

        {/* Forgot Password Card */}
        <div className="p-8 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <h1 className="text-xl font-semibold text-white text-center mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-neutral-500 text-center mb-8">
            Enter your email and we'll send you a reset link
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#1a1a1a] border border-[#262626] text-neutral-300 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 p-4 rounded-xl bg-[#1a1a1a] border border-[#262626] text-white text-sm">
                Password reset email sent! Check your inbox.
              </div>
              <Link
                to="/login"
                className="text-white hover:text-neutral-300 font-medium text-sm transition-colors"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <p className="text-center text-sm text-neutral-500">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-white hover:text-neutral-300 font-medium transition-colors"
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
