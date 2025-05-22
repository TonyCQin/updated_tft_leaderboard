export const tierMap = new Map<string, number>([
  ["IRON", 1000],
  ["BRONZE", 2000],
  ["SILVER", 3000],
  ["GOLD", 4000],
  ["PLATINUM", 5000],
  ["EMERALD", 6000],
  ["DIAMOND", 7000],
  ["MASTER", 8000],
  ["GRANDMASTER", 9000],
  ["CHALLENGER", 10000],
]);

export const rankMap = new Map<string, number>([
  ["IV", 100],
  ["III", 200],
  ["II", 300],
  ["I", 400],
]);

export function calculateScore(tier: string, rank: string, lp: number): number {
  const tierScore = tierMap.get(tier.toUpperCase()) || 0;
  const rankScore = rankMap.get(rank.toUpperCase()) || 0;
  return tierScore + rankScore + lp;
}
