import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./lineDashBoard.css";

interface Props {
  data: {
    month: string;
    income: number;
    expense: number;
  }[];
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const COLORS = {
  income: "#3b82f6",
  expense: "#ef4444",
  axis: "#888",
};

const mesesPTBR: Record<string, string> = {
  Jan: "Janeiro",
  Feb: "Fevereiro",
  Mar: "Março",
  Apr: "Abril",
  May: "Maio",
  Jun: "Junho",
  Jul: "Julho",
  Aug: "Agosto",
  Sep: "Setembro",
  Oct: "Outubro",
  Nov: "Novembro",
  Dec: "Dezembro",
};

const DashboardCard = ({
  data,
  years,
  selectedYear,
  onYearChange,
}: Props) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <h3 className="line-h3">Relação Lucro x Gasto</h3>

        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="year-select"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
                stroke="rgba(100, 100, 100, 0.86)"
                strokeDasharray="4 4"
              />

          <XAxis
            dataKey="month"
            stroke={COLORS.axis}
            tickFormatter={(month) =>
              mesesPTBR[month as string] || month
            }
          />

          <YAxis stroke={COLORS.axis} />

          <Tooltip
            labelFormatter={(month) =>
              mesesPTBR[month as string] || month
            }
            formatter={(value) => {
              if (typeof value !== "number") return value;

              return `R$ ${value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`;
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="income"
            name="Lucro"
            stroke={COLORS.income}
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="expense"
            name="Despesa"
            stroke={COLORS.expense}
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardCard;