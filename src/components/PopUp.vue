<template>
  <div class="pop-up">
    <header class="pop-up__header">
      <h1 class="pop-up__title">
        {{title}}
      </h1>
      <button @click="$emit('close')" class="pop-up__close">
        <span class="sr-only">Sluiten</span>
        Sluiten
      </button>
    </header>
    <section class="pop-up__content">
      <slot>
        Placeholder content
      </slot>
    </section>
   </div>
</template>

<script>
export default {
  props: {
    title: {
      Type: String
    }
  }
}
</script>

<style>
@import './variables.css';

.pop-up {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index:10000;
  display: flex;
  flex-direction: column;
}
.pop-up__content {
  overflow-y: auto;
  flex: 0 1 100%;
}
@media screen and (min-width: 640px) {
  .pop-up {
    top: 5vh;
    left: calc(320px + 1rem);
    min-width: 320px;
    width: calc(50vw - 1rem);
    height: 80vh;
  }
  .pop-up__content {
  overflow-y: auto;
}
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
