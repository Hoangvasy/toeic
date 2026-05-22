import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

export default function RadarSkillChart({ data }) {
  return (
    <RadarChart width={500} height={400} data={data} outerRadius={150}>
      <PolarGrid />

      <PolarAngleAxis dataKey="topic" />

      <PolarRadiusAxis />

      <Radar
        dataKey="accuracy"
        stroke="#3b82f6"
        fill="#3b82f6"
        fillOpacity={0.6}
      />
    </RadarChart>
  );
}
