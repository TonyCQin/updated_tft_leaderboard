import "dotenv/config";
import { getData } from "@/lib/getData";
import { getStats } from "@/lib/getStats";
import clientPromise from "@/lib/mongodb";
import { calculateScore } from "@/lib/scoreUtils";

type Participant = {
  username: string;
  tag: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  orderingScore: number;
  snapshotPoints: number;
};

async function updateUser(
  username: string,
  tag: string,
  tier: string,
  rank: string,
  lp: number,
  orderingScore: number
): Promise<void> {
  const client = await clientPromise;
  const db = client.db("userdata");
  const collection = db.collection("info");

  try {
    const filter = { username: username };
    const newProperties = {
      tier: tier,
      rank: rank,
      leaguePoints: lp,
      orderingScore: orderingScore,
    };
    const update = { $set: newProperties };
    const result = await collection.updateOne(filter, update);

    console.log(`Matched count: ${result.matchedCount}`);
    console.log(`Modified count: ${result.modifiedCount}`);

    const updatedInfo = await collection.find({}).toArray();
    console.log(updatedInfo);
  } catch (error) {
    console.log("Error updating data:", error);
    throw error;
  }
}

async function insertHistory(player: Participant): Promise<void> {
  const client = await clientPromise;
  const db = client.db("userdata");
  const collection = db.collection("user_history");

  try {
    await collection.insertOne({
      ...player,
      timestamp: new Date(),
    });
    console.log(`Snapshot saved for ${player.username}`);
  } catch (error) {
    console.error("Error inserting snapshot:", error);
  }
}

async function updateStats(): Promise<void> {
  const { info } = await getData();
  const users = JSON.parse(info.userinfo);
  const updatedStats = [];
  for (const user of users) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const stats = await getStats(user.username, user.tag);

      const player: Participant = stats
        ? {
            username: user.username,
            tag: user.tag,
            tier: stats.tier,
            rank: stats.rank,
            leaguePoints: stats.leaguePoints,
            orderingScore: calculateScore(
              stats.tier,
              stats.rank,
              stats.leaguePoints
            ),
            snapshotPoints: user.snapshotPoints,
          }
        : {
            username: user.username,
            tag: user.tag,
            tier: "UNRANKED",
            rank: "",
            leaguePoints: 0,
            orderingScore: 0,
            snapshotPoints: user.snapshotPoints,
          };
      updatedStats.push(player);
    } catch (error) {
      console.error(
        `Error updating stats for ${user.name}#${user.tag}:`,
        error
      );
    }
  }
  updatedStats.sort((a, b) => b.orderingScore - a.orderingScore);
  for (const player of updatedStats) {
    await insertHistory(player);
    await updateUser(
      player.username,
      player.tag,
      player.tier,
      player.rank,
      player.leaguePoints,
      player.orderingScore
    );
  }
  console.log("The stats were updated!");
}

updateStats();
