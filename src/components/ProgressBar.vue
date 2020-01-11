<template>
  <div 
    class="progressBar"
    v-bind:style="{ width: remainingTime + '%' }">
    test
  </div>
</template>

<script>
export default {
  props: ['time'],
  data: () => ({
    remainingTime: 100,
    timer: ''
  }),
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

<style>
.progressBar {
  width: 100%;
  background-color: red;
  transition: all 1s linear;
}
</style>