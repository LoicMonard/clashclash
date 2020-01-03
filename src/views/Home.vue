<template>
  <div class="home">
    <transition name="fade" mode="out-in">
      <div
        class="join"
        v-if="join"
        :key=1>
        <h3>Join an existing room</h3>
        <label for="password">Password</label>
        <input type="text">
        <button class="filled">Join</button>
        <label>
          Want to create a room ? <span class="colored" @click="join = !join">It's over here</span>
        </label>
      </div>
      <div
        class="create"
        v-else
        :key=2>
        <h3>Create a new room</h3>
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
export default {
  name: 'home',
  data: () => ({
    join: true,
    rooms: [
      { title: "Room n°1", public: false, fighters: 16 },
      { title: "Room n°2", public: true, fighters: 32 },
      { title: "Room n°3", public: true, fighters: 4 },
      { title: "Room n°4", public: false, fighters: 16 },
      { title: "Room n°5", public: false, fighters: 16 }
    ]
  }),
  components: {
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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