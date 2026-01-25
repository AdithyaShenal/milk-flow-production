import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

type Item = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  items: Item[];
};

export default function RoundedDoughnut({ items }: Props) {
  const data = {
    labels: items.map((i) => i.label),
    datasets: [
      {
        data: items.map((i) => i.value),
        backgroundColor: items.map((i) => i.color),
        borderRadius: 12,
        spacing: 4,
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="h-64 flex justify-center items-center">
      <Doughnut
        data={data}
        options={{
          cutout: "70%",
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
        }}
      />
    </div>
  );
}
