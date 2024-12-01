import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const UserStats = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
    {Object.entries(stats).map(([key, value]) => (
      <Card key={key} className="p-2">
        <CardHeader className="p-2">
          <CardTitle className="text-sm md:text-base">{key.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-lg md:text-xl font-bold">{typeof value === 'number' ? value.toFixed(1) : value}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default UserStats;