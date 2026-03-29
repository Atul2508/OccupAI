 import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function PredictionChart({ predictions }) {
    const chartData = predictions.map(p => ({
        time: new Date(p.forTime).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit'
        }),
        occupancy: Math.round(p.predictedPct * 100)
    }));

    return (
        <div style={{
            background: '#1f2937',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '16px'
        }}>
            <h2 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '16px' }}>
                24hr Prediction 📈
            </h2>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        interval={3}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                    />
                    <Tooltip
                        formatter={(value) => [`${value}%`, 'Occupancy']}
                        contentStyle={{
                            background: '#111827',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="occupancy"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}