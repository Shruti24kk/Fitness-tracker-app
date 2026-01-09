import React, { useState } from "react";
import { api, setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name:"", email:"", password:"", fitnessLevel:"beginner", types:"strength,cardio", minutesPerSession:30 });

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          fitnessLevel: form.fitnessLevel,
          preferences: { types: form.types.split(",").map(s => s.trim()).filter(Boolean), minutesPerSession: Number(form.minutesPerSession) }
        };
        const r = await api.register(payload);
        setToken(r.token);
      } else {
        const r = await api.login({ email: form.email, password: form.password });
        setToken(r.token);
      }
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card">
      <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
      <p className="small">Demo auth with JWT stored in localStorage.</p>
      {error && <p className="error">{error}</p>}

      <form onSubmit={submit} className="row">
        {mode === "register" && (
          <div>
            <label>Name</label>
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
          </div>
        )}
        <div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
        </div>

        {mode === "register" && (
          <>
            <div>
              <label>Fitness level</label>
              <select value={form.fitnessLevel} onChange={(e)=>setForm({...form, fitnessLevel:e.target.value})}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label>Preferred types (comma-separated)</label>
              <input value={form.types} onChange={(e)=>setForm({...form, types:e.target.value})} />
            </div>
            <div>
              <label>Minutes per session</label>
              <input type="number" value={form.minutesPerSession} onChange={(e)=>setForm({...form, minutesPerSession:e.target.value})} />
            </div>
          </>
        )}

        <div style={{display:"flex", gap:10, alignItems:"flex-end"}}>
          <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
          <button type="button" className="secondary" onClick={()=>setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Need an account?" : "Have an account?"}
          </button>
        </div>
      </form>
    </div>
  );
}
