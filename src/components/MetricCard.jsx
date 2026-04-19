import './MetricCard.css'
export default function MetricCard({label, value, change, changeType}) {
return (
    <div className="metric-card">
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
        {change && (
            <div className={`metric-change ${changeType}`}>{change}</div>
        )}
    </div>
    )
}