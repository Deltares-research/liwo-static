<template>
  <aside class="notification-bar"
    :class="{[`notification-bar--${type}`]:true}">
    <div class="container">
      <img class="notification-bar__icon" :src="`/icons/baseline-${type}-24px.svg`" />
      <span class="notification-bar__message">{{ message }}</span>
    </div>
  </aside>
</template>

<style>
.notification-bar .container{
  padding: 1rem 1rem;
  width: calc(100% - 2rem);
  max-width: 1200px;
  margin: auto;
}

.notification-bar--error {
  background-color: #f9dfdd;
}

.notification-bar--warning {
  background-color: #fff4dc;
}

.notification-bar--info {
  background-color: #d9ebf7;
}

.notification-bar--confirm {
  background-color: #e1eddb;
}

.notification-bar__message {
  padding-left: 0.5rem;
}
</style>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'info',
      validator (value) {
        return ['error', 'warning', 'info', 'confirm'].indexOf(value) !== -1
      }
    },
    message: {
      type: String,
      required: true,
      validator (value) {
        return typeof value === 'string'
      }
    }
  }
}
</script>
