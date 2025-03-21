<template>
<ul
  class="viewer__notifications"
  v-if="cleanNotifications && cleanNotifications.length"
  data-tour-id="notifications"
>
  <template v-for="(notification, index) in cleanNotifications">
    <li
      v-if="notification.show"
      :key="index"
      class="viewer__notification"
    >
      <aside
        class="notification-bar"
        :class="{ [`notification-bar--${notification.type}`] : true }"
        v-test="'notification'"
      >
        <div class="container">
          <img class="notification-bar__icon" :src="`${publicPath}icons/baseline-${notification.type}-24px.svg`" alt="" />
          <p class="notification-bar__message" v-html="sanitizedValue(notification.message)"></p>
          <button
            class="pop-up__close panel-close"
            v-test="'notification-button'"
            @click="notification.show = false"
          >
            <span class="icon-close-big" aria-hidden="true"></span>
            <span class="sr-only">Sluiten</span>
          </button>
        </div>
      </aside>
    </li>
  </template>
</ul>
</template>

<style>
.notification-bar .container{
  padding: 1rem 1rem;
  margin: auto;

  display: flex;
  align-items: top;
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
  margin-bottom: 0;
  /* fill the space with the message, moves close icon to the right */
  flex-basis: 100%;
}

.notification-bar__icon {
  align-self: flex-start;
}
</style>

<script>
import _ from 'lodash'
import sanitizeValue from '@/lib/sanitize-value'

export default {
  props: {
    notifications: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      publicPath: import.meta.env.BASE_URL,
      cleanNotifications: []
    }
  },
  watch: {
    notifications () {
      this.formatNotifications()
    }
  },
  mounted () {
    this.formatNotifications()
  },
  methods: {
    formatNotifications () {
      this.cleanNotifications = _.map(this.notifications, (notification) => {
        const result = { ...notification }
        // use default type
        if (!['error', 'warning', 'info', 'confirm'].includes(notification.type)) {
          result.type = 'info'
        }
        return result
      })
    },
    sanitizedValue (value) {
      return sanitizeValue(value)
    }
  }
}
</script>
