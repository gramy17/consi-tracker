import React from "react";

const Settings = () => {
	return (
		<div className="space-y-6 text-slate-50">
			<div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
				<h1 className="text-lg font-semibold">Settings</h1>
				<p className="text-xs text-white/60">Tune your consistency environment.</p>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
					<h2 className="text-sm font-semibold text-white">Profile</h2>
					<div className="mt-4 space-y-3">
						<div>
							<label className="text-xs text-white/60">Display name</label>
							<input
								className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80"
								defaultValue="Ava Consistency"
							/>
						</div>
						<div>
							<label className="text-xs text-white/60">Email</label>
							<input
								className="mt-2 w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80"
								defaultValue="ava@consi.app"
							/>
						</div>
						<button className="rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-[#4B0879] hover:bg-white">
							Save profile
						</button>
					</div>
				</div>

				<div className="rounded-xl border border-slate-800/40 bg-white/5 backdrop-blur p-5">
					<h2 className="text-sm font-semibold text-white">Preferences</h2>
					<div className="mt-4 space-y-3 text-xs text-white/70">
						<label className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/5 px-4 py-3">
							<span>Enable focus mode</span>
							<input type="checkbox" defaultChecked className="h-4 w-4" />
						</label>
						<label className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/5 px-4 py-3">
							<span>Auto-schedule habits</span>
							<input type="checkbox" className="h-4 w-4" />
						</label>
						<label className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/5 px-4 py-3">
							<span>Weekly recap email</span>
							<input type="checkbox" defaultChecked className="h-4 w-4" />
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
