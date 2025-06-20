export const tierMap = new Map<string, number>([
  ["IRON", 0],
  ["BRONZE", 400],
  ["SILVER", 800],
  ["GOLD", 1200],
  ["PLATINUM", 1600],
  ["EMERALD", 2000],
  ["DIAMOND", 2400],
  ["MASTER", 2800],
  ["GRANDMASTER", 2800],
  ["CHALLENGER", 2800],
]);

export const rankMap = new Map<string, number>([
  ["IV", 0],
  ["III", 100],
  ["II", 200],
  ["I", 300],
]);

export function calculateScore(tier: string, rank: string, lp: number): number {
  const tierScore = tierMap.get(tier.toUpperCase()) || 0;
  const rankScore = rankMap.get(rank.toUpperCase()) || 0;
  return tierScore + rankScore + lp;
}
