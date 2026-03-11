import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./categoryPie.css";

interface Props {
  data: {
    name: string;
    value: number;
  }[];
  title: string;
}

const generateColor = (index: number) => {
  const hue = (index * 137.5) % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

const CategoryPie = ({ data, title }: Props) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="pie-card">
      <h2 className="pie-title">{title}</h2>

      {data.length === 0 ? (
        <p className="pie-empty">Sem dados para este ano.</p>
      ) : (
        <div className="pie-content">
          <div className="pie-graphic">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={95}
                  label={({ percent }) =>
                    percent ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                >
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={generateColor(index)}
                    />
                  ))}
                </Pie>

                <Tooltip
                  wrapperClassName="custom-tooltip"
                  formatter={(value) => {
                    if (typeof value !== "number") return value;
                    return `R$ ${value.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pie-legend">
            {data.map((item, index) => {
              const percent = ((item.value / total) * 100).toFixed(0);

              return (
                <div key={index} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: generateColor(index) }}
                  />
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-percent">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPie;