<template>
  <div class="viewer">
    <h1>Dit is de over Viewer pagina</h1>
    <liwo-map />
  </div>
</template>

<script>
import LiwoMap from '../components/Map.vue'

const url = 'https://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png'

export default {
  components: {
    LiwoMap
  }
}
</script>
<style>

</style>å
