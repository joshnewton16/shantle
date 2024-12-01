const STATS_KEY = 'shantyGameStats';
const SCORES_KEY = 'shantyGameScores';

export const getUserStats = () => {
  const stats = localStorage.getItem(STATS_KEY);
  return stats ? JSON.parse(stats) : {
    gamesPlayed: 0,
    gamesWon: 0,
    averageScore: 0,
    winRate: 0,
    bestScore: 0,
    currentStreak: 0,
    bestStreak: 0
  };
};

export const updateUserStats = (won, score) => {
  const stats = getUserStats();
  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    stats.bestStreak = Math.max(stats.currentStreak, stats.bestStreak);
  } else {
    stats.currentStreak = 0;
  }
  
  stats.winRate = (stats.gamesWon / stats.gamesPlayed) * 100;
  stats.averageScore = ((stats.averageScore * (stats.gamesPlayed - 1)) + score) / stats.gamesPlayed;
  stats.bestScore = Math.max(stats.bestScore, score);
  
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
};

export const getDailyLeaderboard = () => {
  const scores = localStorage.getItem(SCORES_KEY);
  return scores ? JSON.parse(scores) : [];
};

export const addToLeaderboard = (name, score) => {
  const today = new Date().toDateString();
  const scores = getDailyLeaderboard().filter(s => s.date === today);
  scores.push({ name, score, date: today });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores.slice(0, 10)));
  return scores;
};