function Dijkstra(grid, startNode, endNode) {
  if (startNode == null || endNode == null) return null;
  startNode.distance = 0;
  //Lista dei nodi già visitati
  const visitedNodes = [];
  //mettiamo il nodo iniziale tra i nodi da visitare:
  var nextNodes = [startNode];
  while (nextNodes.length != 0) {
    //prende il primo nodo tra la lista dei nodi da visitare.
    const currentNode = nextNodes.shift();
    //se il nodo attuale è il nodo finale, abbiamo concluso.
    if (currentNode == endNode) {
      return visitedNodes;
    }
    if (currentNode.isWall) {
      continue;
    }
    //impostiamo questo nodo come visitato
    currentNode.isVisited = true;
    //troviamo i nodi vicini NON ancora visitati
    const nearNodes = getClosestNodes(currentNode, grid); //nodi vicini da visitare
    //aggiorna le distanza dei nodi vicini
    updateNodeDistance(nearNodes, currentNode);
    nextNodes = [...nextNodes, ...nearNodes];

    //Toglie i duplicati
    nextNodes = nextNodes.filter((item, index) => {
      return nextNodes.indexOf(item) === index;
    });
    //Ordina l'array dal più piccolo (valore di distanza)
    nextNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    //mettiamo il noto attuale tra quelli visitati.
    visitedNodes.push(currentNode);
  }
  //nel caso finisca i blocchi da visitare e non trova il endNode
  return visitedNodes;
}

function getClosestNodes(startNode, grid) {
  const closestNodes = [];
  //find the row and col position
  const { row, col } = startNode;
  //up -> esiste una riga sopra
  if (row > 0) closestNodes.push(grid[row - 1][col]);
  //right grid[0] perchè vediamo quante col ha in una riga, (-1) perchè parte da 0
  if (col < grid[0].length - 1) closestNodes.push(grid[row][col + 1]);
  //down
  if (row < grid.length - 1) closestNodes.push(grid[row + 1][col]);
  //left -> >0 perchè è al bordo sinistro se col = 0
  if (col > 0) closestNodes.push(grid[row][col - 1]);
  //remove the nodes already visited
  return closestNodes.filter(node => !node.isVisited);
}

function updateNodeDistance(nearNodes, currentNode) {
  for (var i = 0; i < nearNodes.length; i++) {
    const node = nearNodes[i];
    //settiamo la distanza dei nodi accanto SE:
    //non è settata OPPURE la distanza è > di quella attuale.
    if (node.distance > currentNode.distance) {
      //console.log(node.row, node.col, node.distance, currentNode.distance + 1);
      node.distance = currentNode.distance + 1;
      //linkiamo il vecchio attuale
      node.prevNode = currentNode;
    }
  }
}

module.exports = Dijkstra;
