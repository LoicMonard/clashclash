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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'board',
  data: () => ({
    fighters: [
      { name: "Fighter 1", url: "" },
      { name: "Fighter 2", url: "" },
      { name: "Fighter 3", url: "" },
      { name: "Fighter 4", url: "" },
      { name: "Fighter 5", url: "" },
      { name: "Fighter 6", url: "" },
      { name: "Fighter 7", url: "" },
      { name: "Fighter 8", url: "" },
      { name: "Fighter 9", url: "" },
      { name: "Fighter 10", url: "" },
      { name: "Fighter 11", url: "" },
      { name: "Fighter 12", url: "" },
      { name: "Fighter 13", url: "" },
      { name: "Fighter 14", url: "" },
      { name: "Fighter 15", url: "" },
      { name: "Fighter 16", url: "" }
    ],
    schema: {

    }
  })
}
</script>

<style lang="scss" scoped>
.board {
  height: 100%;
  width: 100%;
  display: flex;
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
</style>