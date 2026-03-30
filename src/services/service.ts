
import axios from 'axios'

const GEO_URL  = 'https://geocoding-api.open-meteo.com/v1/search'
const META_URL = 'https://api.open-meteo.com/v1/forecast'

// 1. Shahar nomidan koordinata olish
export const getCoords = async (city: string) => {
    const { data } = await axios.get(GEO_URL, {
        params: { name: city, count: 1, language: 'uz' }
    })
    if (!data.results?.length) throw new Error('Shahar topilmadi')
    return data.results[0] // { latitude, longitude, name, country }
}

// 2. Koordinatadan ob-havo olish
export const getWeather = async (lat: number, lon: number) => {
    const { data } = await axios.get(META_URL, {
        params: {
            latitude: lat,
            longitude: lon,
            current: [
                'temperature_2m',
                'apparent_temperature',
                'relative_humidity_2m',
                'wind_speed_10m',
                'wind_direction_10m',
                'weather_code',
                'cloud_cover',
                'surface_pressure',
                'visibility',
                'is_day',
            ].join(','),
            hourly: [
                'temperature_2m',
                'weather_code',
            ].join(','),
            daily: [
                'temperature_2m_max',
                'temperature_2m_min',
                'weather_code',
                'sunrise',
                'sunset',
                'uv_index_max',
            ].join(','),
            timezone: 'auto',
            forecast_days: 5,
        }
    })
    return data
}