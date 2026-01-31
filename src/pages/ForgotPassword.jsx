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

        {/* Forgot Password Card */}
        <div className="ui-card p-8">
          <h1 className="ui-h1 text-center mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-white/55 text-center mb-8">
            Enter your email and we'll send you a reset link
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.10)] text-white/80 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 p-4 rounded-xl bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.10)] text-white/90 text-sm">
                Password reset email sent! Check your inbox.
              </div>
              <Link
                to="/login"
                className="text-white/90 hover:text-white font-medium text-sm transition-colors"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full ui-btn ui-btn-primary"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <p className="text-center text-sm text-white/55">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white font-medium transition-colors"
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
