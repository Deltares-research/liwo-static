<template>
  <div class="not-found site-main">
    <p>
      De pagina die u opvroeg is niet gevonden.
      Ga terug naar de <router-link :to="{ name: 'maps' }">hoofdpagina</router-link>.
    </p>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style>
.not-found {
  padding: 1rem;
}
</style>
