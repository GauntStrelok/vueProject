

<template>
  <div class="text-center">
    <div class="wrapper fadeIn">
      <div id="formContent" v-bind:class="{ wrong: isWrong }">
        <form @submit.prevent="formSubmit">
          <input type="text" id="login" class="fadeIn second" name="login" placeholder="login" v-model="user">
          <input type="password" id="password" class="fadeIn third" name="login" placeholder="password" v-model="password">
          <input type="submit" class="fadeIn fourth" value="Register" v-if="isRegister">
          <input type="submit" class="fadeIn fourth" value="Log In" v-else>
        </form>
        <span class="errorMessage" v-if="isWrong">Wrong username or password, try again</span>
        <b-link href="#" v-if="isRegister" v-on:click='isRegister = false'>Back to log in</b-link>
        <a href="#" v-else v-on:click='isRegister = true'>Register</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jwt from 'jwt-simple';
import sha256 from 'crypto-js/sha256';

const client = axios.create({
  baseURL: 'http://localhost:3001/',
  json: true
});

export default {
  name: 'login',
  data: () => ({
    user: "",
    password: "",
    isWrong: false,
    isRegister: false
  }),
  methods: {
    formSubmit: function() {
      if(this.isRegister) {
        this.register();
      } else {
        this.login();
      }
    },
    login: function(evt) {
      client.post("/login", {username: this.user, password: sha256(this.password).toString()}).then((res) => {
        window.localStorage.setItem("secret", res.data);
        window.localStorage.setItem("username", this.user);
        document.cookie = "username=" + this.user;
        this.$router.push('/Main');
      }).catch(() => {
        this.isWrong = true;
      });

    },
    register: function() {
      client.post("/register", {username: this.user, password: sha256(this.password).toString()}).then((res) => {
        document.cookie = "username=" + this.user;
        window.localStorage.setItem("secret", res.data);
        window.localStorage.setItem("username", this.user);
        this.$router.push('/Main');
      }).catch(() => {
        this.isWrong = true;
      });
    }
  },
  watch: {
    user: function() {
      this.isWrong = false;
    },
    password: function() {
      this.isWrong = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
html {
  background-color: #56baed;
}

body {
  font-family: "Poppins", sans-serif;
  height: 100vh;
}

h2 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display:inline-block;
  margin: 40px 8px 10px 8px;
  color: #cccccc;
}




/* STRUCTURE */

.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
}

#formContent {
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0px;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
  box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
  text-align: center;
}

.wrong {
  border: 2px solid red;
}

.errorMessage {
  color:red;
}


/* TABS */

h2.inactive {
  color: #cccccc;
}

h2.active {
  color: #0d0d0d;
  border-bottom: 2px solid #5fbae9;
}



/* FORM TYPOGRAPHY*/

input[type=button], input[type=submit], input[type=reset]  {
  background-color: #56baed;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
  box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
  margin: 5px 20px 40px 20px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type=button]:hover, input[type=submit]:hover, input[type=reset]:hover  {
  background-color: #39ace7;
}

input[type=button]:active, input[type=submit]:active, input[type=reset]:active  {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type=text], input[type=password] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

input[type=text]:focus {
  background-color: #fff;
}

input[type=text]:placeholder {
  color: #cccccc;
}



/* ANIMATIONS */

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@-moz-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

.fadeIn {
  opacity:0;
  -webkit-animation:fadeIn ease-in 1;
  -moz-animation:fadeIn ease-in 1;
  animation:fadeIn ease-in 1;

  -webkit-animation-fill-mode:forwards;
  -moz-animation-fill-mode:forwards;
  animation-fill-mode:forwards;

  -webkit-animation-duration:1s;
  -moz-animation-duration:1s;
  animation-duration:1s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.5s;
  -moz-animation-delay: 0.5s;
  animation-delay: 0.5s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}

</style>
