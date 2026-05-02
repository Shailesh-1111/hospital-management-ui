import { useState, useEffect, useRef } from 'react'
import './Dashboard.css'

const IconMedical = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
)

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
)

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)

const IconBed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
)

const IconStethoscope = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
)

const IconBuilding = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="18"/><line x1="15" y1="22" x2="15" y2="18"/><line x1="18" y1="6" x2="18" y2="6"/><line x1="18" y1="10" x2="18" y2="10"/><line x1="18" y1="14" x2="18" y2="14"/><line x1="18" y1="18" x2="18" y2="18"/><line x1="6" y1="6" x2="6" y2="6"/><line x1="6" y1="10" x2="6" y2="10"/><line x1="6" y1="14" x2="6" y2="14"/><line x1="6" y1="18" x2="6" y2="18"/><line x1="10" y1="6" x2="14" y2="6"/><line x1="10" y1="10" x2="14" y2="10"/><line x1="10" y1="14" x2="14" y2="14"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
)

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
)

const IconError = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
)

export default function Dashboard() {
  const [beds, setBeds] = useState([])
  const [currentFloor, setCurrentFloor] = useState(1)
  const [lastBedId, setLastBedId] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [isFloorLoading, setIsFloorLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [selectedBed, setSelectedBed] = useState(null)
  const [infoBed, setInfoBed] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [statusDetails, setStatusDetails] = useState({ title: '', message: '' })
  
  const observerTarget = useRef(null)

  const [bookingData, setBookingData] = useState({
    patientName: '',
    mobile: '',
    age: '',
    fromDate: '',
    toDate: ''
  })
  
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)

  const closeModal = () => {
    setInfoBed(null)
    setSelectedBed(null)
    setIsSuccess(false)
    setIsError(false)
  }

  useEffect(() => {
    if (!lastBedId) {
      setIsFloorLoading(true)
    } else {
      setIsPageLoading(true)
    }

    const cursorParam = lastBedId ? `&lastId=${lastBedId}` : ''
    fetch(`http://localhost:8080/api/v1/beds?floor=${currentFloor}${cursorParam}&size=25`)
      .then(res => res.json())
      .then(data => {
        if (!lastBedId) {
          setBeds(data || [])
        } else {
          setBeds(prev => [...prev, ...(data || [])])
        }
        setHasMore(data.length === 25)
        setIsFloorLoading(false)
        setIsPageLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch beds:", err)
        setIsFloorLoading(false)
        setIsPageLoading(false)
      })
  }, [currentFloor, lastBedId])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFloorLoading && !isPageLoading && hasMore && beds.length > 0) {
          setLastBedId(beds[beds.length - 1].id)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [isFloorLoading, isPageLoading, hasMore, beds])

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/api/v1/beds/stream')
    
    eventSource.addEventListener('bed-update', (event) => {
      const updatedBed = JSON.parse(event.data)
      setBeds(prev => prev.map(b => b.id === updatedBed.id ? updatedBed : b))
      setInfoBed(prev => prev?.id === updatedBed.id ? (updatedBed.status === 'AVAILABLE' ? null : updatedBed) : prev)
    })

    return () => eventSource.close()
  }, [])

  useEffect(() => {
    if (selectedBed) {
      const now = new Date()
      const tzoffset = now.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(now - tzoffset)).toISOString().slice(0, 16);
      
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const localISOTomorrow = (new Date(tomorrow - tzoffset)).toISOString().slice(0, 16);

      setBookingData({
        patientName: '',
        mobile: '',
        age: '',
        fromDate: localISOTime,
        toDate: localISOTomorrow
      })
    }
  }, [selectedBed])

  useEffect(() => {
    if (selectedBed && bookingData.fromDate && bookingData.toDate) {
      setIsCalculating(true)
      const type = selectedBed.type
      const from = bookingData.fromDate + ":00"
      const to = bookingData.toDate + ":00"
      
      fetch(`http://localhost:8080/api/v1/beds/pricing?type=${type}&from=${from}&to=${to}`)
        .then(res => res.json())
        .then(data => {
          setEstimatedCost(data)
          setIsCalculating(false)
        })
        .catch(err => {
          console.error("Pricing error:", err)
          setIsCalculating(false)
        })
    }
  }, [selectedBed, bookingData.fromDate, bookingData.toDate])

  const getBedRate = (type) => type === 'ICU' ? 5000 : 2000

  const handleBedClick = (bed) => {
    if (bed.status === 'AVAILABLE') {
      setSelectedBed(bed)
      setInfoBed(null)
      setIsSuccess(false)
      setIsError(false)
    }
  }

  const handleInfoClick = (e, bed) => {
    e.stopPropagation()
    setInfoBed(bed)
    setSelectedBed(null)
    setIsSuccess(false)
    setIsError(false)
  }

  const handleBookBed = async (e) => {
    e.preventDefault()
    if (!selectedBed || !bookingData.patientName || !bookingData.mobile) return

    const payload = {
      patientName: bookingData.patientName,
      mobile: bookingData.mobile,
      age: parseInt(bookingData.age),
      fromTime: bookingData.fromDate + ":00",
      toTime: bookingData.toDate + ":00"
    }

    const idempotencyKey = crypto.randomUUID()

    try {
      const res = await fetch(`http://localhost:8080/api/v1/beds/${selectedBed.id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json();

      if (!res.ok) {
         setStatusDetails({
           title: 'Booking Failed',
           message: data.message === 'Bed already occupied' ? 'This seat was just occupied by another user. Please choose a different bed.' : (data.message || 'An unexpected error occurred.')
         })
         setIsError(true)
         return
      }
      
      setStatusDetails({
        title: 'Booking Confirmed!',
        message: `Bed ${selectedBed.id} has been successfully reserved for ${bookingData.patientName}. Total expected cost: ₹${estimatedCost.toLocaleString()}`
      })
      setIsSuccess(true)
    } catch (err) {
      setStatusDetails({
        title: 'Connection Error',
        message: 'Could not connect to the server. Please check your internet connection.'
      })
      setIsError(true)
    }
  }

  const handleDischarge = async (bedId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/beds/${bedId}/discharge`, {
        method: 'POST'
      })
      if (!res.ok) throw new Error("Discharge failed")
      
      setStatusDetails({
        title: 'Patient Discharged!',
        message: `Bed ${bedId} is now available for new patients.`
      })
      setIsSuccess(true)
    } catch (err) {
      setStatusDetails({
        title: 'Discharge Failed',
        message: 'An error occurred while discharging the patient.'
      })
      setIsError(true)
    }
  }

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  }

  const getDaysLeft = (dischargeDateStr) => {
    if (!dischargeDateStr) return 'N/A'
    const dischargeDate = new Date(dischargeDateStr)
    const today = new Date()
    dischargeDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    const diffTime = dischargeDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Vacating Today'
    if (diffDays === 1) return '1 day left'
    return `${diffDays} days left`
  }

  const formatShortDate = (isoString) => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    return date.toLocaleString('en-IN', { day: 'numeric', month: 'short' })
  }

  const renderSkeletons = (count) => {
    return Array(count).fill(0).map((_, i) => (
      <div key={`skeleton-${i}`} className="seat-card skeleton-card">
        <div className="skeleton-top"></div>
        <div className="skeleton-body"></div>
      </div>
    ))
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2><IconMedical /> Manage beds</h2>
        <div className="legend">
          <div className="legend-item"><span className="legend-color icu"></span> ICU</div>
          <div className="legend-item"><span className="legend-color non-icu"></span> Non-ICU</div>
          <div className="legend-item"><span className="legend-color available"></span> Available</div>
          <div className="legend-item"><span className="legend-color occupied"></span> Occupied</div>
        </div>
      </div>

      <div className="dashboard-content-layout">
        <div className="left-panel">
          <div className="theater-layout">
            <div className="nurse-station">Nurse Station - Floor {currentFloor}</div>

            <div className="seats-grid">
              {isFloorLoading ? (
                 renderSkeletons(25)
              ) : beds.length === 0 ? <p>No beds available</p> : beds.map(bed => (
                <div 
                  key={bed.id} 
                  className={`seat-card ${bed.status.toLowerCase()} ${bed.type.toLowerCase()} ${selectedBed?.id === bed.id ? 'selected' : ''}`}
                >
                  <div className="seat-top">
                    <span className="seat-number">{bed.id}</span>
                    <span className="seat-type">{bed.type}</span>
                  </div>
                  
                  <div className="seat-body">
                    {bed.status === 'OCCUPIED' ? (
                      <>
                        <span className="patient-name">{bed.patientName}</span>
                        <div className="bed-details-list">
                          <div className="bed-detail-item"><IconCalendar /> {formatShortDate(bed.occupiedFrom)} - {formatShortDate(bed.expectedDischarge)}</div>
                          <div className="bed-detail-item highlight-days" style={{color: '#34d399'}}><IconClock /> {getDaysLeft(bed.expectedDischarge)}</div>
                        </div>
                        <button 
                          className="view-details-btn" 
                          onClick={(e) => handleInfoClick(e, bed)}
                        >
                          View Details
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="available-text">Available</span>
                        <div className="bed-details-list">
                          <div className="bed-detail-item"><IconBed /> Rate: ₹{getBedRate(bed.type).toLocaleString()}/day</div>
                          <div className="bed-detail-item"><IconStethoscope /> {bed.type === 'ICU' ? 'Ventilator Ready' : 'Oxygen Support'}</div>
                        </div>
                        <button 
                          className="book-bed-btn" 
                          onClick={(e) => handleBedClick(bed)}
                        >
                          Book Bed
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {isPageLoading && (
              <div className="seats-grid" style={{ marginTop: '1.5rem' }}>
                {renderSkeletons(10)}
              </div>
            )}

            {!isFloorLoading && hasMore && beds.length > 0 && (
              <div ref={observerTarget} style={{ height: '20px', width: '100%', marginTop: '20px' }}></div>
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="floor-sidebar">
            <h3>Select Floor</h3>
            <button 
              className={`floor-btn ${currentFloor === 1 ? 'active' : ''}`}
              onClick={() => { setCurrentFloor(1); setLastBedId(null); setHasMore(true); setInfoBed(null); setSelectedBed(null); }}
            >
              <IconBuilding /> Floor 1 (Emergency)
            </button>
            <button 
              className={`floor-btn ${currentFloor === 2 ? 'active' : ''}`}
              onClick={() => { setCurrentFloor(2); setLastBedId(null); setHasMore(true); setInfoBed(null); setSelectedBed(null); }}
            >
              <IconBuilding /> Floor 2 (ICU Ward)
            </button>
            <button 
              className={`floor-btn ${currentFloor === 3 ? 'active' : ''}`}
              onClick={() => { setCurrentFloor(3); setLastBedId(null); setHasMore(true); setInfoBed(null); setSelectedBed(null); }}
            >
              <IconBuilding /> Floor 3 (General)
            </button>
          </div>
        </div>

      </div>

      {(infoBed || selectedBed) && (
        <div className="modal-backdrop" onClick={closeModal}>
          
          {(isSuccess || isError) ? (
            <div className={`center-modal ${isSuccess ? 'success-modal' : 'error-modal'}`} onClick={e => e.stopPropagation()}>
               <div className="status-content">
                  {isSuccess ? <IconCheck /> : <IconError />}
                  <h3>{statusDetails.title}</h3>
                  <p>{statusDetails.message}</p>
                  <button className="confirm-btn" onClick={closeModal}>Go Back</button>
               </div>
            </div>
          ) : (
            <>
              {infoBed && (
                <div className="center-modal" onClick={e => e.stopPropagation()}>
                  <div className="info-modal-header">
                    <h3>Bed {infoBed.id} Details</h3>
                    <button className="close-btn" onClick={closeModal}>×</button>
                  </div>
                  <div className="info-modal-body">
                    <div className="info-row">
                      <span className="info-label">Patient Name:</span>
                      <span className="info-value">{infoBed.patientName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Mobile:</span>
                      <span className="info-value">{infoBed.mobile}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Age:</span>
                      <span className="info-value">{infoBed.age || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Condition:</span>
                      <span className="info-value">{infoBed.condition || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Occupied From:</span>
                      <span className="info-value text-highlight">{formatDateTime(infoBed.occupiedFrom)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Expected Discharge:</span>
                      <span className="info-value text-highlight">{formatDateTime(infoBed.expectedDischarge)}</span>
                    </div>
                    <div className="info-row total-cost-row">
                      <span className="info-label">Total Cost:</span>
                      <span className="info-value cost-highlight">₹{infoBed.totalCost?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="info-modal-footer">
                     <button className="discharge-btn-large" onClick={() => handleDischarge(infoBed.id)}>
                       Discharge Patient Now
                     </button>
                  </div>
                </div>
              )}

              {selectedBed && selectedBed.status === 'AVAILABLE' && (
                <div className="center-modal" onClick={e => e.stopPropagation()}>
                  <div className="info-modal-header">
                    <h3>Book Bed {selectedBed.id}</h3>
                    <button className="close-btn" onClick={closeModal}>×</button>
                  </div>
                  <div className="info-modal-body">
                    <form onSubmit={handleBookBed} className="booking-form">
                      <input 
                        type="text" 
                        placeholder="Patient Name" 
                        value={bookingData.patientName}
                        onChange={(e) => setBookingData({...bookingData, patientName: e.target.value})}
                        autoFocus
                        required 
                      />
                      <div className="input-row">
                        <input 
                          type="tel" 
                          placeholder="Mobile Number" 
                          value={bookingData.mobile}
                          onChange={(e) => setBookingData({...bookingData, mobile: e.target.value})}
                          required 
                        />
                        <input 
                          type="number" 
                          placeholder="Age" 
                          value={bookingData.age}
                          onChange={(e) => setBookingData({...bookingData, age: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="date-group">
                        <div className="date-input">
                          <label>From Time</label>
                          <input 
                            type="datetime-local" 
                            value={bookingData.fromDate}
                            onChange={(e) => setBookingData({...bookingData, fromDate: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="date-input">
                          <label>To Time</label>
                          <input 
                            type="datetime-local" 
                            value={bookingData.toDate}
                            onChange={(e) => setBookingData({...bookingData, toDate: e.target.value})}
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="price-calculator">
                        <span className="price-label">Estimated Total Cost:</span>
                        <span className="price-amount">{isCalculating ? '...' : `₹${estimatedCost.toLocaleString()}`}</span>
                      </div>

                      <button type="submit" className="confirm-btn">Confirm Booking</button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
