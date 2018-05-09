<template>
  <div class="pop-up">
    <header class="pop-up__header">
      <h1 class="pop-up__title">
        {{title}}
      </h1>
      <button @click="close" class="pop-up__close">
        <span class="sr-only">Sluiten</span>
        Sluiten
      </button>
    </header>
    <slot>
      Placeholder content
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      Type: String
    }
  },
  methods: {
    close () {
      console.log('close')
    }
  }
}
</script>

<style>
@import './variables.css';

.pop-up {
  position: absolute;
  width: 320px;
}
.pop-up__header {
  line-height: 44px;
  padding: 4px;
  background-color: var(--yellow);
  font-size: 1.2rem;
  color: var(--black);
  display: flex;
  justify-content: space-between;
}
.pop-up__title {
  color: inherit;
  margin-bottom: 0;
}
.pop-up__close {
  display: inline-block;
  border: none;
  background: none;
}
</style>
