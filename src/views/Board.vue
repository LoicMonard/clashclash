<template>
  <div class="board">
    <div class="lane">
      <div class="fighters">
        <div
          v-bind:class="`fighter _ ${fighter.id} ${fighter.status}`"
          v-for="fighter in fighters"
          :key="fighter.name"
          v-bind:style="{transform: `translate(${fighter.x}px,${fighter.y}px)`}">
          <img src="../assets/spyware.svg">
          <span class="name">
            {{ fighter.name }}
          </span>
          <div
            class="fires"
            v-if="isActiveFighter(fighter)">
            <img 
              class="fire"
              v-for="i in 10"
              :key="i"
              src="../assets/fire.svg"
              v-bind:style="{left: Math.floor(Math.random() * 80) -40 + 'px', animationDelay: Math.random() * 1 + 's' }">
          </div>
        </div>
      </div>
    </div>
    <button 
      class="filled"
      @click="nextStep()">
      Next
    </button>
    <div 
      class="choices"
      v-if="activeFighters.length">
      <div 
        class="left"
        @click="voteLeft()">
        <span>{{ this.activeFighters[0].name }}</span>
        <span>{{ this.activeFighters[0].count }}</span>
      </div>
      <div 
        class="right"
        @click="voteRight()">
        <span>{{ this.activeFighters[1].name }}</span>
        <span>{{ this.activeFighters[1].count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'board',
  data: () => ({
    fighters: [
      { id: 0, name: "Fighter 1", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 1, name: "Fighter 2", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 2, name: "Fighter 3", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 3, name: "Fighter 4", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 4, name: "Fighter 5", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 5, name: "Fighter 6", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 6, name: "Fighter 7", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 7, name: "Fighter 8", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 8, name: "Fighter 9", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 9, name: "Fighter 10", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 10, name: "Fighter 11", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 11, name: "Fighter 12", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 12, name: "Fighter 13", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 13, name: "Fighter 14", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 14, name: "Fighter 15", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" },
      { id: 15, name: "Fighter 16", url: "", active: false, x: 0, y: 0, count: 0, status: "alive" }
    ],
    schema: {

    },
    activeGame: false,
    activeFighters: [],
    subset: [],
    step: 0,
    round: 1,
    x: 32
  }),
  computed: {
    newRound: function() {
      return this.activeFighters.length ? false : true;
    }
  },
  methods: {
    nextStep() {
      if(this.newRound) {
        this.subset = this.fighters.filter(fighter => fighter.status == "alive")
      }

      if(this.activeFighters.length) {
        // LEFT WINS
        if(this.activeFighters[0].count > this.activeFighters[1].count) {
          this.fighters[this.activeFighters[1].id].status = "dead";
          if(this.fighters[this.activeFighters[0].id].x == 0) {
            this.fighters[this.activeFighters[0].id].x += 32;
          } else {
            let x = this.fighters[this.activeFighters[0].id].x;
            this.fighters[this.activeFighters[0].id].x = x + this.x;
          }
          this.fighters[this.activeFighters[1].id].y += 80;
        // RIGHT WINS
        } else {
          this.fighters[this.activeFighters[0].id].status = "dead";
          if(this.fighters[this.activeFighters[0].id].x == 0) {
            this.fighters[this.activeFighters[1].id].x -= 32;
          } else {
            let x = this.fighters[this.activeFighters[1].id].x;
            this.fighters[this.activeFighters[1].id].x = x - this.x;
          }
          this.fighters[this.activeFighters[0].id].y += 80;
        }
      }

      if(this.step < this.subset.length) {
        this.activeFighters = [this.subset[this.step], this.subset[this.step + 1]]
        this.fighters[this.activeFighters[0].id].y -= 80;
        this.fighters[this.activeFighters[1].id].y -= 80;
        this.step += 2;
      } else {
        this.activeFighters = [];
        this.step = 0;
        this.round++;
        this.x *= 2;
      }
    },
    isActiveFighter: function(fighter) {
      return this.activeFighters.includes(fighter)
    },
    voteLeft() {
      this.activeFighters[0].count += 1;
    },
    voteRight() {
      this.activeFighters[1].count += 1;
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
        transition: all 1s ease;
        &.dead {
          img {
            filter: grayscale(1);
          }
        }
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
          opacity: 0;
          z-index: -2;
          height: 25px;
          animation: fireing 1s linear infinite;
          animation-delay: random(5)s;
        }
        &:hover {
          .name {
            opacity: 1;
            transform: translateY(40px);
          }
        }
      }
    }
  }
  .choices {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    .left, .right {
      width: 50%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .left {
      background-color: #FF7675;
    }
    .right {
      background-color: #42aaf5;
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