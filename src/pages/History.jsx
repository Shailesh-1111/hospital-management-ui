import { useState, useEffect } from 'react'
import './History.css'

const IconHistory = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
)

export default function History() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/beds/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch history:", err)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="history-container">
      <h2><IconHistory /> Discharge History</h2>
      <p className="subtitle">Records of all patients who have been discharged.</p>

      {isLoading ? (
        <p>Loading history...</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Ward Type</th>
              <th>Discharge Date</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr><td colSpan="3">No history available</td></tr>
            ) : history.map(record => (
              <tr key={record.id} onClick={() => setSelectedRecord(record)} style={{cursor: 'pointer'}} className="history-row-hover">
                <td>{record.patientName}</td>
                <td>{record.bedType}</td>
                <td>{record.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedRecord && (
        <div className="modal-backdrop" onClick={() => setSelectedRecord(null)}>
          <div className="center-modal" onClick={e => e.stopPropagation()}>
            <div className="info-modal-header">
              <h3>Discharge Details</h3>
              <button className="close-btn" onClick={() => setSelectedRecord(null)}>×</button>
            </div>
            <div className="info-modal-body">
              <div className="info-row">
                <span className="info-label">Patient Name:</span>
                <span className="info-value">{selectedRecord.patientName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Bed ID:</span>
                <span className="info-value">{selectedRecord.bedId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Mobile:</span>
                <span className="info-value">{selectedRecord.mobile}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Age:</span>
                <span className="info-value">{selectedRecord.age || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Admitted On:</span>
                <span className="info-value text-highlight">{selectedRecord.fromTime ? new Date(selectedRecord.fromTime).toLocaleString('en-IN') : 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Expected Discharge:</span>
                <span className="info-value text-highlight">{selectedRecord.expectedToTime ? new Date(selectedRecord.expectedToTime).toLocaleString('en-IN') : 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Actual Discharge:</span>
                <span className="info-value text-highlight">{selectedRecord.date}</span>
              </div>
              <div className="info-row total-cost-row">
                <span className="info-label">Total Cost:</span>
                <span className="info-value cost-highlight">₹{selectedRecord.totalCost?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
