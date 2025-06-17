import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function ProgressBarChart({ progressList }: { progressList: any[] }) {
  const difficultyCounts: Record<string, number> = {};
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth > 100 ? screenWidth - 40 : 300; // prevent negative width

  // Count how many users are at each difficulty level
  progressList.forEach((progress: any) => {
    const difficulty = progress.next_time_difficulty || "UNKNOWN";
    difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(difficultyCounts),
    datasets: [
      {
        data: Object.values(difficultyCounts),
      },
    ],
  };

  return (
    <BarChart
      data={chartData}
      width={chartWidth}
      height={220}
      fromZero={true}
      yAxisLabel="" // ✅ Required prop
      yAxisSuffix="" // ✅ Required prop
      chartConfig={{
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      style={{
        marginVertical: 8,
        borderRadius: 10,
      }}
    />
  );
}
