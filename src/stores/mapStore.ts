import { useLocalStorage } from '@vueuse/core'
import { type Marker } from '@/types/marker'

export const mainzLocation = useLocalStorage<Marker>('MAINZ_LOCATION', {
  latitude: 49.97952370204843,
  longitude: 8.27608561259084,
})

export const nearbyMarkers = useLocalStorage<Marker[]>('NEARBY_MARKERS', [])
