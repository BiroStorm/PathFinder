<template>
  <div
    class="box"
    :class="extraClass"
    :id="'node-' + passData.row + '-' + passData.col"
  ></div>
</template>

<script>
export default {
  name: "Box",
  props: {
    passData: Object
  },
  data: () => ({
    value: undefined,
    extraClass: ""
  }),
  mounted() {
    this.value = this.passData;
    this.$watch(
      "passData",
      passData => {
        this.value = passData;
        this.updateBox();
      },
      { immediate: true }
    );
  },
  methods: {
    printInfo() {
      console.log(this.value);
    },
    updateBox() {
      this.extraClass = this.value.isWall
        ? "Wall"
        : this.value.isStart
        ? "startBox"
        : this.value.isStart
        ? "startBox"
        : this.value.isFinish
        ? "endBox"
        : this.value.isVisited
        ? "visited"
        : "";
    }
  }
};
</script>

<style scoped>
.Wall {
  background: black;
}
.startBox {
  background-color: green;
}
.endBox {
  background-color: red;
}
.visited {
  background-color: grey;
}
.shortPath {
  background-color: cadetblue;
}
</style>
