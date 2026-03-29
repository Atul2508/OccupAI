export default function AlertBanner({ bestTime }) {
    if (!bestTime) return null;

    const time = new Date(bestTime.forTime).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit'
    });

    const pct = Math.round(bestTime.predictedPct * 100);

    return (
        <div style={{
            background: '#1e1b4b',
            border: '1px solid #4338ca',
            borderRadius: '16px',
            padding: '16px 20px',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
            <span style={{ fontSize: '1.5rem' }}>💡</span>
            <div>
                <p style={{
                    color: '#a5b4fc',
                    fontWeight: 700,
                    margin: 0,
                    fontSize: '0.9rem'
                }}>
                    Best time to visit today
                </p>
                <p style={{
                    color: '#818cf8',
                    margin: '2px 0 0 0',
                    fontSize: '0.82rem'
                }}>
                    Around {time} — only {pct}% full
                </p>
            </div>
        </div>
    );
}