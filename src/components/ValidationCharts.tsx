import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BIAS_CHART, WFA_DEMO } from '../data/methods';

export function ValidationCharts() {
  return (
    <section className="panel charts">
      <div className="panel-head">
        <h2>Illustrative charts</h2>
        <p className="muted">Synthetic teaching examples — not your strategy data.</p>
      </div>

      <div className="chart-grid">
        <figure>
          <figcaption>Method trust profile (OOS fidelity index, 0–1)</figcaption>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={BIAS_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 2]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="is" name="IS reporting bias" fill="#c97d2e" />
              <Bar dataKey="oos" name="OOS honesty" fill="#3d8b6e" />
            </BarChart>
          </ResponsiveContainer>
        </figure>

        <figure>
          <figcaption>Cumulative return — IS vs OOS segments (walk-forward demo)</figcaption>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={WFA_DEMO}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
              <XAxis dataKey="block" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="isPath" name="In-sample" stroke="#c97d2e" dot={false} />
              <Line type="monotone" dataKey="oosPath" name="Out-of-sample" stroke="#3d8b6e" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </figure>
      </div>
    </section>
  );
}
