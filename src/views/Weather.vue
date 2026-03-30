<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">

    <!-- Search -->
    <div class="max-w-2xl mx-auto mb-6">
      <div class="flex gap-2">
        <input
            v-model="cityInput"
            @keydown.enter="fetchWeather"
            type="search"
            placeholder="Shahar nomini kiriting..."
            class="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        />
        <button
            @click="fetchWeather"
            :disabled="loading"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                 text-white rounded-xl font-semibold transition"
        >
          {{ loading ? '...' : 'Qidirish' }}
        </button>
      </div>
      <p v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</p>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="max-w-2xl mx-auto space-y-4 animate-pulse">
      <div class="bg-white rounded-2xl p-6">
        <div class="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="h-16 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="grid grid-cols-4 gap-3">
          <div v-for="i in 4" :key="i" class="h-16 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="current && !loading" class="max-w-2xl mx-auto space-y-4">

      <!-- Main card -->
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <div class="flex items-start justify-between mb-5">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ location.name }}</h1>
            <p class="text-gray-400 text-sm">{{ location.country }} · {{ todayLabel }}</p>
            <div class="mt-4">
              <span class="text-6xl font-light text-gray-800">
                {{ Math.round(current.temperature_2m) }}°C
              </span>
              <p class="text-gray-500 text-sm mt-1">
                His: {{ Math.round(current.apparent_temperature) }}°C
              </p>
            </div>
          </div>
          <div class="text-center">
            <div class="text-7xl"><img alt="" class="w-12" :src="getIcon(current.weather_code, current.is_day)"></div>
            <p class="text-gray-500 text-sm mt-1">{{ getDesc(current.weather_code) }}</p>
          </div>
        </div>

        <!-- Metrics -->
        <div class="border-t border-gray-100 pt-4 grid grid-cols-4 gap-3">
          <div v-for="m in metrics" :key="m.label" class="bg-gray-50 rounded-xl p-3">
            <p class="text-xs text-gray-400 mb-1">{{ m.label }}</p>
            <p class="text-sm font-semibold text-gray-700">{{ m.value }}</p>
          </div>
        </div>
      </div>

      <!-- Hourly -->
      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-xs text-gray-400 uppercase tracking-widest mb-3">Soatlik prognoz</p>
        <div class="flex gap-3 overflow-x-auto pb-1">
          <div
              v-for="(item, i) in filteredHourly"
              :key="i"
              class="flex-shrink-0 bg-gray-50 rounded-xl px-4 py-3 text-center min-w-[64px]"
          >
            <p class="text-xs text-gray-400 mb-1">{{ item.time }}</p>
            <div class="text-xl mb-1"><img alt="" class="w-12" :src="getIcon(item.code, true)"></div>
            <p class="text-sm font-semibold text-gray-700">{{ Math.round(item.temp) }}°</p>
          </div>
        </div>
      </div>

      <!-- Daily -->
      <div class="bg-white rounded-2xl shadow-sm py-5">
        <p class="text-xs text-gray-400 uppercase tracking-widest px-5 mb-3">5 kunlik prognoz</p>
        <div class="space-y-3 px-2">
          <div
              v-for="(day, i) in dailyList"
              :key="i"
              @click="selectDay(day)"
              :class="[day.isYesterday ? 'text-gray-400' : 'text-gray-700',
                  selectedDay === day.date ? 'bg-blue-200' : ''
              ]"
              class="flex items-center hover:bg-blue-100 px-3 rounded-xl cursor-pointer gap-3 py-1 border-b border-gray-50 last:border-0"
          >
            <p class="text-sm font-semibold w-16">{{ day.label }} {{ day.days }}</p>
            <div class="text-2xl"><img class="w-12" :src="getIcon(day.code, true)" alt=""></div>
            <div class="flex-1 flex items-center gap-2">
              <span class="text-xs text-gray-400 w-8 text-right">{{ day.min }}°</span>
              <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div :class="day.isYesterday ? 'bg-gray-400' : 'bg-blue-400'" class="h-full rounded-full" :style="{ width: barWidth(day) + '%' }"/>
              </div>
              <span class="text-sm font-semibold w-8">{{ day.max }}°</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sun + UV -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <p class="text-xs text-gray-400 uppercase tracking-widest mb-3">Quyosh</p>
          <div class="flex justify-between items-center">
            <div class="text-center">
              <p class="text-2xl mb-1">🌅</p>
              <p class="text-xs text-gray-400">Chiqishi</p>
              <p class="text-base font-semibold text-amber-500">{{ daily.sunrise?.[0]?.slice(11, 16) }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl mb-1">🌇</p>
              <p class="text-xs text-gray-400">Botishi</p>
              <p class="text-base font-semibold text-orange-400">{{ daily.sunset?.[0]?.slice(11, 16) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-5">
          <p class="text-xs text-gray-400 uppercase tracking-widest mb-3">UV indeksi</p>
          <p class="text-3xl font-semibold text-gray-800">{{ daily.uv_index_max?.[0]?.toFixed(1) }}</p>
          <p class="text-sm mt-1" :class="uvColor">{{ uvLabel }}</p>
          <div class="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div
                class="h-full rounded-full transition-all"
                :class="uvBg"
                :style="{ width: Math.min(100, (daily.uv_index_max?.[0] / 11) * 100) + '%' }"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

// ─── State ────────────────────────────────────────────────────────────────────
const cityInput = ref('Tashkent')
const loading   = ref(false)
const error     = ref('')

const location  = ref({ name: '', country: '' })
const current   = ref<any>(null)
const hourly    = ref<any>({})
const daily     = ref<any>({})

const selectedDay = ref<string | null>(null)

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS   = ['Yak','Du','Se','Ch','Pa','Ju','Sh','Sha']
const MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun',
  'Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr']

// ─── API ─────────────────────────────────────────────────────────────────────
const fetchWeather = async () => {
  if (!cityInput.value.trim()) return
  loading.value = true
  error.value   = ''
  current.value = null

  try {
    // 1. Koordinata
    const geoRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: cityInput.value, count: 1, language: 'uz' }
    })
    if (!geoRes.data.results?.length) return new Error('Shahar topilmadi')

    const geo = geoRes.data.results[0]
    location.value = { name: geo.name, country: geo.country }

    // 2. Ob-havo
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude:  geo.latitude,
        longitude: geo.longitude,
        current: [
          'temperature_2m','apparent_temperature','relative_humidity_2m',
          'wind_speed_10m','wind_direction_10m','weather_code',
          'cloud_cover','surface_pressure','visibility','is_day'
        ].join(','),
        hourly:  ['temperature_2m','weather_code'].join(','),
        daily:   ['temperature_2m_max','temperature_2m_min','weather_code',
          'sunrise','sunset','uv_index_max'].join(','),
        timezone: 'auto',
        forecast_days: 7,
      }
    })

    current.value = data.current
    hourly.value  = data.hourly
    daily.value   = data.daily

  } catch (e: any) {
    error.value = e.message || 'Xatolik yuz berdi'
  } finally {
    loading.value = false
  }
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const todayLabel = computed(() => {
  const d = new Date()
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
})

