<template>
  <header class="app-header">
    <div role="banner" class="site-header">
      <nav class="app-header__top-nav">
        <router-link :to="{name: 'contact'}">Contact</router-link>
        <router-link :to="{name: 'accessibility'}">Toegankelijkheid</router-link>
        <a href="https://www.rijkswaterstaat.nl/cookies">Cookies</a>
      </nav>
      <a href="/" class="logo">
        <img
          src="https://staticresources.rijkswaterstaat.nl/assets/img/logo.png?v=2.19.2"
          width="270"
          height="72"
          alt="Rijkswaterstaat Ministerie van Infrastructuur en Waterstaat."
          class="accessibility"
        />
      </a>
  </div>
  <div id="menu" class="app-header__menu">
    <div class="app-header__top-menu container">
      <span class="app-header__app-title">
        <strong>LIWO</strong>
      </span>
    </div>
    <nav role="navigation" class="app-header__nav">
      <ul class="container">
        <li><router-link :to="{name: 'home'}" exact>Home</router-link></li>
        <li><router-link :to="{name: 'maps'}">Kaarten</router-link></li>
        <li><router-link :to="{name: 'about'}">Over LIWO</router-link></li>
      </ul>
    </nav>
    <h1 class="app-header__page-title container">{{ this.pageTitle }}</h1>
  </div>
  </header>
</template>

<script>
export default {
  props: {
    pageTitle: {
      type: String,
      default: 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
    }
  }
}
</script>

<style>
  @import './variables.css';

  .app-header {
    min-width: 320px;
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
    margin: 0;
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

  .app-header__nav a:hover,
  .app-header__nav a.router-link-active {
    background-color: var(--light-yellow);
  }

  .app-header__page-title {
    color: #000;
    font-size: 2.2em;
    margin: .25rem 0;
    min-height: 45px;
    text-align: left;
  }
</style>
