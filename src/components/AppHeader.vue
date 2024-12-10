<template>
  <header class="app-header">
    <div role="banner" class="site-header">
      <nav class="app-header__top-nav" v-test="'top-menu'">
        <router-link :to="{ name: 'contact' }" data-tour-id="contact-header"
          >Contact</router-link
        >
        <router-link
          :to="{ name: 'accessibility' }"
          data-tour-id="toegankelijkheid-header"
          >Toegankelijkheid</router-link
        >
        <a
          href="https://www.rijkswaterstaat.nl/cookies"
          data-tour-id="cookies-header"
          >Cookies</a
        >
      </nav>
      <a
        href="https://www.rijksoverheid.nl/ministeries/ministerie-van-infrastructuur-en-waterstaat"
        rel="noreferrer noopener"
        class="logo"
        target="_blank"
      >
        <img
          src="/assets/img/logo-nl.svg"
          width="270"
          height="72"
          alt="Rijkswaterstaat Ministerie van Infrastructuur en Waterstaat."
          class="accessibility"
        />
      </a>
  </div>
  <div id="menu" class="app-header__menu">
    <div class="app-header__top-menu container">
      <h1 class="app-header__app-title" data-tour-id="liwo-header">LIWO</h1>
    </div>
    <nav role="navigation" class="app-header__nav" v-test="'main-menu'">
      <ul class="container">
        <li class="app-header__nav-link">
          <router-link
            :to="{ name: 'maps' }"
            data-tour-id="kaarten-header"
          >
            Kaarten
          </router-link>
        </li>
        <li class="app-header__nav-link">
          <router-link
            :to="{ name: 'about' }"
            data-tour-id="over-liwo-header"
          >
            Over LIWO
          </router-link>
        </li>
        <li class="app-header__nav-link">
          <router-link
            :to="{ name: 'maps' }"
            @click="useStartTour().start()"
            data-tour-id="start-tour-header"
          >
            Start tour
          </router-link>
        </li>
      </ul>
    </nav>
    <h2
      class="app-header__page-title container"
      v-test="'page-title'"
      data-tour-id="page-title"
    >
      {{ this.pageTitle }}
    </h2>
  </div>
  </header>
</template>

<script>
import { useStartTour } from '@/tour/use-start-tour'

export default {
  props: {
    pageTitle: {
      type: String,
      default: 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
    }
  },
  methods: {
    useStartTour
  }
}
</script>

<style>
  @import './variables.css';

  .app-header {
    min-width: 320px;
  }

  .app-header__app-title {
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    line-height: 1.6;
  }

  .app-header .container {
    margin: auto;
    max-width: 1200px;
    padding: 0 1rem;
    width: calc(100% - 2rem);
  }

  .app-header__menu {
    background-color: var(--light-yellow);
  }

  .app-header__top-menu {
    display: flex;
    font-size: 1.2em;
    justify-content: space-between;
    padding: .25rem;
  }

  .site-header .app-header__top-nav {
    display: flex;
    flex-direction: row;
    margin: 10px 1em;
  }

  @media only screen and (min-width: 651px) {
    .site-header .app-header__top-nav {
      flex-direction: column;
      margin: 0;
      text-align: right;
    }
  }

  .site-header .app-header__top-nav a {
    color: #696969;
    font-size: 13px;
  }

  .site-header .app-header__top-nav a + a {
    margin-left: 2em;
  }

  @media only screen and (min-width: 651px) {
    .site-header .app-header__top-nav a {
      margin-left: 0;
    }

    .site-header .app-header__top-nav a + a {
      margin-left: 0;
    }
  }

  .app-header__nav {
    background-color: var(--yellow);
    color: var(--black);
    font-size: 1.1em;
    font-weight: 400;
    margin-left: -1em;
    padding-right: 1em;
  }

  @media only screen and (min-width: 375px) {
    .app-header__nav {
      font-size: 1.2em;
    }
  }

  .app-header__nav ul {
    display: flex;
  }

  .app-header__nav li {
    list-style: none;
  }

  .app-header__nav a {
    color: inherit;
    display: inline-block;
    padding: 6px .5em;
  }

  @media only screen and (min-width: 375px) {
    .app-header__nav a {
      padding: 6px 1em;
    }
  }

  .app-header__nav-link a:hover,
  .app-header__nav-link:last-child a.router-link-active:hover,
  .app-header__nav-link a.router-link-active {
    background-color: var(--light-yellow);
  }

  .app-header__nav-link:last-child a.router-link-active {
    background-color: transparent;
  }

  .app-header__nav-link:last-child {
    margin-left: auto;
  }

  .app-header__page-title {
    color: #000;
    font-size: 2.2em;
    font-weight: normal;
    margin: .25rem 0;
    min-height: 45px;
    text-align: left;
  }
</style>
