import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [error, setError] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [rec, setRec] = useState(null);

  const [workoutForm, setWorkoutForm] = useState({ date: new Date().toISOString().slice(0,10), type:"cardio", durationMin:30, calories:200, notes:"" });
  const [goalForm, setGoalForm] = useState({ title:"", type:"general", targetValue:0, unit:"", deadline:"" });

  async function refresh() {
    setError("");
    try {
      const [w, g, s] = await Promise.all([api.workoutsList(), api.goalsList(), api.progressSummary()]);
      setWorkouts(w.workouts);
      setGoals(g.goals);
      setSummary(s);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function addWorkout(e) {
    e.preventDefault();
    setError("");
    try {
      await api.workoutsCreate({
        ...workoutForm,
        date: new Date(workoutForm.date).toISOString()
      });
      setWorkoutForm({ ...workoutForm, notes:"" });
      await refresh();
    } catch (e) { setError(e.message); }
  }

  async function addGoal(e) {
    e.preventDefault();
    setError("");
    try {
      await api.goalsCreate({
        ...goalForm,
        targetValue: Number(goalForm.targetValue || 0),
        deadline: goalForm.deadline ? new Date(goalForm.deadline).toISOString() : undefined
      });
      setGoalForm({ title:"", type:"general", targetValue:0, unit:"", deadline:"" });
      await refresh();
    } catch (e) { setError(e.message); }
  }

  async function delWorkout(id) {
    await api.workoutsDelete(id);
    await refresh();
  }

  async function delGoal(id) {
    await api.goalsDelete(id);
    await refresh();
  }

  async function getRecommendations() {
    setError("");
    try {
      const activeGoal = goals.find(g => g.status === "active") || null;
      const r = await api.recommendations({ goal: activeGoal });
      setRec(r);
    } catch (e) { setError(e.message); }
  }

  const chartData = useMemo(() => {
    if (!summary) return null;
    const labels = Object.keys(summary.byWeek || {}).sort();
    const duration = labels.map(k => summary.byWeek[k].durationMin);
    const calories = labels.map(k => summary.byWeek[k].calories);
    return {
      labels,
      datasets: [
        { label: "Duration (min)", data: duration },
        { label: "Calories", data: calories }
      ]
    };
  }, [summary]);

  return (
    <div className="row">
      <div className="card">
        <h2>Workout log</h2>
        <p className="small">Log cardio, strength, yoga, etc.</p>
        {error && <p className="error">{error}</p>}

        <form onSubmit={addWorkout} className="row">
          <div>
            <label>Date</label>
            <input type="date" value={workoutForm.date} onChange={(e)=>setWorkoutForm({...workoutForm, date:e.target.value})}/>
          </div>
          <div>
            <label>Type</label>
            <input value={workoutForm.type} onChange={(e)=>setWorkoutForm({...workoutForm, type:e.target.value})} />
          </div>
          <div>
            <label>Duration (min)</label>
            <input type="number" value={workoutForm.durationMin} onChange={(e)=>setWorkoutForm({...workoutForm, durationMin:e.target.value})} />
          </div>
          <div>
            <label>Calories</label>
            <input type="number" value={workoutForm.calories} onChange={(e)=>setWorkoutForm({...workoutForm, calories:e.target.value})} />
          </div>
          <div style={{flexBasis:"100%"}}>
            <label>Notes</label>
            <textarea value={workoutForm.notes} onChange={(e)=>setWorkoutForm({...workoutForm, notes:e.target.value})} />
          </div>
          <div>
            <button type="submit">Add workout</button>
          </div>
        </form>

        <div style={{marginTop:12}}>
          {workouts.slice(0,8).map(w => (
            <div key={w._id} className="row" style={{alignItems:"center", marginBottom:6}}>
              <div><span className="badge">{new Date(w.date).toLocaleDateString()}</span></div>
              <div><strong>{w.type}</strong></div>
              <div>{w.durationMin} min</div>
              <div>{w.calories} cal</div>
              <div style={{textAlign:"right"}}><button className="secondary" onClick={()=>delWorkout(w._id)}>Delete</button></div>
            </div>
          ))}
          {workouts.length === 0 && <p className="small">No workouts yet.</p>}
        </div>
      </div>

      <div className="card">
        <h2>Goals</h2>
        <p className="small">Set measurable goals and deadlines.</p>

        <form onSubmit={addGoal} className="row">
          <div>
            <label>Title</label>
            <input value={goalForm.title} onChange={(e)=>setGoalForm({...goalForm, title:e.target.value})}/>
          </div>
          <div>
            <label>Type</label>
            <select value={goalForm.type} onChange={(e)=>setGoalForm({...goalForm, type:e.target.value})}>
              <option value="general">General</option>
              <option value="weight_loss">Weight loss</option>
              <option value="muscle_gain">Muscle gain</option>
              <option value="endurance">Endurance</option>
            </select>
          </div>
          <div>
            <label>Target value</label>
            <input type="number" value={goalForm.targetValue} onChange={(e)=>setGoalForm({...goalForm, targetValue:e.target.value})}/>
          </div>
          <div>
            <label>Unit</label>
            <input value={goalForm.unit} onChange={(e)=>setGoalForm({...goalForm, unit:e.target.value})}/>
          </div>
          <div>
            <label>Deadline</label>
            <input type="date" value={goalForm.deadline} onChange={(e)=>setGoalForm({...goalForm, deadline:e.target.value})}/>
          </div>
          <div style={{display:"flex", alignItems:"flex-end"}}>
            <button type="submit">Add goal</button>
          </div>
        </form>

        <div style={{marginTop:12}}>
          {goals.slice(0,8).map(g => (
            <div key={g._id} className="row" style={{alignItems:"center", marginBottom:6}}>
              <div><span className="badge">{g.type}</span></div>
              <div><strong>{g.title}</strong></div>
              <div>{g.targetValue ? `${g.targetValue} ${g.unit || ""}` : ""}</div>
              <div>{g.deadline ? new Date(g.deadline).toLocaleDateString() : ""}</div>
              <div style={{textAlign:"right"}}><button className="secondary" onClick={()=>delGoal(g._id)}>Delete</button></div>
            </div>
          ))}
          {goals.length === 0 && <p className="small">No goals yet.</p>}
        </div>

        <hr style={{border:"none", borderTop:"1px solid #eee", margin:"16px 0"}} />

        <h2>Progress</h2>
        {summary ? (
          <>
            <div className="row">
              <div className="card" style={{boxShadow:"none", background:"#fafafe"}}>
                <div className="small">Last {summary.windowDays} days</div>
                <div><strong>{summary.totals.workouts}</strong> workouts</div>
                <div><strong>{summary.totals.durationMin}</strong> minutes</div>
                <div><strong>{summary.totals.calories}</strong> calories</div>
              </div>
            </div>
            {chartData && <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />}
          </>
        ) : <p className="small">Loading…</p>}

        <hr style={{border:"none", borderTop:"1px solid #eee", margin:"16px 0"}} />

        <h2>AI recommendations</h2>
        <p className="small">Generates a 3-day plan based on recent workouts + your active goal.</p>
        <button onClick={getRecommendations}>Get recommendations</button>

        {rec && (
          <div style={{marginTop:12}}>
            <div className="card" style={{boxShadow:"none", background:"#fafafe"}}>
              <strong>Rationale</strong>
              <ul>
                {rec.rationale.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            <div style={{marginTop:10}}>
              {rec.plan.map((p) => (
                <div key={p.day} className="card" style={{marginBottom:10}}>
                  <div className="row" style={{alignItems:"center"}}>
                    <div><span className="badge">Day {p.day}</span></div>
                    <div><strong>{p.title}</strong></div>
                    <div className="small">{p.durationMin} min · {p.intensity}</div>
                  </div>
                  <ul>
                    {p.exercises.map((ex, i) => <li key={i}>{ex.name} {ex.sets ? `— ${ex.sets}x${ex.reps ?? ""}` : ""}{ex.minutes ? `— ${ex.minutes} min` : ""}{ex.seconds ? `— ${ex.seconds} sec` : ""}{ex.rounds ? `— ${ex.rounds} rounds` : ""}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
