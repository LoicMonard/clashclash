<template>
  <div class="home">
    <h3>CLASHCLASH</h3>
    <transition name="fade" mode="out-in">
      <div
        class="join"
        v-if="join"
        :key=1>
        <div 
          class="rooms"
          v-for="(room, index) in roomss"
          :key="index">
          <Room v-bind:room="room"/>
        </div>
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
            type="text"
            v-model="title">
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
                placeholder="Avatar"
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

export default {
  name: 'home',
  data: () => ({
    join: false,
    title: "",
    titleError: "",
    password: "",
    step: 1,
    roomss: [],
    rooms: [
      { id: 1, title: "Room n°1", theme: "Youtubers", public: false, fighters: 16 },
      { id: 2, title: "Room n°2", theme: "Superheros", public: true, fighters: 32 },
      { id: 3, title: "Room n°3", theme: "Woman", public: true, fighters: 4 },
      { id: 4, title: "Room n°4", theme: "Animals", public: false, fighters: 16 },
      { id: 5, title: "Room n°5", theme: "Porn vids", public: false, fighters: 16 }
    ],
    fighters: []
  }),
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    checkAuth() {
      console.log(auth)
    },
    googleRegister() {
      const provider = new authObj.GoogleAuthProvider();
      auth
        .signInWithPopup(provider)
        .then(data => {
          console.log(data.user.email);
        })
        .catch(err => {
          if (err.code === "auth/email-already-in-use") {
            this.emailError = "Email déjà utilisé"
          } else if (err.code === "auth/invalid-email") {
            this.emailError = "Email mal formatté"
          } else if (err.code === "auth/weak-password") {
            this.passwordError = "Mot de passe trop faible"
          }
          console.log(err.message)
        });
    },

    manageRoom() {
      if(!this.title) {
        this.titleError = "This field should be renseigné";
      } else {
        this.step = 2;
      }
    },
    createRoom() {
      db.collection("rooms").add({
        title: this.title,
        password: this.password,
        fighters: this.fighters,
        public: this.password ? false : true,
        theme: 'Theme',
        active: true,
        step: 0,
        author: this.user.email,
        firstFighter: { id: 0, name: "", score: 0 },
        secondFighter: { id: 0, name: "", score: 0 }
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    }
  },
  created() {
    for(let i = 0; i < 16; i++) {
      this.fighters.push({ id: i, name: "Noname", url: "", x: 0, y: 0, status: "alive", count: 0 });
    }
    let that = this;
    // db.collection("rooms").doc("9rYtOb2UI3NXqCb5cA0k")
    // .onSnapshot(function(doc) {
    //     console.log("Current data: ", doc.data());
    // });


    db.collection("rooms").where("active", "==", true)
    .onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if (change.type === "added") {
          that.roomss.push({id: change.doc.id, data: change.doc.data()})
          console.log("New city: ", change.doc.data());
          console.log(change.doc.id);
        }
        if (change.type === "modified") {
          let obj = that.roomss.find(elem => elem.title = change.doc.data().title);
          let index = that.roomss.indexOf(obj);
          that.roomss[index] = change.doc.data()
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
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
  .join, .create {
    min-width: 360px;
    display: flex;
    flex-direction: column;
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