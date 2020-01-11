<template>
  <div class="progressBar">
    <div
      class="left"
      v-bind:style="{ width: remainingTime + '%', backgroundColor: color }">
      &nbsp;
    </div>
    <div class="right">
    </div>
  </div>
</template>

<script>
export default {
  props: ['time'],
  data: () => ({
    remainingTime: 100,
    timer: ''
  }),
  computed: {
    color: function() {
      if(this.remainingTime > 66) {
        return '#00DD7B';
      } else if(this.remainingTime > 33) {
        return '#f5a442';
      } else {
        return '#ff5857';
      }
    }
  },
  methods: {
    startTimer() {
      this.remainingTime = 100;
      let minus = 100/this.time;
      let that = this;
      let timer = setInterval(function () {
        if(that.remainingTime > 0) {
          that.remainingTime -= minus;
        } else {
          that.$emit('timedOut');
          clearInterval(timer);
        }
      }, 1000)
    },
  }
  
}
</script>

<style lang="scss" scoped>
.progressBar {
  width: 100%;
  height: 6px;
  display: flex;
  .left {
    width: 70%;
    opacity: 1;
    border-radius: 3px;
    transition: all 1s linear;
  }
  .right {
    flex: 1;
    background-color: #fff;
    opacity: .3;
  }
}
</style>