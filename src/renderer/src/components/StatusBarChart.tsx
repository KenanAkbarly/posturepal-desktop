import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

export interface StatusBarDatum {
  label: string
  good: number
  warning: number
  poor: number
}

interface StatusBarChartProps {
  data: StatusBarDatum[]
  height?: number
  unit?: string
}

export function StatusBarChart({
  data,
  height = 200,
  unit = 'min'
}: StatusBarChartProps): React.JSX.Element {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }}
          contentStyle={{
            background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'hsl(var(--popover-foreground))'
          }}
          formatter={(value, name) => [`${String(value)} ${unit}`, String(name)]}
        />
        <Bar dataKey="good" stackId="a" fill="#10b981" name="Good" />
        <Bar dataKey="warning" stackId="a" fill="#f59e0b" name="Warning" />
        <Bar dataKey="poor" stackId="a" fill="#ef4444" name="Poor" />
      </BarChart>
    </ResponsiveContainer>
  )
}
