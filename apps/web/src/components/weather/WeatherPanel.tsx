'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { RefreshCw, Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react'
import { cn } from '../../lib/utils'

interface WeatherData {
  show: {
    id: string
    weatherScore: number | null
    weatherRiskSummary: string | null
    weatherDetailJson: any
  }
  venue: {
    id: string
    name: string
    isOutdoor: boolean
    latitude: number | null
    longitude: number | null
    weatherNotes: string | null
  }
  climateProfile: {
    month: number
    avgHighTempC: number
    avgLowTempC: number
    avgPrecipDays: number
    avgWindSpeed?: number
    avgHumidity?: number
    hotDaysPct: number
    coldDaysPct: number
    lastUpdated: string
  } | null
  isUpdating?: boolean
  message?: string
}

interface WeatherPanelProps {
  showId: string
  className?: string
}

export function WeatherPanel({ showId, className }: WeatherPanelProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`/api/shows/${showId}/weather`)
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`)
      }
      const data = await response.json()
      setWeatherData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching weather data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load weather data')
    } finally {
      setLoading(false)
    }
  }

  const updateWeatherData = async () => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/shows/${showId}/weather`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Failed to update weather data: ${response.statusText}`)
      }
      const data = await response.json()
      setWeatherData(data)
      setError(null)
    } catch (err) {
      console.error('Error updating weather data:', err)
      setError(err instanceof Error ? err.message : 'Failed to update weather data')
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [showId])

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather & Seasonality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Cloud className="h-5 w-5" />
            Weather & Seasonality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchWeatherData}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData || !weatherData.venue.isOutdoor) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather & Seasonality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Weather intelligence is available for outdoor venues only.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { show, venue, climateProfile } = weatherData
  const weatherScore = show.weatherScore
  const weatherDetail = show.weatherDetailJson
  
  const getScoreBadgeColor = (score: number | null) => {
    if (!score) return 'bg-gray-500'
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getScoreIcon = (score: number | null) => {
    if (!score) return <Cloud className="h-4 w-4" />
    if (score >= 80) return <Sun className="h-4 w-4" />
    if (score >= 60) return <Cloud className="h-4 w-4" />
    return <CloudRain className="h-4 w-4" />
  }

  const formatTemp = (tempC: number) => {
    const tempF = Math.round((tempC * 9/5) + 32)
    return `${Math.round(tempC)}°C (${tempF}°F)`
  }

  const getMonthName = (month: number) => {
    return new Date(2024, month - 1, 1).toLocaleString('default', { month: 'long' })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            <CardTitle>Weather & Seasonality</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={updateWeatherData}
            disabled={updating || weatherData.isUpdating}
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", (updating || weatherData.isUpdating) && "animate-spin")} />
            Update
          </Button>
        </div>
        <CardDescription>
          Historical weather patterns for {venue.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weather Score */}
        {weatherScore !== null ? (
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <Badge 
                className={cn(
                  "px-3 py-1 text-white font-semibold text-lg",
                  getScoreBadgeColor(weatherScore)
                )}
              >
                {getScoreIcon(weatherScore)}
                <span className="ml-1">{weatherScore}/100</span>
              </Badge>
              <span className="text-xs text-gray-500 mt-1">Weather Score</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm mb-1">
                {show.weatherRiskSummary || 'Weather conditions assessed'}
              </p>
              {weatherDetail?.reasons && (
                <ul className="text-sm text-gray-600 space-y-1">
                  {weatherDetail.reasons.map((reason: string, index: number) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-gray-400">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Cloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {weatherData.isUpdating ? 'Analyzing weather data...' : 'Weather score not available'}
            </p>
          </div>
        )}

        {/* Climate Profile */}
        {climateProfile && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-3 text-gray-700">
                {getMonthName(climateProfile.month)} Climate Overview
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-medium">Avg High</div>
                    <div className="text-gray-600">{formatTemp(climateProfile.avgHighTempC)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">Avg Low</div>
                    <div className="text-gray-600">{formatTemp(climateProfile.avgLowTempC)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Rainy Days</div>
                    <div className="text-gray-600">{Math.round(climateProfile.avgPrecipDays)} days</div>
                  </div>
                </div>
                
                {climateProfile.avgWindSpeed && (
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-600" />
                    <div>
                      <div className="font-medium">Avg Wind</div>
                      <div className="text-gray-600">{Math.round(climateProfile.avgWindSpeed)} km/h</div>
                    </div>
                  </div>
                )}
              </div>
              
              {(climateProfile.hotDaysPct > 0 || climateProfile.coldDaysPct > 0) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-1">
                    {climateProfile.hotDaysPct > 0 && (
                      <div>Very hot days (>30°C): {Math.round(climateProfile.hotDaysPct)}%</div>
                    )}
                    {climateProfile.coldDaysPct > 0 && (
                      <div>Very cold days (&lt;5°C): {Math.round(climateProfile.coldDaysPct)}%</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {weatherDetail?.recommendations && weatherDetail.recommendations.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="font-medium text-sm text-blue-900 mb-2">Recommendations</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              {weatherDetail.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-blue-400">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Venue Notes */}
        {venue.weatherNotes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="font-medium text-sm text-gray-700 mb-1">Venue Notes</h5>
            <p className="text-sm text-gray-600">{venue.weatherNotes}</p>
          </div>
        )}

        {/* Data Source */}
        {climateProfile && (
          <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            Data last updated: {new Date(climateProfile.lastUpdated).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}