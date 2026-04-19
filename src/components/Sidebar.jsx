import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const nav = [
    { to: '/', label: 'Dashboard', icon: <IconGrid /> },
    { to: '/students', label: 'Students', icon: <IconUsers /> },
    { to: '/trends', label: 'Grade Trends', icon: <IconTrend /> },
    { to: '/groups', label: 'Group Comparison', icon: <IconBars /> },
]

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span className="logo-text">Analytics</span>
                <span className="logo-text">Student</span>
            </div>
            <nav className="sidebar-nav">
                {nav.map(item => (
                    <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

function IconGrid() {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.5"/><rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.5"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.5"/></svg>
}
function IconUsers() {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" fill="currentColor"/><path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function IconTrend() {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="1,13 5,7 9,10 15,3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconBars() {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="8" width="3" height="7" rx="0.5" fill="currentColor" opacity="0.6"/><rect x="6" y="5" width="3" height="10" rx="0.5" fill="currentColor"/><rect x="11" y="2" width="3" height="13" rx="0.5" fill="currentColor"/></svg>
}