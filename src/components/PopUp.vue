<template>
    <transition name="popup-fade">
      <div class="pop-up" :class="{'popup--disable-scrollbar': disableScrollbar}" @keydown.esc="$emit('close')">
        <div class="pop-up__backdrop" @click="$emit('close')"></div>
        <div class="pop-up__modal" ref="popUp">
          <header class="pop-up__header">
            <h1 class="pop-up__title">
              <slot name="icon"><!-- Icon to inject before title --></slot>
              {{title}}
            </h1>
            <button
              type="button"
              @click="$emit('close')"
              class="pop-up__close icon-close-big panel-close"
              v-test="'close-button'"
            >
              <span class="sr-only">Sluiten</span>
            </button>
          </header>
          <section class="pop-up__content">
            <slot><!-- Placeholder content --></slot>
          </section>
        </div>
      </div>
  </transition>
</template>

<script>
import * as focusTrap from 'focus-trap'

export default {
  props: {
    title: {
      type: String
    },
    disableScrollbar: {
      type: Boolean
    }
  },
  data () {
    return {
      focusElBeforeOpen: null,
      trap: null
    }
  },
  mounted () {
    this.focusElBeforeOpen = document.activeElement
    this.trap = focusTrap.createFocusTrap(this.$refs.popUp)
    this.trap.activate()
  },
  beforeDestroy () {
    if (this.focusElBeforeOpen) {
      this.focusElBeforeOpen.focus()
    }

    this.trap.deactivate()
  }
}
</script>

<style>
  @import './variables.css';

  .pop-up {
    position: fixed;
    top: 0;
    left: 0;
    padding: 40px 20px 20px 20px;
    width: 100vw;
    height: 100vh;
    z-index: 10000;
    display: flex;
    flex-direction: column;
  }

  .pop-up__backdrop {
    opacity: .5;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000;
    z-index: 1;
    cursor: pointer;
  }
  .pop-up__modal {
    z-index: 2;
    width: 100%;
    max-width: 620px;
    margin: 0 auto;
    border-radius: 4px;
    border: 2px solid rgba(0,0,0,0.2);
    max-height: calc(100vh - 14rem);
    display: flex;
    flex-direction: column;
  }

  @media only screen and (min-width: 651px) {
    .popup--disable-scrollbar .pop-up__content {
      overflow: visible;
    }
  }

  .pop-up__content {
    overflow-y: auto;
    flex: 0 1 100%;
    background-color: var(--white);
  }
  .pop-up__header {
    line-height: 44px;
    padding: 8px 16px;
    background-color: var(--yellow);
    font-size: 1.2rem;
    color: var(--black);
    display: flex;
    flex: 0 0 44px;
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
  .popup-fade-enter-active, .popup-fade-leave-active {
    transition: opacity .5s;
  }
  .popup-fade-enter, .popup-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
