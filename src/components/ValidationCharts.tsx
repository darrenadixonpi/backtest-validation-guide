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

type TooltipEntry = {
  dataKey?: string | number;
  name?: string;
  value?: number | null;
  color?: string;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <ul>
        {payload.map((entry) => (
          <li key={String(entry.dataKey)} style={{ color: entry.color }}>
            <span>{entry.name}</span>
            <span>{entry.value == null ? '—' : Number(entry.value).toFixed(3)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const AXIS_TICK = { fontSize: 11, fill: '#aeb4bf' };
const GRID_STROKE = '#2a2f3a';
const BAR_CURSOR = { fill: 'rgba(122, 162, 247, 0.1)', stroke: '#4a7cbf', strokeWidth: 1 };
const LINE_CURSOR = { stroke: '#4a7cbf', strokeWidth: 1, strokeDasharray: '4 4' };

export function ValidationCharts() {
  return (
    <section className="panel charts">
      <div className="panel-head">
        <h2>Illustrative charts</h2>
        <p className="muted">Synthetic teaching examples — not your strategy data.</p>
      </div>

      <div className="chart-grid">
        <figure>
          <figcaption>Method trust profile (OOS fidelity 0–1; IS bias factor, relative)</figcaption>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={BIAS_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="label" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={{ stroke: GRID_STROKE }} />
              <YAxis domain={[0, 2]} tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={{ stroke: GRID_STROKE }} />
              <Tooltip content={<ChartTooltip />} cursor={BAR_CURSOR} />
              <Legend wrapperStyle={{ color: '#aeb4bf', fontSize: 12 }} />
              <Bar dataKey="is" name="IS reporting bias" fill="#c97d2e" />
              <Bar dataKey="oos" name="OOS honesty" fill="#3d8b6e" />
            </BarChart>
          </ResponsiveContainer>
        </figure>

        <figure>
          <figcaption>Per-block return — IS vs OOS segments (walk-forward demo)</figcaption>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={WFA_DEMO}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="block" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={{ stroke: GRID_STROKE }} />
              <YAxis tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={{ stroke: GRID_STROKE }} />
              <Tooltip content={<ChartTooltip />} cursor={LINE_CURSOR} />
              <Legend wrapperStyle={{ color: '#aeb4bf', fontSize: 12 }} />
              <Line type="monotone" dataKey="isPath" name="In-sample" stroke="#c97d2e" dot={false} connectNulls={false} />
              <Line type="monotone" dataKey="oosPath" name="Out-of-sample" stroke="#3d8b6e" dot={false} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </figure>
      </div>
    </section>
  );
}
