import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Youtube } from 'lucide-react';
import UserStats from './UserStats';
import Leaderboard from './Leaderboard';
import { getUserStats, updateUserStats, getDailyLeaderboard, addToLeaderboard } from '../utils/gameStorage';

const ShantyGame = () => {
  // ... [Previous state declarations remain the same]
  const [userStats, setUserStats] = useState(getUserStats());
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    setLeaderboard(getDailyLeaderboard());
  }, []);

  const handleGameEnd = (won) => {
    const updatedStats = updateUserStats(won, score);
    setUserStats(updatedStats);
    if (won) {
      setShowNameInput(true);
    }
  };

  const handleSubmitScore = () => {
    if (playerName.trim()) {
      const updatedLeaderboard = addToLeaderboard(playerName, score);
      setLeaderboard(updatedLeaderboard);
      setShowNameInput(false);
    }
  };

  // ... [Previous game logic remains the same]

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="w-full">
          {/* Original game component */}
          <CardHeader>
            <CardTitle>Daily Sea Shanty Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ... [Previous game UI remains the same] ... */}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <UserStats stats={userStats} />
          <Leaderboard scores={leaderboard} />
        </div>
      </div>

      {showNameInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Submit Your Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
              />
              <Button onClick={handleSubmitScore} className="w-full">
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShantyGame;