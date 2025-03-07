<template>
<div class="layer-panel" data-tour-id="layer-panel">
  <div class="layer-panel__content">
    <h3 class="layer-panel__title">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 64 64">
        <path fill="none" d="M0 0h64v64H0z"/>
        <path d="M55 33L32 49 9 33l-4 2v2l26 19a2 2 0 0 0 2 0l26-19v-2l-4-2z"/>
        <path d="M31 45a2 2 0 0 0 2 0l26-19v-2L33 5a2 2 0 0 0-2 0L5 24v2l26 19z"/>
      </svg>
      <span>Kaartlagen</span>
      <span class="right">
        <slot name="title"></slot>
      </span>
    </h3>

    <div class="layer-panel__body">
      <slot></slot>
    </div>

    <footer class="layer-panel__actions">
      <slot name="actions"></slot>
    </footer>
  </div>
</div>
</template>

<script>
// This panel provides allows  to put  paneLitems in the obdy
export default {
}
</script>

<style>
  @import './variables.css';

  .layer-panel {
    width: 320px;
    height: 100%;
    background-color: var(--white);
    max-height: calc(100vh - 23rem);
    overflow: auto;
  }

  .layer-panel__title .right {
    margin-left: auto;
  }

  .layer-panel__content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .layer-panel__body {
    flex: 1;
    overflow-y: scroll;
  }

  .layer-panel__actions {
    box-shadow: 0 -1px 3px rgba(0,0,0,0.3);
    z-index: 1;
  }

  .layer-panel__title,
  .layer-panel__action {
    display: flex;
    align-items: center;
    background-color: var(--yellow);
    font-size: 1.2em;
    padding: 10px;
    color: var(--black);
    margin-bottom: 0;
  }

  .layer-panel__title > .icon {
    margin-right: 5px;
  }

  .layer-panel__action {
    width: 100%;
    background-color: var(--white);
    text-align: left;
    font-weight: bold;
    border: none;
    box-shadow: var(--shadow);
  }

  .layer-panel__back-button {
    float: right;
  }
</style>
