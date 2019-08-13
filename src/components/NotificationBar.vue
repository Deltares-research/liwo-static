<template>
<ul class="viewer__notifications" v-if="editableNotifications && editableNotifications.length">
  <li class="viewer__notification" v-for="(notification, index) in editableNotifications"
      :key="index"
      @click="notification.show = false"
      v-show="notification.show"
      >
    <aside class="notification-bar"
           :class="{[`notification-bar--${notification.type}`]:true}"
           >
      <div class="container">
        <img class="notification-bar__icon" :src="`${publicPath}icons/baseline-${notification.type}-24px.svg`"  />
        <p class="notification-bar__message">{{ notification.message }} </p>
        <button class="pop-up__close icon-close-big panel-close"><span class="sr-only">Sluiten</span></button>
      </div>
    </aside>
  </li>
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
      editableNotifications: [],
      publicPath: process.env.BASE_URL
    }
  },
  watch: {
    notifications (val) {
      this.setNotifications()
    }
  },
  mounted () {
    this.editableNotifications = this.setNotifications()
  },
  methods: {
    setNotifications () {
      this.editableNotifications = _.map(this.notifications, (notification) => {
        let result = { ...notification }
        // use default type
        if (!['error', 'warning', 'info', 'confirm'].includes(notification.type)) {
          result.type = 'info'
        }
        return result
      })
    }
  }

}
</script>
