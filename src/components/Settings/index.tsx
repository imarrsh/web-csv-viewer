import { AppSettings } from "~/data/types"

interface SettingsProps  {
  settings?: AppSettings;
}

const Settings = ({settings}: SettingsProps) => {
  return (
    <article>
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
      </div>
    </article>
  )
}

export default Settings;