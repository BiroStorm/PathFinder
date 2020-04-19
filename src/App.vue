<template>
  <v-app>
    <v-app-bar app color="primary" dark dense>
      <v-btn @click="execDijkstra" color="green" :disabled="this.isExecuting"
        >Start Find</v-btn
      ><v-spacer></v-spacer>
      <v-btn
        @click="istanceNewGrid()"
        color="white"
        light
        :disabled="this.isExecuting"
        >Reset</v-btn
      >
    </v-app-bar>
    <v-content @click.right.native.prevent>
      <div class="griglia" @mouseleave="clearEvent()">
        <div v-for="(row, xIndex) in griglia" :key="xIndex" class="riga">
          <Box
            v-for="(colInfo, yIndex) in row"
            :key="yIndex"
            :passData="colInfo"
            @mouseup.native="setMouseUp($event)"
            @mousedown.native.prevent="setMouseDown(xIndex, yIndex, $event)"
            @mouseover.native="modifyGrid(xIndex, yIndex, $event.which === 1)"
          ></Box>
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import Box from "./components/Box";
import Dijkstra from "./algorithm/Dijkstra";

export default {
  name: "App",

  components: {
    Box
  },

  data: () => ({
    griglia: new Array(),
    mouseLeftPressed: false,
    mouseRightPressed: false,
    isExecuting: false,
    modifiedNodes: new Array(),
    startRow: 0,
    startCol: 0,
    endRow: 9,
    endCol: 9
  }),
  mounted() {
    this.istanceNewGrid();
  },
  methods: {
    createNode(row, col) {
      return {
        row,
        col,
        isStart: row === this.startRow && col === this.startCol,
        isFinish: row === this.endRow && col === this.endCol,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        prevNode: undefined
      };
    },
    execDijkstra() {
      this.isExecuting = true;
      console.log(this.isExecuting);

      const visitedNodes = Dijkstra(
        this.griglia,
        this.griglia[this.startRow][this.startCol],
        this.griglia[this.endRow][this.endCol]
      );
      console.log(visitedNodes.length);

      this.visualizeDijkstra(
        visitedNodes,
        this.griglia[this.endRow][this.endCol]
      );
    },
    visualizeDijkstra(visitedPath, endNode) {
      for (let i = 1; i < visitedPath.length; i++) {
        this.modifiedNodes.push({
          row: visitedPath[i].row,
          col: visitedPath[i].col
        });
        setTimeout(() => {
          //Only after he reach the last node, visualize the shortest path.
          if (i == visitedPath.length - 1) {
            this.displayShortestPath(endNode);
          }
          document.getElementById(
            `node-${visitedPath[i].row}-${visitedPath[i].col}`
          ).className = "box visited";
        }, 50 * i);
      }
    },
    displayShortestPath(endNode) {
      const orderPath = [];
      var currNode = endNode;
      while (currNode.prevNode != null) {
        orderPath.unshift(currNode.prevNode);
        currNode = currNode.prevNode;
      }
      for (let i = 1; i < orderPath.length; i++) {
        setTimeout(() => {
          document.getElementById(
            `node-${orderPath[i].row}-${orderPath[i].col}`
          ).className = "box shortPath";
        }, 100 * i);
      }
      setTimeout(() => {
        this.isExecuting = false;
      }, 100 * orderPath.length);
    },
    modifyGrid(row, col, add) {
      if (!this.mouseLeftPressed && !this.mouseRightPressed) return;
      if (this.isExecuting) return;
      if (this.griglia[row][col].isStart || this.griglia[row][col].isFinish)
        return;
      if (add) {
        const newNode = { ...this.griglia[row][col], isWall: true };
        const newGriglia = [...this.griglia];
        newGriglia[row][col] = newNode;
        this.griglia = newGriglia;
      } else {
        if (!this.griglia[row][col].isWall) return;
        const newNode = { ...this.griglia[row][col], isWall: false };
        const newGriglia = [...this.griglia];
        newGriglia[row][col] = newNode;
        this.griglia = newGriglia;
      }
    },
    setMouseDown(row, col, event) {
      if (event.which === 1) {
        this.mouseLeftPressed = true;
        this.modifyGrid(row, col, true);
      } else if (event.which === 3) {
        this.mouseRightPressed = true;
        this.modifyGrid(row, col, false);
      }
    },
    setMouseUp(event) {
      if (event.which === 1) {
        this.mouseLeftPressed = false;
      } else if (event.which === 3) {
        this.mouseRightPressed = false;
      }
    },
    clearEvent() {
      this.mouseLeftPressed = false;
      this.mouseRightPressed = false;
    },
    istanceNewGrid() {
      var grid = new Array();
      for (var row = 0; row < 15; row++) {
        var currRow = [];
        for (var col = 0; col < 15; col++) {
          currRow.push(this.createNode(row, col));
        }
        grid.push(currRow);
      }
      for (let i = 0; i < this.modifiedNodes.length; i++) {
        document
          .getElementById(
            `node-${this.modifiedNodes[i].row}-${this.modifiedNodes[i].col}`
          )
          .classList.remove("visited", "shortPath");
      }
      this.modifiedNodes = new Array();
      this.griglia = grid;
    }
  }
};
</script>

<style>
.griglia {
  margin: 80px auto;
  display: grid;
}
.riga {
  height: 25px;
  margin: 0 auto;
  display: inline-block;
}
.box {
  width: 25px;
  height: 25px;
  border: 1px solid black;
  display: inline-block;
}
</style>
