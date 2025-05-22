import { RankPlayer } from "../components/RankLeaderboard";
import { SnapshotPlayer } from "@/components/SnapshotLeaderboard";
import { calculateScore } from "./scoreUtils";

export function formatRank(raw: any[]): RankPlayer[] {
  return raw
    .map((player) => ({
      username: player.username,
      tag: player.tag,
      tier: player.tier,
      rank: player.rank,
      leaguePoints: player.leaguePoints,
      orderingScore: calculateScore(
        player.tier,
        player.rank,
        player.leaguePoints
      ),
    }))
    .sort((a, b) => b.orderingScore - a.orderingScore);
}

export function formatSnapshot(raw: any[]): SnapshotPlayer[] {
  return raw
    .map((player) => ({
      username: player.username,
      snapshotPoints: player.snapshotPoints,
    }))
    .sort((a, b) => b.snapshotPoints - a.snapshotPoints);
}