const metrics = computed(() => {
  if (!current.value) return []
  const c = current.value
  return [
    { label: 'Namlik',    value: c.relative_humidity_2m + '%' },
    { label: 'Shamol',    value: Math.round(c.wind_speed_10m) + ' km/h' },
    { label: 'Bosim',     value: Math.round(c.surface_pressure) + ' hPa' },
    { label: 'Bulutlilik',value: c.cloud_cover + '%' },
  ]
})

const filteredHourly = computed(() => {
  if (!selectedDay.value || !hourly.value.time) return []

  return hourly.value.time
      .map((t: string, i: number) => ({
        time: t,
        temp: hourly.value.temperature_2m[i],
        code: hourly.value.weather_code[i],
      }))
      .filter((item: any) => item.time.startsWith(selectedDay.value))
})

const hourlyList = computed(() => {
  if (!hourly.value.time) return []

  const now = new Date()

  return hourly.value.time
      .map((t: string, i: number) => {
        const date = new Date(t)

        return {
          time: t.slice(11, 16),
          temp: hourly.value.temperature_2m[i],
          code: hourly.value.weather_code[i],
          date
        }
      })
      .filter((item: any) => {
        const h = (item.date.getTime() - now.getTime()) / (1000 * 60 * 60)
        return h >= 0 && h <= 24
      })
})

