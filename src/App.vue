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
        store.dispatch("fetchUser", user);
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
  color: #ff5656 !important;
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
input[type="range"]{
  -webkit-appearance:none;
  height:2px;
  background: #ff5656;
  background-position:center;
  background-repeat:no-repeat;
  margin: auto;
}

input[type="range"]::-webkit-slider-thumb{
  -webkit-appearance:none;
  width:16px;
  height:16px;
  border-radius: 100%;
  background: #434343;
  position:relative;
  border: 3px solid #ff5656;
  z-index:3;
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
