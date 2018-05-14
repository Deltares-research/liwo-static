<template>
  <div :class="`layer-control${(active) ? ' layer-control--active' : ''}`">
    <div class="layer-control__main">
    <input type="checkbox"
      class="sr-only layer-control__vis-checkbox"
      :name="`layer-${id}-vis`"
      :id="`layer-${id}-vis`"
      value="zichtbaar"
      checked
    >
    <label
        class="layer-control__vis-label"
        :for="`layer-${id}-vis`"
      >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64">
        <path fill="none" d="M0 0h64v64H0z"/>
        <path d="M59 28c-3-5-12-16-27-16S8 23 5 28v6c3 5 12 16 27 16s24-11 27-16v-6zm-27-7a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 24c-15 0-22-14-22-14s3-6 10-10l-2 4a14 14 0 1 0 28 3c0-5-4-8-9-10 12 2 17 13 17 13s-7 14-22 14z"/>
      </svg>
      <span class="sr-only">Zichtbaarheid</span>
      </label>
      <div class="layer-control__identifiers">
        <p class="layer-control__title">
          {{ title }}
        </p>
        <p class="layer-control__subtitle">
          {{ subtitle }}
        </p>
      </div>
    </div>
    <div class="layer-control__options">
      <select :name="`layer-${id}-trans`">
        <option
          v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]"
          :key="`layer-${id}-trans-${i}`"
          :value="1 - (i / 10)"
        >
          {{ i * 10 }}% transparantie
        </option>
      </select>
      <button class="layer-control__info" @click="metaIsOpen=true">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
          <path fill="none" d="M0 0h64v64H0z"/>
          <path d="M53.9 14.1c-.4-2-2-3.6-4-4-6-1-16-1-17.9-1-2 0-12 0-17.9 1-2 .4-3.6 2-4 4-1 6-1 16-1 17.9s0 12 1 17.9c.4 2 2 3.6 4 4 6 1 16 1 17.9 1 2 0 12 0 17.9-1 2-.4 3.6-2 4-4 1-6 1-16 1-17.9 0-6 0-12-1-17.9zM35 48h-6.6l.6-14v-8h6v22zm-3-26c-2.2 0-3.5-1.3-3.5-3.5 0-2 1.2-3.5 3.5-3.5 2.2 0 3.5 1.2 3.5 3.5 0 2-1.2 3.5-3.5 3.5z"/>
        </svg>
      </button>
      <layer-meta v-if="metaIsOpen"
        :metadata="metadata" @close="metaIsOpen=false" />
    </div>
  </div>
</template>

<script>
import LayerMeta from '@/components/LayerMeta'

export default {
  data () {
    return { metaIsOpen: false }
  },
  props: {
    id: [String, Number],
    title: String,
    subtitle: String,
    metadata: Object,
    active: Boolean
  },
  watch: {
    // Always close meta when switching layers
    active (isActive) {
      if (!isActive) {
        this.metaIsOpen = false
      }
    }
  },
  components: {
    LayerMeta
  }
}
</script>

<style>
@import './variables.css';

.layer-control {
  background-color: var(--white);
  border-bottom: 2px solid var(--light-gray);
}

.layer-control__identifiers {
  display: inline-block;
}

.layer-control__title,
.layer-control__subtitle {
  margin: 0;
  padding: 0;
}

.layer-control__subtitle {
  color: var(--medium-gray);
  font-size: 0.7em;
  line-height: 0.9em;
}

.layer-control__main,
.layer-control__options {
  position: relative;
  display: block;
  padding: .5rem .5rem .25rem 2.5rem;
  min-height: 3rem;
}
.layer-control__vis-label>.icon {
  position: absolute;
  left: .5rem;
}
.layer-control__options {
  display: none;
  border-top: 1px solid var(--white);
  padding-top: .25rem;
  justify-content: space-between;
}
.layer-control__info {
  padding: 0;
  margin: 0;
  border: none;
  background: none;
}
.layer-control__vis-checkbox + .layer-control__vis-label {
  opacity: .5;
}
.layer-control__vis-checkbox:checked + .layer-control__vis-label {
  opacity: 1;
}

.layer-control--active {
  background-color: var(--light-yellow);
}
.layer-control--active .layer-control__options {
  display: block;
  display: flex;
}
</style>
