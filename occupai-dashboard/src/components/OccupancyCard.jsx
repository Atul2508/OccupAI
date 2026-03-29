export default function OccupancyCard({ location, occupancy }) {
    const pct = Math.round(occupancy.occupancyPct * 100);

    const getColor = (pct) => {
        if (pct >= 80) return '#ef4444';
        if (pct >= 50) return '#f97316';
        return '#22c55e';
    };

    const getLabel = (pct) => {
        if (pct >= 80) return 'Nearly Full 🔴';
        if (pct >= 50) return 'Moderate 🟡';
        return 'Available 🟢';
    };

    return (
        <div style={{
            background: '#1f2937',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <h2 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>
                {location.name}
            </h2>
            <p style={{ color: '#9ca3af', marginTop: '4px', fontSize: '0.85rem' }}>
                {getLabel(pct)}
            </p>

            {/* Progress bar */}
            <div style={{
                marginTop: '16px',
                background: '#374151',
                borderRadius: '99px',
                height: '12px',
                width: '100%'
            }}>
                <div style={{
                    width: `${pct}%`,
                    height: '12px',
                    borderRadius: '99px',
                    background: getColor(pct),
                    transition: 'width 0.5s ease'
                }} />
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
                color: '#9ca3af',
                fontSize: '0.85rem'
            }}>
                <span>{occupancy.estimatedPeople} people</span>
                <span>{pct}% full</span>
            </div>
        </div>
    );
}