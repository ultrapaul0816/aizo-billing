import React, { useState, useEffect } from 'react'

let timerRef
export default function Timer({
  start = 60,
  color = '#fff',
  increment = false,
  end = 60,
}) {
  const [time, setTimer] = useState(start)
  const [timer_id] = useState(`timer#${parseInt(Math.random() * 1000)}`)
  let timerInterval = null
  const animateTimer = () => {
    // if (time > 59 && time % 60 === 0)
    timerRef = document.getElementById(timer_id)
    if (timerRef)
      timerRef.animate(
        {
          opacity: [1, 0, 0, 1, 1],
          transform: [
            'translateY(0)',
            'translateY(-10px)',
            'translateY(10px)',
            'translateY(-5px)',
            'translateY(0)',
          ],
        },
        { duration: 200 }
      )
  }
  useEffect(() => {
    timerInterval = setInterval(() => {
      animateTimer()
      setTimer(t => (increment ? t + 1 : t - 1))
    }, 60000)

    return () => {
      clearInterval(timerInterval)
    }
  }, [])
  // useEffect(() => {
  //   if (time === 0) clearInterval(timerInterval)
  // }, [time])
  return (
    <div className='timer' style={{ color, borderColor: color + '23' }}>
      <span id={timer_id}>
        {parseInt(time)}
        <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>m</span>
      </span>
    </div>
  )
}
