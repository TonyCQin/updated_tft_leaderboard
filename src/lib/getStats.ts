import "dotenv/config";

export interface RankedTFTStats {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  [key: string]: unknown;
}

export async function getStats(
  username: string,
  tag: string
): Promise<RankedTFTStats | undefined> {
  try {
    const apiKey = process.env.API_KEY;
    const idRes = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tag}${apiKey}`
    );
    if (!idRes.ok) {
      throw new Error(`Failed to fetch account ID: ${idRes.statusText}`);
    }
    const puuidData = await idRes.json();
    const puuid = puuidData.puuid;

    const statsRes = await fetch(
      `https://na1.api.riotgames.com/tft/league/v1/by-puuid/${puuid}${apiKey}`
    );
    if (!statsRes.ok) {
      throw new Error(`Failed to fetch ranked stats: ${statsRes.statusText}`);
    }
    const statsData = await statsRes.json();

    const rankedStats = statsData.find(
      (entry: RankedTFTStats) => entry.queueType === "RANKED_TFT"
    );

    return rankedStats;
  } catch (error) {
    console.error("Error in getStats:", error);
    throw error;
  }
}
