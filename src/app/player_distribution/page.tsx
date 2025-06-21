"use client";
import { useEffect, useState } from "react";
import NormalDistributionChart from "@/components/NormalDistributionChart";
import RankLeaderboard from "@/components/RankLeaderboard";
import { formatRank } from "@/lib/formatData";
import Navbar from "@/components/Navbar";

interface Player {
  username: string;
  tag: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  snapshotPoints: number;
  orderingScore: number;
}

export default function PlayerDistribution() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("/api/getData");
        const data: Player[] = await res.json();
        setPlayers(data);
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
        <RankLeaderboard players={formatRank(players)} />
      </div>
    </div>
  );
}
