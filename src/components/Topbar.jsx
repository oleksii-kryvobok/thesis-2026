import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Topbar.css'
export default function Topbar({title, subtitle}) {
    const { logout } = useAuth()
    const navigate = useNavigate()
    function handleLogout() {
        logout()
        navigate('/login')
    }
    return (
        <header className="topbar">
            <div>
                <div className="topbar-title">{title}</div>
                {subtitle && <div className="topbar-sub">{subtitle}</div>}
            </div>
            <div className="topbar-right">
                <button className="logout-btn" onClick={handleLogout}>Вийти</button>
                <div className="topbar-avatar">АД</div>
            </div>
        </header>
    )
}