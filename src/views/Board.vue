<template>
  <div class="board">
    <transition name="fade" mode="out-in">
      <div 
        class="wrapper"
        v-if="fighters.length">
        <div class="header">
          <h3>CLASHCLASH</h3>
          <div class="infos">
            <div class="master">
              <img src="../assets/crowns.svg">
              <span>Master {{ user.displayName }}</span> 
            </div>
            <div class="theme">
              <img src="../assets/explosion.svg">
              <span>{{ roomData.theme }} : </span> 
            </div>
            <div class="url">
              <input id="hiddenInput" type="hidden" :value="roomUrl">
              <img src="../assets/papers.svg">
              <span 
                @click="copyUrl()"
                v-bind:class="{copied: copied}">
                Copy room url
              </span>
            </div>
          </div>          
        </div>
        <div class="lane">
          <div class="fighters">
            <div
              v-bind:class="`fighter _ ${fighter.id} ${fighter.status}`"
              v-for="(fighter, index) in fighters"
              :key="index"
              v-bind:style="{transform: `translate(${fighter.x}px,${fighter.y}px)`}">
              <img 
                src="../assets/spyware.svg"
                v-if="!fighter.url">
              <img 
                :src="fighter.url"
                v-else>
              <span class="name">
                {{ fighter.name }}
              </span>
              <div
                class="fires"
                v-if="fighter.status == 'fighting'">
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
        <div class="buttons">
          <button 
            class="filled"
            @click="nextStep()"
            v-if="user.email == roomData.author">
            Next
          </button>
          <button 
            class=""
            @click="endRoom()"
            v-if="user.email == roomData.author">
            End room
          </button>
        </div>
        <div 
          class="choices"
          v-bind:class="{ active: fightingPlayers.length }">
          <div 
            class="left"
            @click="voteLeft()"
            v-bind:style="{ width: votePercent}">
            <div 
              class="wrapper"
              v-if="fightingPlayers.length">
              <span>{{ roomData.firstFighter.name }}</span>
              <span>{{ roomData.firstFighter.score }}</span>
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
              v-if="fightingPlayers.length">
              <span>{{ roomData.secondFighter.name }}</span>
              <span>{{ roomData.secondFighter.score }}</span>
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
import { mapGetters } from "vuex";

