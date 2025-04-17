interface Run {
  id: number
  date: string
  distance: number
  duration: string
  notes: string
}

interface RunData {
  totalGoalDistance: number
  runs: Run[]
}

/**
 * Calculate the total distance run from all recorded runs
 */
export const calculateTotalDistance = (runs: Run[]): number => {
  return runs.reduce((total, run) => total + run.distance, 0)
}

/**
 * Calculate the average pace from all runs (in min/km format)
 */
export const calculateAveragePace = (runs: Run[]): string => {
  // Convert duration (hh:mm:ss) to seconds
  const totalSeconds = runs.reduce((total, run) => {
    const [hours, minutes, seconds] = run.duration.split(':').map(Number)
    return total + (hours * 3600 + minutes * 60 + seconds)
  }, 0)
  
  const totalDistance = calculateTotalDistance(runs)
  
  // Calculate seconds per km
  const secondsPerKm = totalDistance > 0 ? totalSeconds / totalDistance : 0
  
  // Convert to min:sec format
  const minutes = Math.floor(secondsPerKm / 60)
  const seconds = Math.floor(secondsPerKm % 60)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Calculate the total time spent running
 */
export const calculateTotalTime = (runs: Run[]): string => {
  // Convert all durations to seconds
  const totalSeconds = runs.reduce((total, run) => {
    const [hours, minutes, seconds] = run.duration.split(':').map(Number)
    return total + (hours * 3600 + minutes * 60 + seconds)
  }, 0)
  
  // Convert back to hh:mm:ss format
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Calculate progress percentage towards goal
 */
export const calculateProgressPercentage = (totalDistance: number, goalDistance: number): number => {
  return Math.min(100, Math.round((totalDistance / goalDistance) * 100))
}

/**
 * Get running statistics from data
 */
export const getRunningStats = (data: RunData) => {
  const totalDistance = calculateTotalDistance(data.runs)
  const averagePace = calculateAveragePace(data.runs)
  const totalTime = calculateTotalTime(data.runs)
  const totalRuns = data.runs.length
  const progressPercentage = calculateProgressPercentage(totalDistance, data.totalGoalDistance)
  
  return {
    totalDistance,
    averagePace,
    totalTime,
    totalRuns,
    totalGoalDistance: data.totalGoalDistance,
    progressPercentage
  }
} 