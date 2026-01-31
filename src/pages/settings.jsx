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
      <div className="ui-card p-6">
        <h1 className="ui-h1">Settings</h1>
        <p className="ui-subtitle mt-1">Customize your consistency environment</p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.10)] text-white/90"
              : "bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.10)] text-white/75"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Section */}
        <div className="ui-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <User className="w-4 h-4 text-white/55" />
            </div>
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="ui-label">Display name</label>
              <input
                className="ui-input"
                value={profileData.displayName}
                onChange={(e) =>
                  setProfileData({ ...profileData, displayName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="ui-label">Email</label>
              <input
                className="ui-input text-white/45 cursor-not-allowed"
                value={profileData.email}
                disabled
              />
              <p className="mt-2 ui-help">Email cannot be changed</p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full ui-btn ui-btn-primary"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="ui-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <SettingsIcon className="w-4 h-4 text-white/55" />
            </div>
            <h2 className="text-lg font-semibold text-white">Preferences</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] cursor-pointer hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition-colors">
              <div>
                <span className="text-sm text-white/90">Enable focus mode</span>
                <p className="text-xs text-white/50 mt-1">Minimize distractions while working</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.focusMode}
                onChange={(e) =>
                  setPreferences({ ...preferences, focusMode: e.target.checked })
                }
                className="h-5 w-5 rounded-md bg-[#0b0b0b]"
              />
            </label>
            <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] cursor-pointer hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition-colors">
              <div>
                <span className="text-sm text-white/90">Auto-schedule habits</span>
                <p className="text-xs text-white/50 mt-1">Automatically add habits to your calendar</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.autoScheduleHabits}
                onChange={(e) =>
                  setPreferences({ ...preferences, autoScheduleHabits: e.target.checked })
                }
                className="h-5 w-5 rounded-md bg-[#0b0b0b]"
              />
            </label>
            <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] cursor-pointer hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition-colors">
              <div>
                <span className="text-sm text-white/90">Weekly recap email</span>
                <p className="text-xs text-white/50 mt-1">Receive weekly progress summary</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.weeklyRecapEmail}
                onChange={(e) =>
                  setPreferences({ ...preferences, weeklyRecapEmail: e.target.checked })
                }
                className="h-5 w-5 rounded-md bg-[#0b0b0b]"
              />
            </label>
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="w-full ui-btn ui-btn-primary mt-2"
            >
              {saving ? "Saving..." : "Save preferences"}
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="ui-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <Shield className="w-4 h-4 text-white/55" />
            </div>
            <h2 className="text-lg font-semibold text-white">Account Info</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <span className="text-sm text-white/50">Account type</span>
              <span className="text-sm text-white font-medium">
                {user?.providerData?.[0]?.providerId === "google.com" ? "Google" : "Email"}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <span className="text-sm text-white/50">Member since</span>
              <span className="text-sm text-white font-medium">
                {userProfile?.createdAt?.toDate?.()
                  ? userProfile.createdAt.toDate().toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <span className="text-sm text-white/50">User ID</span>
              <span className="text-xs text-white/55 font-mono truncate max-w-[150px]">
                {user?.uid}
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="ui-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <AlertTriangle className="w-4 h-4 text-white/55" />
            </div>
            <h2 className="text-lg font-semibold text-white">Danger Zone</h2>
          </div>
          <p className="text-sm text-white/50 mb-4">
            These actions are irreversible. Please be certain.
          </p>
          <div className="space-y-3">
            <button className="w-full ui-btn ui-btn-secondary">
              Export all data
            </button>
            <button className="w-full ui-btn ui-btn-secondary">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
