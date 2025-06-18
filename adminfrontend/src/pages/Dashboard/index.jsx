import { Card, CardContent, Typography } from '@mui/material'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent>
          <Typography variant="h5">Users</Typography>
          <Typography>Total: 250</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5">Revenue</Typography>
          <Typography>₹ 50,000</Typography>
        </CardContent>
      </Card>
    </div>
  )
}
