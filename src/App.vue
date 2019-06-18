<template>
  <div id="app">
    <header>
      <span class="float-left">Vue.js Simple test app</span>
      <b-link href="#" v-on:click='logout' class="float-right mt-3">Back to log in</b-link>
    </header>
    <main>
      <img src="./assets/customLogo.png" alt="Simple PWA">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import jwt from 'jwt-simple';

const client = axios.create({
  baseURL: 'http://localhost:3001/',
  json: true
});

export default {
  name: 'app',
  methods: {
    logout: function() {
      let token = jwt.encode({username: window.localStorage.getItem("username")}, window.localStorage.getItem("secret"));
      client.post("/logout", {username: window.localStorage.getItem("username")}, {
        headers: {
          'authorization': token
        }
      }).then((res) => {
        window.localStorage.removeItem("secret");
        window.localStorage.removeItem("username");
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        this.$router.push('/login');
      }).catch(() => {
        this.isWrong = true;
      });
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
