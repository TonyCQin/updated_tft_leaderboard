import "dotenv/config";

export interface RankedTFTStats {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  [key: string]: any;
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

    const summonerRes = await fetch(
      `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}${apiKey}`
    );
    if (!summonerRes.ok) {
      throw new Error(
        `Failed to fetch summoner info: ${summonerRes.statusText}`
      );
    }
    const summonerData = await summonerRes.json();
    const summonerId = summonerData.id;

    const statsRes = await fetch(
      `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}${apiKey}`
    );
    if (!statsRes.ok) {
      throw new Error(`Failed to fetch ranked stats: ${statsRes.statusText}`);
    }
    const statsData = await statsRes.json();
    console.log(statsData);

    const rankedStats = statsData.find(
      (entry: RankedTFTStats) => entry.queueType === "RANKED_TFT"
    );

    return rankedStats;
  } catch (error) {
    console.error("Error in getStats:", error);
    throw error;
  }
}
