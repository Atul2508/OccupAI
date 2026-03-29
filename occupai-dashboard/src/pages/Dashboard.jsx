import { useEffect, useState } from 'react';
import OccupancyCard from '../components/OccupancyCard';
import PredictionChart from '../components/PredictionChart';
import AlertBanner from '../components/AlertBanner';
import { api } from '../services/api';

const LOCATIONS = [
    { id: 1, name: 'Floor 1' },
    { id: 2, name: 'Floor 2' },
    { id: 3, name: 'Meeting Room A' },
    { id: 4, name: 'Meeting Room B' },
    { id: 5, name: 'Cafeteria' },
];

export default function Dashboard() {
    const [selected, setSelected] = useState(LOCATIONS[0]);
    const [occupancy, setOccupancy] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [bestTime, setBestTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData(selected.id);
        const interval = setInterval(() => fetchData(selected.id), 30000);
        return () => clearInterval(interval);
    }, [selected]);

    const fetchData = async (locationId) => {
        setLoading(true);
        setError(null);
        try {
            const [occ, pred, best] = await Promise.all([
                api.getCurrentOccupancy(locationId),
                api.getUpcomingPredictions(locationId),
                api.getBestTime(locationId),
            ]);
            setOccupancy(occ.data);
            setPredictions(pred.data);
            setBestTime(best.data);
        } catch (err) {
            setError('No data available for this location yet.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#111827',
            padding: '32px 20px',
            fontFamily: 'Segoe UI, sans-serif'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '28px' }}>
                    <h1 style={{
                        color: '#fff',
                        fontSize: '2rem',
                        fontWeight: 800,
                        margin: 0,
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        ⬡ OccupAI
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>
                        Real-time occupancy + predictions
                    </p>
                </div>

                {/* Location Selector */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '20px'
                }}>
                    {LOCATIONS.map(loc => (
                        <button
                            key={loc.id}
                            onClick={() => setSelected(loc)}
                            style={{
                                padding: '8px 18px',
                                borderRadius: '99px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                background: selected.id === loc.id
                                    ? '#6366f1' : '#1f2937',
                                color: selected.id === loc.id
                                    ? '#fff' : '#9ca3af',
                                transition: 'all 0.2s'
                            }}
                        >
                            {loc.name}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        marginTop: '60px',
                        fontSize: '1rem'
                    }}>
                        Loading...
                    </div>
                ) : error ? (
                    <div style={{
                        textAlign: 'center',
                        color: '#ef4444',
                        marginTop: '60px',
                        background: '#1f2937',
                        borderRadius: '16px',
                        padding: '32px'
                    }}>
                        {error}
                    </div>
                ) : (
                    <>
                        {occupancy && (
                            <OccupancyCard
                                location={selected}
                                occupancy={occupancy}
                            />
                        )}
                        <AlertBanner bestTime={bestTime} />
                        {predictions.length > 0 && (
                            <PredictionChart predictions={predictions} />
                        )}
                    </>
                )}

                {/* Footer */}
                <p style={{
                    textAlign: 'center',
                    color: '#374151',
                    fontSize: '0.75rem',
                    marginTop: '40px'
                }}>
                    OccupAI • Refreshes every 30 seconds
                </p>
            </div>
        </div>
    );
}