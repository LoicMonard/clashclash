<template>
  <div class="board">
    <transition name="fade" mode="out-in">
      <div 
        class="wrapper"
        v-if="fighters.length">
        <h3>CLASHCLASH {{ $route.params.id }}</h3>
        <div class="lane">
          <div class="fighters">
            <div
              v-bind:class="`fighter _ ${fighter.id} ${fighter.status}`"
              v-for="(fighter, index) in fighters"
              :key="index"
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
                  src="../assets/lightning.svg"
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
          v-bind:class="{ active: activeFighters.length }">
          <div 
            class="left"
            @click="voteLeft()"
            v-bind:style="{ width: votePercent}">
            <div 
              class="wrapper"
              v-if="activeFighters.length">
              <span>{{ this.activeFighters[0].name }}</span>
              <span>{{ this.activeFighters[0].count }}</span>
              <div
                class="assets">
                <img 
                  class="asset"
                  v-for="i in 20"
                  :key="i"
                  src="../assets/fire.svg"
                  v-bind:style="{left: Math.floor(Math.random() * 100) + 1 + '%', animationDelay: Math.random() * 1 + 's' }">
              </div>
            </div>
            <div 
              class="wrapper"
              v-else>
              Waiting for the next round
            </div>
          </div>
          <div 
            class="right"
            @click="voteRight()"
            v-bind:class="{ active: activeFighters.length }">
            <div 
              class="wrapper"
              v-if="activeFighters.length">
              <span>{{ this.activeFighters[1].name }}</span>
              <span>{{ this.activeFighters[1].count }}</span>
              <div
                class="assets">
                <img 
                  class="asset"
                  v-for="i in 20"
                  :key="i"
                  src="../assets/water-drop.svg"
                  v-bind:style="{left: Math.floor(Math.random() * 100) + 1 + '%', animationDelay: Math.random() * 1 + 's' }">
              </div>
            </div>
            <div 
              class="wrapper"
              v-else>
              Waiting for the next round
            </div>
          </div>
        </div>
      </div>
      <div 
        class="loading"
        v-else-if="fighters.length == 0">
        Loading
      </div>
      <div 
        class="noRoomFound"
        v-else-if="!roomData">
        No room found
      </div>
    </transition>
  </div>
</template>

<script>
import { auth, authObj, db } from '../firebase/index'

export default {
  name: 'board',
  data: () => ({
    roomData: [],
    fighters: [],
    activeGame: false,
    activeFighters: [],
    subset: [],
    step: 0,
    turn: 1,
    round: 1,
    x: 32,
    doc: ''
  }),
  computed: {
    newRound: function() {
      return this.activeFighters.length ? false : true;
    },
    votePercent: function() {
      if(this.activeFighters.length) {
        return this.activeFighters[0].count / (this.activeFighters[0].count + this.activeFighters[1].count) * 100 +'%';
      } else {
        return '50%';
      }
    },
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
        // this.fighters.find(elem => elem === this.activeFighters[0]).y -= 80;
        // this.fighters.find(elem => elem === this.activeFighters[1]).y -= 80;
        // console.log(`${this.fighters[0].y}, ${this.fighters[1].y}`);
        this.fighters[this.activeFighters[0].id].y -= 80;
        this.fighters[this.activeFighters[1].id].y -= 80;
        this.step += 2;
      } else {
        this.activeFighters = [];
        this.step = 0;
        this.round++;
        this.x *= 2;
        this.fighters.forEach(fighter => fighter.count = 0); 
      }

      let that = this;
      db.collection("rooms").doc(this.$route.params.id)
        .update({
          step: that.turn,
          fighters: that.fighters
        }).then(function() {
          console.log('ok updaté');
          that.turn++;
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
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
  },
  created() {
    let that = this; 
    db.collection("rooms").doc(this.$route.params.id)
      .onSnapshot(function(doc) {
        that.roomData = doc.data();
        that.fighters = doc.data().fighters;
        console.log('Reset mec :/');
      }, function(error) {
        console.error(`Error: ${error}`)
      });
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
  justify-content: space-between;
  .wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    > h3 {
      font-family: 'umberto';
      font-size: 64px;
      height: 54px;
      color: #ff7675;
    }
    .lane {
      height: 400px;
      display: flex;
      align-items: center;
      .fighters {
        display: flex;
        align-self: flex-end;
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
            animation: sparkling 1s linear infinite;
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
      width: 100%;
      display: flex;
      align-items: center;
      cursor: not-allowed;
      &.active {
        cursor: pointer;
        .left {
          background-color: #FF7675;
        }
        .right {
          background-color: #42aaf5;
        }
      }
      .left, .right {
        font-family: 'umberto', 'niveau-grotesk-small-caps';
        font-size: 24px;
        min-width: 25%;
        height: 100px;
        background-color: rgb(15, 15, 15);
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow: hidden;
        transition: all 2s ease;
        > div {
          display: flex;
          flex-direction: column;
        }
        > .wrapper {
          justify-content: center;
          .assets {
            .asset {
              position: absolute;
              opacity: 0;
              height: 25px;
              z-index: 2;
              animation-delay: random(5)s;
            }
          }
        }
      }
      .left {
        width: 50%;
        .asset {
          animation: fireing 1s linear infinite;
        }
      }
      .right {
        flex: 1;
        .asset {
          animation: watering 1s linear infinite;
        }
      }
    }
  }
}

@keyframes sparkling {
  from {
    transform: translateY(60px) scale(1);
    opacity: 0;
  } to {
    transform: translateY(-30px) scale(1.25);
    opacity: 1;
  }
}

@keyframes fireing {
  from {
    transform: translateY(50px) scale(1);
    opacity: 0;
  } to {
    transform: translateY(-100px) scale(1.25);
    opacity: 1;
  }
}

@keyframes watering {
  from {
    transform: translateY(-130px) scale(1);
    opacity: 0;
  } to {
    transform: translateY(0px) scale(1.25);
    opacity: 1;
  }
}
</style>