const selectDay = (day: any) => {
  selectedDay.value = day.date
}


const dailyList = computed(() => {
  if (!daily.value.time) return []

  const todayData = daily.value.time.map((t: string, i: number) => ({
    label: DAYS[new Date(t).getDay()],
    max: Math.round(daily.value.temperature_2m_max[i]),
    min: Math.round(daily.value.temperature_2m_min[i]),
    code: daily.value.weather_code[i],
    days: new Date(t).getDate(),
    date: t,
    isYesterday: false
  }))

  // Kechagi kun
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const yesterdayItem = {
    label: DAYS[yesterday.getDay()],
    max: todayData[0]?.max, // fallback sifatida bugungi qiymatni ishlatyapmiz
    min: todayData[0]?.min,
    code: todayData[0]?.code,
    days: yesterday.getDate(),
    isYesterday: true
  }

  return [yesterdayItem, ...todayData]
})

const uvVal   = computed(() => daily.value.uv_index_max?.[0] ?? 0)
const uvLabel = computed(() => {
  const v = uvVal.value
  if (v <= 2) return 'Past'
  if (v <= 5) return "O'rtacha"
  if (v <= 7) return 'Yuqori'
  if (v <= 10) return 'Juda yuqori'
  return 'Ekstremal'
})
const uvColor = computed(() => {
  const v = uvVal.value
  if (v <= 2) return 'text-green-500'
  if (v <= 5) return 'text-yellow-500'
  if (v <= 7) return 'text-orange-500'
  return 'text-red-500'
})
const uvBg = computed(() => {
  const v = uvVal.value
  if (v <= 2) return 'bg-green-400'
  if (v <= 5) return 'bg-yellow-400'
  if (v <= 7) return 'bg-orange-400'
  return 'bg-red-400'
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getIcon(code: number, isDay = true): string {
  if (code === 0)  {
    return isDay ? sun : moon
  }
  if (code === 1)  {
    return isDay ? sunCloud : moonCloud
  }
  if (code === 2) {
    return moonCloud
  }
  if (code <= 3) {
    return cloud
  }
  if (code <= 4) {
    return sunCloud
  }
  if (code <= 49) {
    return cloudyDay
  }
  if (code <= 69) {
    return heavyRain
  }
  if (code <= 79) {
    return snowflake
  }
  if (code <= 82) {
    return sunRain
  }
  if (code <= 99) {
    return rainCloud
  }
  return sunCloud
}
// function getIcon(code: number, isDay = true): string {
//   if (code === 0)              return isDay ? '☀️' : '🌙'
//   if (code <= 2)               return isDay ? '🌤️' : '🌙'
//   if (code <= 3)               return '☁️'
//   if (code <= 49)              return '🌫️'
//   if (code <= 69)              return '🌧️'
//   if (code <= 79)              return '❄️'
//   if (code <= 82)              return '🌦️'
//   if (code <= 99)              return '⛈️'
//   return '🌡️'
// }

function getDesc(code: number): string {
  if (code === 0)  return 'Ochiq osmon'
  if (code <= 2)   return 'Qisman bulutli'
  if (code === 3)   return 'Bulut'
  if (code <= 3)   return 'Bulutli'
  if (code <= 49)  return 'Tumanli'
  if (code <= 69)  return 'Yomg\'irli'
  if (code <= 79)  return 'Qorli'
  if (code <= 82)  return 'Yomg\'ir'
  if (code <= 99)  return 'Momaqaldiroq'
  return 'Noma\'lum'
}

function barWidth(day: { min: number; max: number }): number {
  return Math.min(100, Math.max(15, ((day.max - day.min) / 40) * 100 + 20))
}

onMounted(() => fetchWeather())
</script>