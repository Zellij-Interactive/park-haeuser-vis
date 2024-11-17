import { useLocalStorage } from '@vueuse/core'

type Marker = {
  latitude: number
  longitude: number
}

export const mainzLocation = useLocalStorage<Marker>('MAINZ_LOCATION', {
  latitude: 49.97952370204843,
  longitude: 8.27608561259084,
})

export const nearbyMarkers = useLocalStorage<Marker[]>('NEARBY_MARKERS', [])
