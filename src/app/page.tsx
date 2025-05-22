"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import RankLeaderboard, { RankPlayer } from "../components/RankLeaderboard";
import SnapshotLeaderboard, {
  SnapshotPlayer,
} from "../components/SnapshotLeaderboard";
import { formatRank, formatSnapshot } from "@/lib/formatData";
import { useEffect, useState } from "react";

let player1: RankPlayer = {
  username: "test",
  tag: "NA1",
  tier: "IV",
  rank: "Gold",
  leaguePoints: 29,
};

let player2: SnapshotPlayer = {
  username: "test",
  snapshotPoints: 12,
};

export default function Home() {
  const [playerData, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/getData");
      const json = await res.json();
      setData(json); // assuming your API returns { info: { ... } }
      setLoading(false);
      console.log(json);
      console.log(formatRank(json));
      console.log(formatSnapshot(json));
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)]">
        <p className="text-xl">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <Navbar></Navbar>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <h1
            id="website-header"
            className="text-4xl font-bold text-[var(--color-accent)] tracking-tight"
          >
            GT TFT Snapshots
          </h1>

          <div
            id="leaderboard-info"
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 space-y-4"
          >
            <h3
              id="basic-info-header"
              className="text-2xl font-semibold text-[var(--color-foreground)]"
            >
              Basic Info
            </h3>

            <ul
              id="leaderboard-info-list"
              className="list-disc list-inside space-y-2 text-[var(--color-muted)]"
            >
              <li>
                This is the leaderboard for the current semester of GT
                Snapshots.
              </li>
              <li>
                You must be a GT student or alumni to qualify for snapshots.
              </li>
              <li>
                The ranked leaderboard will be updated hourly, while Snapshots
                occur every two weeks at Tuesday, 11:59 PM EST, before the new
                patch.
              </li>
              <li>
                Snapshot points will be calculated based on the amount of
                players participating. If 21 people were participating, 1st
                place would gain 21 points, and each placement below that would
                gain one less point.
              </li>
              <li>
                Ties will receive the same amount of points and will count as
                both places (i.e., tie for 1st will both receive 21 points, next
                player will be 3rd).
              </li>
              <li>
                Top 6 players on the leaderboard at the last week of snapshots
                will qualify for the GT Championship.
              </li>
              <li>
                Tiebreakers:
                <ul className="list-decimal list-inside ml-5 space-y-1">
                  <li>
                    Highest TFT peak rank when snapshots are active (please
                    record evidence of this!)
                  </li>
                  <li>Highest current TFT rank</li>
                </ul>
              </li>
              <li>Good luck and happy competing!</li>
            </ul>
          </div>
        </div>
      </main>
      {/* assuming loading hold works correctly, playerData should never be null */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <RankLeaderboard players={formatRank(playerData)} />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SnapshotLeaderboard players={formatSnapshot(playerData)} />
      </div>
    </div>
  );
}
