import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const Leaderboard = ({ scores }) => (
  <Card className="w-full mt-4">
    <CardHeader>
      <CardTitle>Daily Leaderboard</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {scores.map((score, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="font-semibold">#{index + 1}</span>
            <span>{score.name}</span>
            <span className="font-bold">{score.score}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default Leaderboard;