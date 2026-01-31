import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestore";
import { PageLoader } from "../components/LoadingSpinner";
import { User, Settings as SettingsIcon, Shield, AlertTriangle } from "lucide-react";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Customize your consistency environment</p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-white/5 border border-neutral-700 text-white"
              : "bg-white/5 border border-neutral-700 text-neutral-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Section */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-[#1a1a1a]">
              <User className="w-4 h-4 text-neutral-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Display name</label>
              <input
                className="mt-2 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                value={profileData.displayName}
                onChange={(e) =>
                  setProfileData({ ...profileData, displayName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</label>
              <input
                className="mt-2 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-neutral-500 cursor-not-allowed"
                value={profileData.email}
                disabled
              />
              <p className="mt-2 text-xs text-neutral-600">Email cannot be changed</p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50 transition-all"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-[#1a1a1a]">
              <SettingsIcon className="w-4 h-4 text-neutral-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Preferences</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] cursor-pointer hover:border-[#262626] transition-all">
              <div>
                <span className="text-sm text-white">Enable focus mode</span>
                <p className="text-xs text-neutral-500 mt-0.5">Minimize distractions while working</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.focusMode}
                onChange={(e) =>
                  setPreferences({ ...preferences, focusMode: e.target.checked })
                }
                className="h-5 w-5 rounded-md bg-[#1a1a1a] border-neutral-600"
              />
            </label>
            <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] cursor-pointer hover:border-[#262626] transition-all">
              <div>
                <span className="text-sm text-white">Auto-schedule habits</span>
                <p className="text-xs text-neutral-500 mt-0.5">Automatically add habits to your calendar</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.autoScheduleHabits}
                onChange={(e) =>
                  setPreferences({ ...preferences, autoScheduleHabits: e.target.checked })
                }
                className="h-5 w-5 rounded-md bg-[#1a1a1a] border-neutral-600"
              />
            </label>
            <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] cursor-pointer hover:border-[#262626] transition-all">
              <div>
                <span className="text-sm text-white">Weekly recap email</span>
                <p className="text-xs text-neutral-500 mt-0.5">Receive weekly progress summary</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.weeklyRecapEmail}
                onChange={(e) =>
                  setPreferences({ ...preferences, weeklyRecapEmail: e.target.checked })
                }
                className="h-5 w-5 rounded-md bg-[#1a1a1a] border-neutral-600"
              />
            </label>
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50 transition-all mt-2"
            >
              {saving ? "Saving..." : "Save preferences"}
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a]">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-[#1a1a1a]">
              <Shield className="w-4 h-4 text-neutral-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Account Info</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
              <span className="text-sm text-neutral-500">Account type</span>
              <span className="text-sm text-white font-medium">
                {user?.providerData?.[0]?.providerId === "google.com" ? "Google" : "Email"}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
              <span className="text-sm text-neutral-500">Member since</span>
              <span className="text-sm text-white font-medium">
                {userProfile?.createdAt?.toDate?.()
                  ? userProfile.createdAt.toDate().toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
              <span className="text-sm text-neutral-500">User ID</span>
              <span className="text-xs text-neutral-400 font-mono truncate max-w-[150px]">
                {user?.uid}
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#262626]">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-[#1a1a1a]">
              <AlertTriangle className="w-4 h-4 text-neutral-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Danger Zone</h2>
          </div>
          <p className="text-sm text-neutral-500 mb-4">
            These actions are irreversible. Please be certain.
          </p>
          <div className="space-y-3">
            <button className="w-full rounded-xl border border-[#262626] px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-all">
              Export all data
            </button>
            <button className="w-full rounded-xl border border-[#262626] px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-all">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
