<template>
  <div class="map-wrap">
    <div ref="mapEl" class="map"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for broken marker assets
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const mapEl = ref(null)

onMounted(() => {
  if (!mapEl.value) return
  const map = L.map(mapEl.value, { scrollWheelZoom: false }).setView([56.9496, 24.1052], 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
  const start = [56.9496, 24.1052], mid = [56.8, 23.5], end = [56.6, 24.0]
  L.polyline([start, mid, end], { color: '#2b6cb0' }).addTo(map)
  L.marker(start).addTo(map).bindPopup('Start').openPopup()
  L.marker(end).addTo(map).bindPopup('End')
})
</script>

<style scoped>
.map-wrap { margin-top:16px; display:flex; justify-content:center; } .map { width:100%; max-width:980px; height:300px; border-radius:8px; box-shadow:0 6px 18px rgba(20,30,50,0.06); }
</style>