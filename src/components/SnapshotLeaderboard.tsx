export type SnapshotPlayer = {
  username: string;
  snapshotPoints: number;
};

export default function SnapshotLeaderboard({
  players,
}: {
  players: SnapshotPlayer[];
}) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold my-4">Snapshot Points Leaderboard</h2>
      <div className="w-full bg-white dark:bg-gray-800 rounded shadow">
        <div className="grid grid-cols-2 font-semibold border-b border-gray-300 dark:border-gray-700 p-2">
          <span>Username</span>
          <span>Snapshot Points</span>
        </div>
        {players.map((player) => (
          <div
            key={player.username}
            className="grid grid-cols-2 p-2 border-t border-gray-200 dark:border-gray-700"
          >
            <span>{player.username}</span>
            <span>{player.snapshotPoints}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
