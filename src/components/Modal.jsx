import { useEffect } from "react";
import './Modal.css'
export default function Modal({title,onClose,children}) {
    useEffect(() => {
        const handleKey = e => {if (e.Key === 'Escape') onClose()}
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [onClose])
    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">{title}</span>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
            <div className="modal-body">{children}</div>
            </div>
      </div>
    )
}