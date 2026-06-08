import { useState } from "react"
import "./admin.css"

export const ADMIN_PASSWORD = "vEr5g45FWd23.gT"
export const AUTH_KEY = "admin-auth"

export default function AuthGate({ onSuccess }) {
  const [value, setValue] = useState("")
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (value === ADMIN_PASSWORD) {
      try { sessionStorage.setItem(AUTH_KEY, "1") } catch { /* yoksay */ }
      onSuccess()
    } else {
      setError(true)
    }
  }

  return (
    <div className="ag-wrap">
      <form className="ag-card" onSubmit={submit}>
        <div className="ag-lock">🔒</div>
        <h1 className="ag-title">Yönetim Paneli</h1>
        <p className="ag-sub">Devam etmek için şifreyi girin.</p>
        <input
          className={`ag-input ${error ? "ag-input-err" : ""}`}
          type="password"
          autoFocus
          placeholder="Şifre"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false) }}
        />
        {error && <p className="ag-error">Hatalı şifre. Tekrar deneyin.</p>}
        <button className="ag-btn" type="submit">Giriş</button>
        <a className="ag-back" href="#">← Siteye dön</a>
      </form>
    </div>
  )
}
