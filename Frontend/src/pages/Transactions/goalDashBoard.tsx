import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Pencil, Trash2 } from "lucide-react";
import "./goalDashBoard.css";

export interface GoalData {
  id: number;
  title: string;
  target_amount: number;
  stipulatedMonths: number;
  estimatedMonths: number | null;
  progress: {
    accumulated: number;
    percentage: number;
  };
  projection: {
    month: string;
    projected: number;
  }[];
}

interface Props {
  goal: GoalData;
  onDelete?: (id: number) => void;
}
const COLORS = {
  saved: "#4caf50",
  remaining: "#2196f3",
  danger: "#f44336",
};

const formatMonths = (value: number | string | undefined) => {
  const num = typeof value === "number" ? value : 0;
  return `${num.toFixed(0)} meses`;
};

const GoalDashboard = ({ goal, onDelete }: Props) => {
  if (!goal) return <p>Sem dados da meta.</p>;

  const remaining = Math.max(
    Number(goal.target_amount) - goal.progress.accumulated,
    0
  );

  const progressData = [
    { name: "Guardado", value: goal.progress.accumulated },
    { name: "Restante", value: remaining },
  ];

  const barData = [
    { name: "Prazo Estipulado", meses: goal.stipulatedMonths },
    {
      name: "Prazo Real Estimado",
      meses: goal.estimatedMonths ?? 0,
    },
  ];

  const realBarColor =
    goal.estimatedMonths &&
      goal.estimatedMonths > goal.stipulatedMonths
      ? COLORS.danger
      : COLORS.saved;

  return (
    <div className="goal-dashboard">
      <div className="dashboard-actions">
        <button
          className="edit-goal-btn"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("openEditGoal", { detail: goal })
            )
          }
        >
          <Pencil size={20} />
        </button>

        <button
          className="delete-goal-btn"
          onClick={() => onDelete?.(goal.id)}
        >
          <Trash2 size={20} />
        </button>
      </div>

      <h2 className="goal-title">
        Progressão da meta {goal.title}
      </h2>

      <div className="charts-container">
        {/* GAUGE  */}
        <div className="chart gauge-chart">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={progressData}
                innerRadius={75}
                outerRadius={110}
                startAngle={180}
                endAngle={0}
                dataKey="value"
                paddingAngle={3}
              >
                <Cell fill={COLORS.saved} />
                <Cell fill={COLORS.remaining} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="gauge-label">
            {goal.progress.percentage.toFixed(1)}%
          </div>

          <div className="gauge-legend">
            <div className="legend-item">
              <span className="legend-color saved"></span>
              Valor guardado
            </div>

            <div className="legend-item">
              <span className="legend-color remaining"></span>
              Valor restante
            </div>
          </div>

          <div className="goal-info">
            META: {goal.title} | VALOR: R${" "}
            {Number(goal.target_amount).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        {/*  BARRA  */}
        <div className="chart projection-chart">
          <h2>Comparativo de Prazo</h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart layout="vertical" data={barData}>
              <CartesianGrid
                stroke="rgba(100, 100, 100, 0.86)"
                strokeDasharray="4 4"
              />
              <XAxis
                type="number"
                tick={{ fill: "#ffffff" }}
                stroke="#ffffff"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#ffffff" }}
                stroke="#ffffff"
              />
              <Tooltip formatter={formatMonths} />

              <Bar
                dataKey="meses"
                radius={[0, 14, 14, 0]}
                barSize={28}
              >
                <Cell fill={COLORS.remaining} />
                <Cell fill={realBarColor} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GoalDashboard;

