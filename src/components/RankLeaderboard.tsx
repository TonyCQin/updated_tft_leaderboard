import Link from "next/link";

export type RankPlayer = {
  username: string;
  tag: string;
  tier: string;
  rank: string;
  leaguePoints: number;
};

export default function RankLeaderboard({
  players,
}: {
  players: RankPlayer[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold my-4">Current Ranked Leaderboard</h2>
      <div className="w-full bg-white dark:bg-gray-800 rounded shadow">
        <div className="grid grid-cols-2 font-semibold border-b border-gray-300 dark:border-gray-700 p-2">
          <span>Username</span>
          <span>Rank</span>
        </div>
        {players.map((player) => {
          const profileUrl = `https://lolchess.gg/profile/na/${player.username}-${player.tag}`;
          const rankText = ["CHALLENGER", "GRANDMASTER", "MASTER"].includes(
            player.tier
          )
            ? `${player.tier} ${player.leaguePoints} LP`
            : player.tier === "UNRANKED"
            ? "UNRANKED"
            : `${player.tier} ${player.rank} ${player.leaguePoints} LP`;

          return (
            <div
              key={`${player.username}-${player.tag}`}
              className="grid grid-cols-2 p-2 border-t border-gray-200 dark:border-gray-700"
            >
              <Link
                href={profileUrl}
                target="_blank"
                className="text-[var(--color-foreground)] hover:underline"
              >
                {player.username}#{player.tag}
              </Link>
              <div className="flex items-center space-x-2">
                <img
                  src={`/rankimages/${player.tier}.png`}
                  alt={`${player.tier} icon`}
                  className="h-6 w-auto"
                  loading="lazy"
                />
                <span>{rankText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
