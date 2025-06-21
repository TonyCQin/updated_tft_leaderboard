"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { TooltipItem } from "chart.js";
import { Line } from "react-chartjs-2";
import { useMemo, useEffect, useState } from "react";
import { calculateScore } from "@/lib/scoreUtils";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

interface Player {
  username: string;
  tag: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  snapshotPoints: number;
}

type NormalDistributionChartProps = {
  mean?: number;
  stdDev?: number;
  players?: Player[];
};

function gaussianPDF(x: number, mean: number, stdDev: number): number {
  const coeff = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -((x - mean) ** 2) / (2 * stdDev ** 2);
  return coeff * Math.exp(exponent);
}

function computeGlobalStats(
  distribution: Record<string, number>,
  scores: Record<string, number>
) {
  const entries = Object.entries(distribution);
  const totalWeight = entries.reduce((acc, [, val]) => acc + val, 0);

  const mean =
    entries.reduce((acc, [tier, percent]) => acc + scores[tier] * percent, 0) /
    totalWeight;

  const variance =
    entries.reduce(
      (acc, [tier, percent]) =>
        acc + percent * Math.pow(scores[tier] - mean, 2),
      0
    ) / totalWeight;

  return { mean, stdDev: Math.sqrt(variance) };
}

const GLOBAL_DISTRIBUTION = {
  iron_iv: 0.01,
  iron_iii: 0.14,
  iron_ii: 0.63,
  iron_i: 0.97,
  bronze_iv: 1.72,
  bronze_iii: 2.86,
  bronze_ii: 3.07,
  bronze_i: 4.36,
  silver_iv: 5.43,
  silver_iii: 7.2,
  silver_ii: 6.92,
  silver_i: 8.78,
  gold_iv: 7.69,
  gold_iii: 6.0,
  gold_ii: 5.25,
  gold_i: 4.28,
  platinum_iv: 7.51,
  platinum_iii: 5.97,
  platinum_ii: 3.2,
  platinum_i: 2.55,
  emerald_iv: 5.04,
  emerald_iii: 2.19,
  emerald_ii: 1.82,
  emerald_i: 0.55,
  diamond_iv: 2.28,
  diamond_iii: 0.9,
  diamond_ii: 0.44,
  diamond_i: 0.18,
  master: 1.99,
  grandmaster: 0.05,
  challenger: 0.03,
};

const TIER_SCORES = {
  iron_iv: 0,
  iron_iii: 100,
  iron_ii: 200,
  iron_i: 300,
  bronze_iv: 400,
  bronze_iii: 500,
  bronze_ii: 600,
  bronze_i: 700,
  silver_iv: 800,
  silver_iii: 900,
  silver_ii: 1000,
  silver_i: 1100,
  gold_iv: 1200,
  gold_iii: 1300,
  gold_ii: 1400,
  gold_i: 1500,
  platinum_iv: 1600,
  platinum_iii: 1700,
  platinum_ii: 1800,
  platinum_i: 1900,
  emerald_iv: 2000,
  emerald_iii: 2100,
  emerald_ii: 2200,
  emerald_i: 2300,
  diamond_iv: 2400,
  diamond_iii: 2500,
  diamond_ii: 2600,
  diamond_i: 2700,
  master: 2800,
  grandmaster: 3400,
  challenger: 4000,
};

export default function NormalDistributionChart({
  players = [],
}: NormalDistributionChartProps) {
  console.log(players);
  const { mean, stdDev } = computeGlobalStats(GLOBAL_DISTRIBUTION, TIER_SCORES);
  const [colors, setColors] = useState({
    foreground: "#000000",
    accent: "#3b82f6", // Tailwind blue-500 fallback
    muted: "#94a3b8",
  });

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    setColors({
      foreground:
        computedStyle.getPropertyValue("--color-foreground").trim() || "#000",
      accent:
        computedStyle.getPropertyValue("--color-accent").trim() || "#3b82f6",
      muted:
        computedStyle.getPropertyValue("--color-muted").trim() || "#94a3b8",
    });
  }, []);

  const data = useMemo(() => {
    const curvePoints = [];
    for (let x = mean - 3 * stdDev; x <= mean + 5 * stdDev; x += 100) {
      curvePoints.push({ x, y: gaussianPDF(x, mean, stdDev) });
    }

    const playerPoints =
      players?.map((p) => ({
        x: calculateScore(p.tier, p.rank, p.leaguePoints),
        y: gaussianPDF(
          calculateScore(p.tier, p.rank, p.leaguePoints),
          mean,
          stdDev
        ),
        name: p.username,
        rank: `${p.tier} ${p.rank}`,
      })) || [];
    console.log(playerPoints);

    return {
      datasets: [
        {
          label: `Player Distribution`,
          data: curvePoints,
          borderColor: colors.accent,
          backgroundColor: "transparent",
          tension: 0.2,
          pointRadius: 0,
          parsing: false,
        },
        {
          label: "Players",
          data: playerPoints,
          showLine: false,
          backgroundColor: "#22d3ee",
          pointBackgroundColor: "#22d3ee", // cyan-400
          pointBorderColor: "2563eb", // white border for contrast
          borderColor: "#2563eb",
          pointRadius: 6,
          pointHoverRadius: 8,
          parsing: false,
        },
      ],
    };
  }, [mean, stdDev, players, colors]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: colors.foreground,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const raw = context.raw as {
              x: number;
              y: number;
              name?: string;
              rank?: string;
            };

            if (
              raw &&
              typeof raw === "object" &&
              "name" in raw &&
              "rank" in raw
            ) {
              return `${raw.name} (${raw.rank})`;
            }

            return `x: ${raw.x}, y: ${raw.y.toExponential(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        ticks: {
          color: colors.muted,
        },
        title: {
          display: true,
          text: "Score",
          color: colors.foreground,
        },
      },
      y: {
        ticks: {
          color: colors.muted,
        },
        title: {
          display: true,
          text: "Probability Density",
          color: colors.foreground,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Line data={data} options={options} />
    </div>
  );
}
