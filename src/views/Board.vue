<template>
  <div class="board">
    <div class="lane">
      <div class="fighters">
        <div
          class="fighter"
          v-for="fighter in fighters"
          :key="fighter.name">
          <img src="../assets/spyware.svg">
          <span class="name">
            {{ fighter.name }}
          </span>
          <img 
            class="fire"
            v-if="fighter.active"
            v-for="i in 10"
            :key="i"
            src="../assets/fire.svg"
            v-bind:style="{left: Math.floor(Math.random() * 80) -40 + 'px', animationDelay: Math.random() * 1 + 's' }">
        </div>
      </div>
    </div>
    <button class="filled">
      START
    </button>
  </div>
</template>

<script>
export default {
  name: 'board',
  data: () => ({
    fighters: [
      { name: "Fighter 1", url: "", active: true },
      { name: "Fighter 2", url: "", active: false },
      { name: "Fighter 3", url: "", active: false },
      { name: "Fighter 4", url: "", active: true },
      { name: "Fighter 5", url: "", active: false },
      { name: "Fighter 6", url: "", active: false },
      { name: "Fighter 7", url: "", active: false },
      { name: "Fighter 8", url: "", active: false },
      { name: "Fighter 9", url: "", active: false },
      { name: "Fighter 10", url: "", active: false },
      { name: "Fighter 11", url: "", active: false },
      { name: "Fighter 12", url: "", active: false },
      { name: "Fighter 13", url: "", active: false },
      { name: "Fighter 14", url: "", active: false },
      { name: "Fighter 15", url: "", active: false },
      { name: "Fighter 16", url: "", active: false }
    ],
    schema: {

    }
  }),
  computed: {
    randomLeft: function() {
      return Math.floor(Math.random() * 200) -100;
    }
  },
  methods: {
    startTournament() {

    }
  }
}
</script>

<style lang="scss" scoped>
.board {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .lane {
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    .fighters {
      display: flex;
      align-items: center;
      .fighter {
        margin: 0 7px; 
        display: flex;
        justify-content: center;
        border-radius: 50%;
        background-color: rgb(88, 88, 88);
        transform: translateX(0px);
        transition: all .3s ease;
        img {
          width: 50px;
          border-radius: 50%;
        }
        .name {
          font-size: 14px;
          opacity: 0;
          position: absolute;
          bottom: 0;
          transform: translateY(20px);
          background-color: rgb(43, 43, 43);
          padding: 4px 10px;
          white-space: nowrap;
          transition: all .3s ease;
        }
        .fire {
          position: absolute;
          z-index: -2;
          height: 25px;
          animation: fireing 1s linear infinite;
          animation-delay: random(5)s;
        }
        // $var: 0;
        // @for $i from 0 through 10 {
        //   .fire {
        //     animation: fireing 1s ease infinite;
        //     animation-delay: #{$var}s;
        //     $var: $var + 1;
        //   }
        // }
        &:hover {
          .name {
            opacity: 1;
            transform: translateY(40px);
          }
        }
      }
    }
  }
}

@keyframes fireing {
  from {
    transform: translateY(60px) scale(1);
    opacity: 0;
  } to {
    transform: translateY(-30px) scale(1.25);
    opacity: 1;
  }
}
</style>