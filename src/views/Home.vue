<template>
  <div class="home">
    <h3>CLASHCLASH</h3>
    <transition name="fade" mode="out-in">
      <div
        class="join"
        v-if="join && rooms.length"
        :key=1>
        <div 
          class="rooms"
          v-for="(room, index) in rooms"
          :key="index">
          <Room v-bind:room="room"/>
        </div>
        <label>
          Want to create a room ? <span class="colored" @click="join = !join">It's over here</span>
        </label>
      </div>
      <div
        class="no-rooms"
        v-else-if="join && !rooms.length">
        <span>Seems like there's no room yet.</span>
        <label>
          Want to create a room ? <span class="colored" @click="join = !join">It's over here</span>
        </label>
      </div>
      <div
        class="create"
        v-else
        :key=2>
        <label v-if="!this.user.email">
          In order to create a room, please sign in
        </label>
        <div 
          class="google-signin"
          v-if="!this.user.email"
          @click="googleRegister()">
          <img src="../assets/g-logo.png"/>
          <span>Sign in with Google</span>
        </div>
        <div v-else-if="this.user.email && this.step == 1">
          <label for="title">Title <span class="colored">{{ titleError }}</span></label>
          <input 
            naùe="title"
            type="text"
            v-model="title">
          <label for="theme">Theme <span class="colored">{{ themeError }}</span></label>
          <input 
            name="theme"
            type="text"
            v-model="theme">
          <label for="password">Password</label>
          <input 
            type="text"
            v-model="password">
          <button 
            class="filled"
            @click="manageRoom()">
            Next
          </button>
        </div>
        <div v-else-if="this.user.email && this.step == 2">
          <div class="params">
            <toggle-button 
              :value="true"
              v-model="randomFighters"
              color="#00DD7B"
              :labels="true"
              :height="16"
              :width="40"/>
            <span>Random order</span>
          </div>
          <div 
            class="fighters"
            v-if="fighters.length">
            <div 
              class="fighter"
              v-for="(fighter, index) in fighters"
              :key="index">
              <img 
                :src="fighter.url"
                v-if="fighter.url">
              <img 
                src="../assets/spyware.svg"
                v-else>
              <input 
                type="text"
                placeholder="Name"
                v-model="fighter.name">
              <input 
                type="text"
                placeholder="Avatar URL"
                v-model="fighter.url">
            </div>
          </div>
          <button
            class="filled"
            @click="createRoom()">
            Create
          </button>
        </div>
        <label>
          Want to join a room ? <span class="colored" @click="join = !join">It's over here</span>
        </label>
      </div>
    </transition>
  </div>
</template>

<script>
import Room from "../components/Room"
import { auth, authObj, db } from '../firebase/index'
import { mapGetters } from "vuex";
import { ToggleButton } from 'vue-js-toggle-button'

export default {
  name: 'home',
  components: {
    ToggleButton
  },
  data: () => ({
    join: false,
    title: "",
    theme: "",
    titleError: "",
    themeError: "",
    password: "",
    step: 1,
    rooms: [],
    fighters: [],
    randomFighters: true
  }),
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    googleRegister() {
      const provider = new authObj.GoogleAuthProvider();
      auth
        .signInWithPopup(provider)
        .then(data => {
        })
        .catch(err => {
          console.error(err.message);
        });
    },

    manageRoom() {
      if(!this.title) {
        this.titleError = "This field should be renseigné";
      } else {
        this.step = 2;
      }
      
      if(!this.theme) {
        this.themeError = "This field should be renseigné";
      } else {
        this.step = 2;
      }
    },
    createRoom() {
      const shuffleArray = arr => arr
        .map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map(a => a[1]);

      let arr = this.randomFighters ? shuffleArray(this.fighters) : this.fighters;

      for(let i = 0; i < arr.length; i++) {
        arr[i].id = i;
      }

      let that = this;
      db.collection("rooms").add({
        title: this.title,
        theme: this.theme,
        password: this.password,
        fighters: arr,
        public: this.password ? false : true,
        theme: this.theme, 
        active: true,
        step: 0,
        author: this.user.email,
        authorName: this.user.displayName,
        firstFighter: { id: 0, name: "", score: 0 },
        secondFighter: { id: 0, name: "", score: 0 }
      })
      .then(function(docRef) {
        db.collection("activity").doc(docRef.id).set({
          clocker: 0
        })
        that.$router.push(`board/${docRef.id}`);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    }
  },
  created() {
    for(let i = 0; i < 16; i++) {
      this.fighters.push({ name: "Noname", url: "", x: 0, y: 0, status: "alive", count: 0 });
    }
    let that = this;

    db.collection("rooms").where("active", "==", true)
    .onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if (change.type === "added") {
          that.rooms.push({id: change.doc.id, data: change.doc.data()})
        }
        if (change.type === "modified") {
          let obj = that.rooms.find(elem => elem.title = change.doc.data().title);
          let index = that.rooms.indexOf(obj);
          that.rooms[index] = change.doc.data()
        }
        if (change.type === "removed") {
        }
      });
    });
  },
  components: {
    Room
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "umberto";
  src: url("../assets/umberto.ttf");
}

.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > h3 {
    font-family: 'umberto';
    font-size: 64px;
    height: 54px;
    margin: 10px 0;
    color: #ff7675;
  }
  .colored {
    color: #ff7675;
    cursor: pointer;
  }
  .join, .create, .no-rooms {
    min-width: 360px;
    display: flex;
    flex-direction: column;
  }
  .no-rooms {
    > span {
      background-color: #202020;
      padding: 10px 18px;
      margin: 10px 0;
      border-radius: 4px;
      margin: 20px 0;
      text-align: left;
      box-sizing: border-box;
      border-left: 3px solid #ff7675;
      color: rgb(126, 126, 126);
    }
  }
  .create {
    > div {
      min-width: 360px;
      display: flex;
      flex-direction: column;
    }
    .google-signin {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-color: #FFFFFF;
      height: 42px;
      font-family: 'Roboto';
      color: #757575;
      padding: 8px;
      box-sizing: border-box;
      cursor: pointer;
      img {
        height: 100%;
        margin: 0 10px;
      }
    }
    .params {
      display: flex;
      align-items: center;
      margin: 10px 0;
      > span {
        font-size: 14px;
        color: #727272;
        margin: 0 5px;
      }
    }
    .fighters {
      max-height: 50vh;
      overflow-y: scroll;
      .fighter {
        display: flex;
        align-items: center;
        img {
          height: 30px;
          width: 30px;
          margin-right: 10px;
          border-radius: 50%;
        }
        input {
          font-size: 12px;
          margin: 4px;
          flex: 1;
        }
      }
    }
  }
}

::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: rgb(0, 0, 0);
}

::-webkit-scrollbar
{
	border-radius: 10px;
	width: 6px;
	background-color: rgb(51, 51, 51);
}

::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: rgb(36, 35, 35);
}
</style>