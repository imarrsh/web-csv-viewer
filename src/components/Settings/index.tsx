import { AppSettings } from "~/data/types"

interface SettingsProps  {
  settings?: AppSettings;
  onClear: () => void;
}

const Settings = ({settings, onClear}: SettingsProps) => {
  return (
    <article className="border border-slate-400 p-4">
      <div>
        <h2>Settings</h2>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="remember-schema">
          <input type='checkbox' name="remember-schema" id="remember-schema"/> Remember Schema
        </label>
        <label htmlFor="auto-reorder">
          <input type='checkbox' name="auto-reorder" id="auto-reorder"/> Auto Reorder & Hide Columns
        </label>
        <button className="bg-gray-200 text-slate-600 rounded-lg" type="button" onClick={onClear}>
          Clear data
        </button>
      </div>
    </article>
  )
}

export default Settings;