import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Login'
import Main from '@/components/Main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      beforeEnter: (from, to, next) => {
        try {
          var match = document.cookie.match(new RegExp('(^| )' + 'username' + '=([^;]+)'));
          if(match && match[2]) {
            next();
          } else {
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            console.log("there is no user logged in");
            next('/login');
          }
        } catch(e) {
          next(e);
        }

      }
    },
    {
      path: '/',
      name: 'Hello',
      component: Login
    }
  ]
})