export default {
  name: 'board',
  data: () => ({
    roomData: [],
    activeGame: false,
    activeFighters: [],
    subset: [],
    step: 0,
    turn: 1,
    round: 1,
    x: 32,
    doc: '',
    voted: false,
    clocker: 0,
    copied: false
  }),
  watch: {
    clocker: function() {
      console.log('Fight changed');
    }
  },
  computed: {
    ...mapGetters({
      user: "user"
    }),
    fighters: function() {
      return this.roomData ? this.roomData.fighters : [];
    },
    newRound: function() {
      return this.activeFighters.length ? false : true;
    },
    votePercent: function() {
      if(this.fightingPlayers.length) {
        if(this.roomData.firstFighter.score == 0 && this.roomData.secondFighter.score == 0) {
          return '50%';
        }
        else {
          return this.roomData.firstFighter.score / (this.roomData.firstFighter.score + this.roomData.secondFighter.score) * 100 +'%';
        }
      } else {
        return '50%';
      }
    },
    fightingPlayers: function() {
      return this.fighters.filter(elem => elem.status == "fighting").length ? this.fighters.filter(elem => elem.status == "fighting") : [];
    },
    roomUrl: function() {
      return `http://localhost:8080${this.$route.path}`;
    }
  },
  methods: {
    nextStep() {
      if(this.newRound) {
        this.subset = this.fighters.filter(fighter => fighter.status == "alive" || fighter.status == "fighting")
      }

      if(this.activeFighters.length) {
        // LEFT WINS
        if(this.roomData.firstFighter.score > this.roomData.secondFighter.score) {
          this.fighters[this.activeFighters[1].id].status = "dead";
          this.fighters[this.activeFighters[0].id].status = "alive";
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
          this.fighters[this.activeFighters[1].id].status = "alive";
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
        db.collection("rooms").doc(this.$route.params.id)
        .update({
          firstFighter: { id: this.activeFighters[0].id ,name: this.activeFighters[0].name, score: 0 },
          secondFighter: { id: this.activeFighters[1].id ,name: this.activeFighters[1].name, score: 0 }
        }).then(function() {
          console.log('score 1 ++ ');
        })
        .catch(function(error) {
          console.error("Error updating document: ", error);
        });
        this.fighters[this.activeFighters[0].id].status = "fighting";
        this.fighters[this.activeFighters[1].id].status = "fighting";
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
          console.error("Error updating document: ", error);
        });

      let clocker = this.clocker;
      clocker++;

      db.collection("activity").doc(that.$route.params.id)
      .update({
        clocker: clocker
      }).then(function() {
        that.voted = false;
        console.log('Cloker updated');
      })
      .catch(function(error) {
        console.error("Error updating actvity document: ", error);
      });
    },
    endRoom() {
      let that = this;
      db.collection("rooms").doc(that.$route.params.id).delete().then(function() {
        console.log("Room successfully deleted!");
        db.collection("activity").doc(that.$route.params.id).delete().then(function() {
          console.log("Activity successfully deleted!");
          that.$router.push('/home');          
        }).catch(function(error) {
          console.error("Error removing activity document: ", error);
        });
      }).catch(function(error) {
        console.error("Error removing room document: ", error);
      });
    },
    isActiveFighter: function(fighter) {
      return this.activeFighters.includes(fighter)
    },
    voteLeft() {
      if(!this.voted) {
        let score = this.roomData.firstFighter.score;
        score++;
        let that = this;
        db.collection("rooms").doc(this.$route.params.id)
          .update({
            firstFighter: { name: that.fightingPlayers[0].name, score: score }
          }).then(function() {
            console.log('score 1 ++ ');
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
      this.voted = true;
    },
    voteRight() {
      if(!this.voted) {
        let score = this.roomData.secondFighter.score;
        score++;
        let that = this;
        db.collection("rooms").doc(this.$route.params.id)
          .update({
            secondFighter: { name: that.fightingPlayers[1].name, score: score }
          }).then(function() {
            console.log('score 2 ++ ');
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
      this.voted = true;
    },
    copyUrl() {
      let urlToCopy = document.querySelector('#hiddenInput');
      urlToCopy.setAttribute('type', 'text');
      urlToCopy.select();
      document.execCommand("copy");
      this.copied = true;
      urlToCopy.setAttribute('type', 'hidden')
    }
  },
  mounted() {
    let that = this; 
    db.collection("rooms").doc(this.$route.params.id)
      .onSnapshot(function(doc) {
        that.roomData = doc.data();
        console.log('Reset mec :/');
      }, function(error) {
        console.error(`Error: ${error}`)
      });

    db.collection("activity").doc(this.$route.params.id)
      .onSnapshot(function(doc) {
        that.clocker = doc.data().clocker;
      }, function(error) {
        console.error(error);
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
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > h3 {
        font-family: 'umberto', 'niveau-grotesk-small-caps';
        font-size: 64px;
        height: 64px;
        margin-bottom: 20px;
        color: #ff7675;
      }
      .infos {
        display: flex;
        flex-direction: row;
        > * {
          margin: 0 10px;
          font-style: italic;
          font-family: 'niveau-grotesk-small-caps';
          color: rgb(116, 116, 116);
        }
        .master, .theme, .url {
          display: flex;
          align-items: center;
          color: rgb(116, 116, 116);
          transition: all .3s ease;
          > img {
            height: 20px;
          }
          > span {
            font-size: 16px;
            margin: 0 4px;
          }
        }
        .url {
          cursor: pointer;
          & .copied {
            color: #00DD7B !important;
          }
        }
      }
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
          > img {
            height: 50px;
            object-fit: cover;
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
    .buttons {
      display: flex;
      > button {
        margin: 0 4px;
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