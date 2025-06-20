import { getData } from "@/lib/getData";
import { updateDatabaseSnapshotPoints } from "@/lib/updateDBSnapshot";

interface Player {
  username: string;
  orderingScore: number;
  snapshotPoints: number;
}

function compareSnapshot(a: Player, b: Player): number {
  return b.orderingScore - a.orderingScore;
}

export async function updateSnapshot(): Promise<void> {
  try {
    const { info } = await getData();
    const users = JSON.parse(info.userinfo);

    users.sort(compareSnapshot);

    let currentPoints = users.length;
    let lastScore = null;
    let sameScoreCount = 0;
    const len = users.length;

    const updatedUsers: { username: string; points: number }[] = [];

    for (let i = 0; i < len; i++) {
      const player = users[i];
      if (player.orderingScore !== lastScore) {
        currentPoints -= sameScoreCount;
        sameScoreCount = 1;
        lastScore = player.orderingScore;
      } else {
        sameScoreCount++;
      }

      updatedUsers.push({
        username: player.username,
        points: currentPoints + player.snapshotPoints,
      });
    }

    for (const { username, points } of updatedUsers) {
      await updateDatabaseSnapshotPoints(username, points);
    }

    console.log("The snapshot points were updated!");
  } catch (error) {
    console.error("Error updating snapshot points:", error);
  }
}

updateSnapshot();
