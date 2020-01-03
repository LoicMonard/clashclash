<template>
  <div 
    class="room"
    v-bind:class="{ locked: room.public }">
    <div class="wrapper">
      <label class="title">
        {{ room.title }}
      </label>
      <label class="theme">
        {{ room.theme }}
      </label>
      <img 
        src="../assets/insecure.svg"
        v-if="room.public">
      <img 
        src="../assets/safe.svg"
        v-else>
      <button>Join</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['room'],
  data: () => ({
    color: "red"
  })
}
</script>

<style lang="scss" scoped>
.room {
  width: 100%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  background-color: #202020;
  padding: 10px 18px;
  margin: 10px 0;
  border-radius: 4px;
  box-sizing: border-box;
  border-left: 3px solid #00DD7B;
  &.locked {
    border-left: 3px solid #ff7675;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    position: relative;
    > * {
      margin: 10px 10px;
    }
    .title {
      font-size: 16px;
    }
    .theme {
      font-size: 16px;
      color: rgb(126, 126, 126);
    }
    img {
      height: 36px;
    }
  }
}
</style>