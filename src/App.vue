<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { auth } from './firebase/index'
import { mapActions } from "vuex";
import store from "./store";

export default {
  name: 'app',
  mounted() {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        store.dispatch("fetchUser", user);
        console.log(user.email);
      } else {
        console.log('no user');
      }
    });
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  height: 100vh;
  font-family: niveau-grotesk,sans-serif;
  font-weight: 400;
  font-style: normal;
}

#app {
  font-family: 'niveau-grotesk', 'Avenir', Helvetica, Arial, sans-serif;
  background-color: #161616;
  color: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
}
.colored {
  color: #ff5656;
}
h1 {
  font-weight: 500;
  font-family: niveau-grotesk-small-caps, sans-serif;
  color: rgb(223, 223, 223);
}
h2 {
  font-weight: 500;
  font-family: niveau-grotesk-small-caps, sans-serif;
  color: #2b2b2b;
}
h3 {
  font-weight: 300;
  font-family: niveau-grotesk-small-caps, sans-serif;
  color: #fff;
}
button {
  border: 1px solid #ff7675;
  border-radius: 4px;
  color: #ff7675 !important;
  padding: 8px 20px;
  margin: 10px 0;
  font-size: 16px;
  outline: inherit;
  color: inherit;
  background-color: inherit;
  text-transform: lowercase;
  font-family: niveau-grotesk-small-caps, sans-serif;
  font-weight: 400;
  font-style: normal;
  cursor: pointer;
  transition: all .2s ease;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 14px;
    margin-left: 4px;
  }
}
button.rounded {
  border-radius: 16px;
}
button.filled {
  background-color: #ff7675;
  color: #fff !important;
}
button:hover {
  background: #ff7675;
  color: #fff !important;
}
button.filled:hover {
  background: inherit;
  color: #ff7675 !important;
}
input[type=text], input[type=email], input[type=password] {
  border: 1px solid #000;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  outline: inherit;
  background-color: #000000;
  font-family: 'niveau-grotesk';
  font-size: 16px;
  font-weight: 400;
  transition: all .3s ease;
  color: rgb(189, 189, 189);
  &:hover {
    border: 1px solid #ff7675;
  }
  &:focus {
    outline: none;
    border: 1px solid #ff7675;
  }
  &::placeholder {
    color: #696969;
    font-style: italic;
    font-size: 12px;
  }
}
label {
  font-family: niveau-grotesk-small-caps, sans-serif;
  margin: 6px 0;
  text-align: left;
  color: #5f5f5f;
  font-size: 14px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
