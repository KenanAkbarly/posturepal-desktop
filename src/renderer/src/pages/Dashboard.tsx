import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Dashboard(): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Posture statistics across time.</p>
      </div>
      <Tabs defaultValue="today" className="w-full">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This week</TabsTrigger>
          <TabsTrigger value="all">All time</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s timeline</CardTitle>
              <CardDescription>Charts will appear once SQLite is wired up (Day 3).</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        </TabsContent>
        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle>This week</CardTitle>
              <CardDescription>Bar chart of good vs poor posture per day.</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        </TabsContent>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All time</CardTitle>
              <CardDescription>Cumulative stats.</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
