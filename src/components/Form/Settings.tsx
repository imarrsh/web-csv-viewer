import { ChangeEvent, useState } from 'react';
import { AppSettings } from '~/data/types';

interface SettingsProps {
	settings?: AppSettings;
}

const Settings = ({ settings }: SettingsProps) => {
	const [remember, setRemember] = useState(false);
	const [rememberHidden, setRememberHidden] = useState(false);
	const [rememberSort, setRememberSort] = useState(false);

	const handleRememberChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setRemember(true);
		} else {
			[setRemember, setRememberHidden, setRememberSort].forEach((set) => set(false));
		}
	};

	return (
		<>
			<div>
				<h2>Settings</h2>
			</div>
			<div className="flex flex-col gap-2">
				<label className="flex gap-2" htmlFor="remember-schema">
					<input
						type="checkbox"
						name="remember-schema"
						id="remember-schema"
						checked={remember}
						onChange={handleRememberChange}
					/>
					<span>Remember CSV Profile</span>
				</label>
				{remember && (
					<>
						<label className="flex flex-col" htmlFor="profile-name">
							<span>Profile Name</span>
							<input
								className="border border-gray-500 rounded-md px-3 py-2"
								disabled={!remember}
								id="profile-name"
								name="profile-name"
								type="text"
							/>
						</label>
						<label className="flex gap-2" htmlFor="remember-hidden">
							<input
								type="checkbox"
								name="remember-hidden"
								id="remember-hidden"
								disabled={!remember}
								checked={rememberHidden}
								onChange={(e) => setRememberHidden(e.target.checked)}
							/>
							<span>Remember Hidden Columns</span>
						</label>
						<label className="flex gap-2" htmlFor="remember-sort">
							<input
								type="checkbox"
								name="remember-sort"
								id="remember-sort"
								disabled={!remember}
								checked={rememberSort}
								onChange={(e) => setRememberSort(e.target.checked)}
							/>
							<span>Remember Column Sort</span>
						</label>
					</>
				)}
			</div>
		</>
	);
};

export default Settings;
