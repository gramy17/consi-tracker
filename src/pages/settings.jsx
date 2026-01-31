import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestore";
import { PageLoader } from "../components/LoadingSpinner";

const Settings = () => {
  const { user, userProfile, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
  });
  
  const [preferences, setPreferences] = useState({
    focusMode: true,
    autoScheduleHabits: false,
    weeklyRecapEmail: true,
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        displayName: userProfile.displayName || user?.displayName || "",
        email: userProfile.email || user?.email || "",
      });
      setPreferences({
        focusMode: userProfile.preferences?.focusMode ?? true,
        autoScheduleHabits: userProfile.preferences?.autoScheduleHabits ?? false,
        weeklyRecapEmail: userProfile.preferences?.weeklyRecapEmail ?? true,
      });
    } else if (user) {
      setProfileData({
        displayName: user.displayName || "",
        email: user.email || "",
      });
    }
  }, [user, userProfile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    setMessage({ type: "", text: "" });
    
    try {
      await updateUserProfile(user.uid, {
        displayName: profileData.displayName,
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    setMessage({ type: "", text: "" });
    
    try {
      await updateUserProfile(user.uid, {
        preferences,
      });
      setMessage({ type: "success", text: "Preferences saved!" });
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage({ type: "error", text: "Failed to save preferences." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 text-slate-50">
      <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
        <h1 className="text-lg font-semibold">Settings</h1>
        <p className="text-xs text-white/60">Tune your consistency environment.</p>
      </div>

      {message.text && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-red-500/10 border border-red-500/20 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Profile Section */}
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <h2 className="text-sm font-semibold text-white">Profile</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-white/60">Display name</label>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-purple-500"
                value={profileData.displayName}
                onChange={(e) =>
                  setProfileData({ ...profileData, displayName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-white/60">Email</label>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/60 cursor-not-allowed"
                value={profileData.email}
                disabled
              />
              <p className="mt-1 text-xs text-white/40">Email cannot be changed</p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-[#4B0879] hover:bg-white disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <h2 className="text-sm font-semibold text-white">Preferences</h2>
          <div className="mt-4 space-y-3 text-xs text-white/70">
            <label className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/10 transition">
              <div>
                <span className="text-white/80">Enable focus mode</span>
                <p className="text-white/40 text-xs mt-0.5">Minimize distractions while working</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.focusMode}
                onChange={(e) =>
                  setPreferences({ ...preferences, focusMode: e.target.checked })
                }
                className="h-4 w-4 rounded"
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/10 transition">
              <div>
                <span className="text-white/80">Auto-schedule habits</span>
                <p className="text-white/40 text-xs mt-0.5">Automatically add habits to your calendar</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.autoScheduleHabits}
                onChange={(e) =>
                  setPreferences({ ...preferences, autoScheduleHabits: e.target.checked })
                }
                className="h-4 w-4 rounded"
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/10 transition">
              <div>
                <span className="text-white/80">Weekly recap email</span>
                <p className="text-white/40 text-xs mt-0.5">Receive weekly progress summary</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.weeklyRecapEmail}
                onChange={(e) =>
                  setPreferences({ ...preferences, weeklyRecapEmail: e.target.checked })
                }
                className="h-4 w-4 rounded"
              />
            </label>
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="w-full rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Save preferences"}
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
          <h2 className="text-sm font-semibold text-white">Account Info</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-xs text-white/60">Account type</span>
              <span className="text-sm text-white/80">
                {user?.providerData?.[0]?.providerId === "google.com" ? "Google" : "Email"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-xs text-white/60">Member since</span>
              <span className="text-sm text-white/80">
                {userProfile?.createdAt?.toDate?.()
                  ? userProfile.createdAt.toDate().toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-xs text-white/60">User ID</span>
              <span className="text-xs text-white/40 font-mono truncate max-w-[150px]">
                {user?.uid}
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur p-5">
          <h2 className="text-sm font-semibold text-red-300">Danger Zone</h2>
          <p className="mt-2 text-xs text-white/60">
            These actions are irreversible. Please be certain.
          </p>
          <div className="mt-4 space-y-3">
            <button className="w-full rounded-md border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 transition">
              Export all data
            </button>
            <button className="w-full rounded-md border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 transition">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
