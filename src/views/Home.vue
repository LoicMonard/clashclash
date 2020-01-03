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
          v-for="room in rooms"
          :key="room.id">
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
        <label for="title">Title</label>
        <input type="text">
        <label for="password">Password</label>
        <input type="text">
        <button class="filled">Create</button>
        <label>
          Want to join a room ? <span class="colored" @click="join = !join">It's over here</span>
        </label>
      </div>
    </transition>
  </div>
</template>

<script>
import Room from "../components/Room"

export default {
  name: 'home',
  data: () => ({
    join: true,
    rooms: [
      { id: 1, title: "Room n°1", theme: "Youtubers", public: false, fighters: 16 },
      { id: 2, title: "Room n°2", theme: "Superheros", public: true, fighters: 32 },
      { id: 3, title: "Room n°3", theme: "Woman", public: true, fighters: 4 },
      { id: 4, title: "Room n°4", theme: "Animals", public: false, fighters: 16 },
      { id: 5, title: "Room n°5", theme: "Porn vids", public: false, fighters: 16 }
    ]
  }),
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
    display: flex;
    flex-direction: column;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>