<template>
  <form class="baselayer-control" @submit.prevent>
    <svg class="baselayer-control__image" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <path fill="none" d="M0 0h64v64H0z"/>
      <path d="M26 7l-3 14V6L4 15l-1 1v40l1 1 19-9 17 9h2l18-9 1-1V7l-1-1-19 9-15-8z"/>
    </svg>
    <select class="baselayer-control__select" @change="selectBaseLayer">
      <option
        v-for="layer in tileLayers"
        :key="layer.url"
        :value="layer.url"
      >
        {{ layer.title }}
      </option>
    </select>
  </form>
</template>

<script>
export default {
  props: [ 'tileLayers' ],
  methods: {
    selectBaseLayer (event) {
      this.$emit('baselayer', event.target.value)
    }
  }
}
</script>

<style>
.baselayer-control {
  position: absolute;
  z-index: 9999;
  right: 4rem;
  top: 1rem;
  background-color: #fff;
  padding: 0 .5rem;
}

.baselayer-control__image {
  vertical-align: middle;
  margin-right: .5rem;
}

.baselayer-control__select,
.baselayer-control__select:active,
.baselayer-control__select:focus {
  border: 0;
  background: transparent;
  outline: 0;
  box-shadow: none;
}
</style>
