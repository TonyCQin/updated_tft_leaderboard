"use client";
import { useEffect, useState } from "react";
import NormalDistributionChart from "@/components/NormalDistributionChart";
import RankLeaderboard from "@/components/RankLeaderboard";
import { formatRank } from "@/lib/formatData";
import Navbar from "@/components/Navbar";

export default function PlayerDistribution() {
  const [players, setPlayers] = useState<any[]>([]);
  const [playerData, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("/api/getData");
        const data = await res.json();
        setData(data);
        const players = data.map((p) => {
          const tierKey = `${p.tier.toLowerCase()}_${p.rank.toLowerCase()}`; // e.g., "gold_ii"
          return {
            username: p.username,
            rank: p.rank,
            tier: p.tier,
            orderingScore: p.orderingScore,
          };
        });
        setPlayers(players);
      } catch (err) {
        console.error("Failed to fetch players:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  if (loading) return <div>Loading...</div>;

  // console.log(players);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <Navbar></Navbar>
      <NormalDistributionChart players={players}></NormalDistributionChart>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <RankLeaderboard players={formatRank(playerData)} />
      </div>
    </div>
  );
}
