import { getStats } from "@/lib/getStats";
import { calculateScore } from "@/lib/scoreUtils";
import clientPromise from "@/lib/mongodb";

type UsernameEntry = {
  name: string;
  tag: string;
};

type Participant = {
  username: string;
  tag: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  orderingScore: number;
  snapshotPoints: number;
};

async function insertUser(
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
    const user = {
      username,
      tag,
      tier,
      rank,
      leaguePoints: lp,
      orderingScore,
      snapshotPoints: 0,
    };

    const result = await collection.insertOne(user);

    console.log(`1 document was inserted with the _id: ${result.insertedId}`);
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
}

// manually code a list of entrants, pull their stats from riot api, then write into the database
async function writeStats() {
  const playerStats = [];
  const usernames: UsernameEntry[] = [
    { name: "AarontheN00b", tag: "NA1" },
    { name: "Jamesavian", tag: "NA1" },
    { name: "TheSaltyPika", tag: "NA1" },
    { name: "anstew", tag: "tft" },
    { name: "Fatalblaze", tag: "NA1" },
    { name: "Heavyguns", tag: "NA1" },
    { name: "baba", tag: "aware" },
    { name: "hieu", tag: "ttv" },
    { name: "Mikan", tag: "8827" },
  ];

  for (const username of usernames) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const stats = await getStats(username.name, username.tag);

      const player: Participant = stats
        ? {
            username: username.name,
            tag: username.tag,
            tier: stats.tier,
            rank: stats.rank,
            leaguePoints: stats.leaguePoints,
            orderingScore: calculateScore(
              stats.tier,
              stats.rank,
              stats.leaguePoints
            ),
            snapshotPoints: 0,
          }
        : {
            username: username.name,
            tag: username.tag,
            tier: "UNRANKED",
            rank: "",
            leaguePoints: 0,
            orderingScore: 0,
            snapshotPoints: 0,
          };

      console.log(player);
      playerStats.push(player);
    } catch (error) {
      console.error(
        `Error fetching stats for ${username.name}#${username.tag}:`,
        error
      );
    }
  }
  playerStats.sort((a, b) => b.orderingScore - a.orderingScore);
  for (const player of playerStats) {
    await insertUser(
      player.username,
      player.tag,
      player.tier,
      player.rank,
      player.leaguePoints,
      player.orderingScore
    );
  }
}

writeStats();
