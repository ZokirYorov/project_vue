<!-- views/WeatherPage.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">

    <!-- Search -->
    <div class="max-w-2xl mx-auto mb-6">
      <div class="flex gap-2">
        <input
            v-model="cityInput"
            @keydown.enter="fetchWeather"
            type="text"
            placeholder="Shahar nomini kiriting..."
            class="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        />
        <button
            @click="fetchWeather"
            :disabled="loading"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-semibold transition"
        >
          {{ loading ? '...' : 'Qidirish' }}
        </button>
      </div>
      <p v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</p>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="max-w-2xl mx-auto space-y-4">
      <div class="bg-white rounded-2xl p-6 animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="h-16 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="grid grid-cols-4 gap-3">
          <div v-for="i in 4" :key="i" class="h-16 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Weather Content -->
    <div v-if="weather && !loading" class="max-w-2xl mx-auto space-y-4">

      <!-- Main card -->
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ weather.name }}</h1>
            <p class="text-gray-400 text-sm">{{ weather.sys.country }} · {{ todayLabel }}</p>
            <div class="mt-4">
              <span class="text-6xl font-light text-gray-800">{{ Math.round(weather.main.temp) }}°</span>
              <p class="text-gray-500 text-sm mt-1">
                His: {{ Math.round(weather.main.feels_like) }}°
              </p>
              <p class="text-gray-500 text-sm">
                Max {{ Math.round(weather.main.temp_max) }}° / Min {{ Math.round(weather.main.temp_min) }}°
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-7xl"><img class="w-12" :src="getIcon(weather.weather[0].id, weather, weather.dt)" alt=""></div>
            <p class="text-gray-600 text-sm mt-1 capitalize">{{ getDesc(weather.weather[0].description) }}</p>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-100 pt-4">
          <div class="grid grid-cols-4 gap-3">
            <div
                v-for="metric in metrics"
                :key="metric.label"
                class="bg-gray-50 rounded-xl p-3"
            >
              <p class="text-xs text-gray-400 mb-1">{{ metric.label }}</p>
              <p class="text-base font-semibold text-gray-700">{{ metric.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Hourly forecast -->
      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-xs text-gray-400 uppercase tracking-widest mb-3">Soatlik prognoz</p>
        <div class="flex gap-3 overflow-x-auto pb-1">
          <div
              v-for="item in hourlyList"
              :key="item.dt"
              class="flex-shrink-0 bg-gray-50 rounded-xl px-4 py-3 text-center min-w-[64px]"
          >
            <p class="text-xs text-gray-400 mb-1">{{ formatHour(item.dt) }}</p>
            <div class="text-2xl mb-1"><img alt="" class="w-12" :src="getIcon(item.weather[0].id, weather, item.dt)"></div>
            <p class="text-sm font-semibold text-gray-700">{{ Math.round(item.main.temp) }}°</p>
          </div>
        </div>
      </div>

      <!-- 5-day forecast -->
      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-xs text-gray-400 uppercase tracking-widest mb-3">5 kunlik prognoz</p>
        <div class="space-y-2">
          <div
              v-for="day in dailyList"
              :key="day.date"
              class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <p class="text-sm font-semibold text-gray-700 w-12">{{ day.label }}</p>
            <div class="text-2xl"><img class="w-12" :src="getIcon(day.iconId, weather, weather.dt)" alt=""></div>
            <p class="text-xs text-gray-400 flex-1 ml-3 capitalize">{{ day.desc }}</p>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-400">{{ day.min }}°</span>
              <!-- temp range bar -->
              <div class="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    class="h-full rounded-full bg-blue-400"
                    :style="{ width: getTempBarWidth(day.min, day.max) + '%' }"
                ></div>
              </div>
              <span class="text-sm font-semibold text-gray-700">{{ day.max }}°</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sun & Extra info -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <p class="text-xs text-gray-400 uppercase tracking-widest mb-3">Quyosh</p>
          <div class="flex justify-between">
            <div>
              <p class="text-xs text-gray-400">Chiqishi</p>
              <p class="text-lg font-semibold text-amber-500">{{ formatUnixTime(weather.sys.sunrise) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">Botishi</p>
              <p class="text-lg font-semibold text-orange-400">{{ formatUnixTime(weather.sys.sunset) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-5">
          <p class="text-xs text-gray-400 uppercase tracking-widest mb-3">Qo'shimcha</p>
          <div class="space-y-1">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Bulutlilik</span>
              <span class="font-semibold text-gray-700">{{ weather.clouds.all }}%</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Shamol yo'nalishi</span>
              <span class="font-semibold text-gray-700">{{ getWindDir(weather.wind.deg) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Ko'rinish</span>
              <span class="font-semibold text-gray-700">{{ (weather.visibility / 1000).toFixed(1) }} km</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import axios from 'axios'
import sun from '../assets/sun.png'
import moon from '../assets/moon.png'
import moonCloud from '../assets/moonCloud.png'
import cloud from '../assets/cloud.png'
import cloudyDay from '../assets/cloudDay.png'
import heavyRain from '../assets/heavy-rain.png'
import rainCloud from '../assets/rain-cloud.png'
import snowflake from '../assets/snowflake.png'
import sunCloud from '../assets/sun-cloud.png'
import sunRain from '../assets/sun-rain.png'

// ─── Types ────────────────────────────────────────────────────────────────────
interface WeatherData {
  name: string
  sys: { country: string; sunrise: number; sunset: number }
  main: {
    temp: number; feels_like: number
    temp_min: number; temp_max: number
    humidity: number; pressure: number
  }
  weather: { id: number; description: string }[]
  wind: { speed: number; deg: number }
  clouds: { all: number }
  visibility: number
  timezone: number
  dt: number
}

interface ForecastItem {
  dt: number
  main: { temp: number; temp_min: number; temp_max: number }
  weather: { id: number; description: string }[]
}

// ─── State ────────────────────────────────────────────────────────────────────
const API_KEY = 'b4997688770ac179b7e970df336b0d20' // openweathermap.org dan oling (bepul)
const BASE    = 'https://api.openweathermap.org/data/2.5'

const cityInput  = ref('Tashkent')
const weather    = ref<WeatherData | null>(null)
const forecast   = ref<ForecastItem[]>([])
const loading    = ref(false)
const error      = ref('')

// ─── Computed ─────────────────────────────────────────────────────────────────
const DAYS = ['Yak', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Sha']
const MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr']

const todayLabel = computed(() => {
  const d = new Date()
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
})

const metrics = computed(() => {
  if (!weather.value) return []
  const w = weather.value
  return [
    { label: 'Namlik',  value: w.main.humidity + '%' },
    { label: 'Shamol',  value: Math.round(w.wind.speed) + ' m/s' },
    { label: 'Bosim',   value: Math.round(w.main.pressure * 0.750064) + ' mm' },
    { label: 'Bulutlilik', value: w.clouds.all + '%' },
  ]
})

// Soatlik — keyingi 8 ta (24 soat)
const hourlyList = computed(() => {
  if (!forecast.value.length) return []

  const now = Date.now() / 1000

  return forecast.value
      .filter(item => item.dt >= now) // faqat kelajak
      .slice(0, 8) // 8 ta = 24 soat (3 soat * 8)
})

// Kunlik — har kundan 1 ta
const dailyList = computed(() => {
  const map: Record<string, ForecastItem[]> = {}

  forecast.value.forEach(item => {
    const key = new Date(item.dt * 1000).toDateString()
    if (!map[key]) map[key] = []
    map[key].push(item)
  })

  return Object.entries(map).slice(0, 5).map(([key, items]) => {
    const d = new Date(key)
    const mid = items[Math.floor(items.length / 2)]

    return {
      date: key,
      label: DAYS[d.getDay()],
      iconId: mid.weather[0].id,
      desc: mid.weather[0].description,
      max: Math.round(Math.max(...items.map(i => i.main.temp_max))),
      min: Math.round(Math.min(...items.map(i => i.main.temp_min))),
      dt: mid.dt // ⭐ MUHIM
    }
  })
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
// function getIcon(id: number): string {
//   if (id >= 200 && id < 300) return '⛈️'
//   if (id >= 300 && id < 400) return '🌦️'
//   if (id >= 500 && id < 600) return id >= 502 ? '⛈️' : '🌧️'
//   if (id >= 600 && id < 700) return '❄️'
//   if (id >= 700 && id < 800) return '🌫️'
//   if (id === 800) return '☀️'
//   if (id === 801) return '🌤️'
//   if (id === 802) return '⛅'
//   return '☁️'
// }
function isDayTime(weather: WeatherData, dt?: number) {
  const current = dt ?? weather.dt
  return current >= weather.sys.sunrise && current < weather.sys.sunset
}

function getIcon(id: number, weather: WeatherData, dt: number): string {
  const isDay = isDayTime(weather, dt)

  if (id >= 200 && id < 300) return rainCloud
  if (id >= 300 && id < 400) return sunRain
  if (id >= 500 && id < 600) return isDay ? sunRain : rainCloud
  if (id >= 600 && id < 700) return snowflake
  if (id >= 700 && id < 800) return cloudyDay

  if (id === 800) return sun

  if (id === 801 || id === 802)
    return isDay ? sunCloud : moonCloud

  if (id === 803 || id === 804)
    return cloud

  return cloud
}
function getDesc(desc: string): string {
  const d = desc.toLowerCase()

  if (d.includes('clear'))  return 'Ochiq osmon'
  if (d.includes('cloud'))   return 'Qisman bulutli'
  if (d.includes('cloud'))   return 'Bulutli'
  if (d.includes('mist') && d.includes('fog'))  return 'Tumanli'
  if (d.includes('rain') && d.includes('cloud'))  return "Yomg'irli"
  if (d.includes('snow'))  return 'Qorli'
  if (d.includes('rain'))  return "Yomg'ir"
  if (d.includes('thunder'))  return 'Momaqaldiroq'
  return "Noma'lum"
}
// function getIcon(code: number, isDay = true): string {
//   if (code === 0)  {
//     return isDay ? sun : moon
//   }
//   if (code >= 1 && code <= 2) {
//     return isDay ? sunCloud : moonCloud
//   }
//   if (code === 3) {
//     return cloud
//   }
//   if (code >= 45 && code <= 48) {
//     return cloudyDay
//   }
//   if (code >= 51 && code <= 67) {
//     return isDay ? sunRain : heavyRain
//   }
//   if (code >= 71 && code <= 77) {
//     return snowflake
//   }
//   if (code >= 80 && code <= 82) {
//     return isDay ? sunRain : rainCloud
//   }
//   if (code >= 95 && code <= 99) {
//     return rainCloud
//   }
//   return '🌡️'
// }

function formatHour(unix: number): string {
  const d = new Date(unix * 1000)
  return d.getHours().toString().padStart(2, '0') + ':00'
}

function formatUnixTime(unix: number): string {
  const d = new Date(unix * 1000)
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0')
}

function getWindDir(deg: number): string {
  const dirs = ['Sh', 'SH-G', 'G', 'J-G', 'J', 'J-Sh', 'Sh', 'Sh-G']
  return dirs[Math.round(deg / 45) % 8]
}

function getTempBarWidth(min: number, max: number): number {
  // umumiy diapazon -20 dan +45 gacha
  const range = 65
  return Math.min(100, Math.max(10, ((max - min) / range) * 100 + 20))
}

// ─── API ─────────────────────────────────────────────────────────────────────
async function fetchWeather() {
  if (!cityInput.value.trim()) return
  loading.value = true
  error.value   = ''
  weather.value = null

  try {
    const [curRes, fcRes] = await Promise.all([
      axios.get(`${BASE}/weather`, {
        params: { q: cityInput.value, units: 'metric', lang: 'uz', appid: API_KEY }
      }),
      axios.get(`${BASE}/forecast`, {
        params: { q: cityInput.value, units: 'metric', lang: 'uz', appid: API_KEY }
      }),
    ])
    weather.value  = curRes.data
    forecast.value = fcRes.data.list
  } catch (e: any) {
    error.value = e.response?.status === 404
        ? 'Shahar topilmadi. Qayta tekshiring.'
        : 'Xatolik yuz berdi. Internetni tekshiring.'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchWeather())
</script>