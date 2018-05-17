<template>
  <nav class="segmented-buttons">
    <ul>
      <li
        v-for="item in items"
        :key="item"
      >
        <button class="segmented-button">
          {{ item }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    items: Array
  }
}
</script>

<style>
@import './variables.css';

.segmented-links {
  margin: 0 auto;
  text-align: center;
  display: block;
}
.segmented-links ul {
  display: inline-block;
  display: inline-flex;
  height: 100%;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  padding: 0;
  margin: 0;
}
.segmented-links li {
  border-left: solid 1px var(--grey);
  display: inline-block;
  margin: 0;
}

.segmented-links li:first-child {
  border-left: none;
}
.segmented-button {
  appearance: none;
  display: inline;
  padding: .7em 1.1em;
  background: var(--white);
  height: 100%;
  margin: 0;
  position: relative;
}
.segmented-button:hover,
.segmented-button.segmented-button--active {
  background: var(--off-white);
}

.segmented-button.segmented-button--active::before {
  content: "";
  display: block;
  position: absolute;
  left: 50%;
  top: -16px;
  margin: 0 0 0 -8px;
  border: solid 8px transparent;
  border-bottom: solid 8px var(--off-white);
}
</style>
