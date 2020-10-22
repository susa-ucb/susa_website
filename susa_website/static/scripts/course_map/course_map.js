
function mag(x1, y1, x2, y2) {
  return Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
}

function euclideanLine(x1, y1, x2, y2) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const mag = mag(x1, y1, x2, y2) / 2;
  const magA = mag - 35;
  const prop = (mag - 70) / 2;
  const x = mag(x1, y1, cx, cy);
  return 0;
}


class Element {
  constructor(label, parents, children, position) {
    this.label = label;
    this.parents = parents;
    this.children = children;
    this.position = position;
  }

  getLabel() { return this.label; }
  getX() { return this.position[0] * 1.5; }
  getY() { return this.position[1] * 1.5; }
  getID() { return this.getLabel().split(' ').join(''); }
  getParents(map) {
    var parentEls = []
    for (el in map) {
      var el = map[el];
      if (this.parents.includes(el.getLabel())) {
        parentEls.push(el);
      }
    }
    return parentEls;
  }
  getChildren(map) {
    var childrenEls = []
    for (el in map) {
      var el = map[el];
      if (this.children.includes(el.getLabel())) {
        childrenEls.push(el);
      }
    }
    return childrenEls;
  }

  highlightEdge(parent) {
    document.getElementById(parent.getID()+this.getID()).classList.add('highlightEdge');
  }
  highlight() { document.getElementById(this.getID()).classList.add('highlight'); }
  highlightChildren(map) {
    var children = this.getChildren(map);
    for (child in children) {
      var child = children[child];
      child.highlight();
      child.highlightEdge(this);
    }
  }
  highlightParents(map) {
    var parents = this.getParents(map);
    for (parent in parents) {
      var parent = parents[parent];
      parent.highlight();
      parent.highlightParents(map);
      this.highlightEdge(parent);
    }
  }
  highlightPath(map) {
    this.highlight();
    this.highlightChildren(map);
    this.highlightParents(map);
  }

  unHighlight() { document.getElementById(this.getID()).classList.remove('highlight'); }
  unHighlightEdge(parent) {
    document.getElementById(parent.getID()+this.getID()).classList.remove('highlightEdge');
  }
  unHighlightChildren(map) {
    var children = this.getChildren(map);
    var child;
    for (child in children) {
      var child = children[child];
      child.unHighlight();
      child.unHighlightEdge(this);
    }
  }
  unHighlightParents(map) {
    var parents = this.getParents(map);
    for (parent in parents) {
      var parent = parents[parent];
      parent.unHighlight();
      parent.unHighlightParents(map);
      this.unHighlightEdge(parent);
    }
  }
  unHighlightPath(map) {
    this.unHighlight();
    this.unHighlightChildren(map);
    this.unHighlightParents(map);
  }

  genNode() {
    return `<g class='node' onmouseover='els[${els.indexOf(this)}].highlightPath(els)' onmouseout='els[${els.indexOf(this)}].unHighlightPath(els)'>` +
    `<circle r='30' opacity='1' cx=${this.getX()} cy=${this.getY()} fill='grey' id=${this.getID()} class="vertice"> </circle>` +
    `<text text-anchor="middle" transform="translate(${this.getX()},${this.getY()})" opacity="1">${this.getLabel()}</text>` +
    "</g>";
  }

  genEdges(map) {
    var edges = [];
    var children = this.getChildren(map)
    for (child in children) {
      var child = children[child];
      var edge = "<line marker-end='url(#triangle)' style='stroke: #ccc; stroke-width: 1;'" +
      `x1="${this.getX()}" y1="${this.getY()}" x2="${child.getX()}" y2="${child.getY()}"` +
      `opacity="1" id=${this.getID() + child.getID()} class="edge"></line>`;
      edges.push(edge);
    }
    return edges;
  }
}

var els = [];

var els = [new Element("Math 1A", [], ["Math 1B"], [100, 50]),
new Element("Math 1B", ["Math 1A"], ["Math 53", "Math 54", "Stat 20"], [200, 50]),
new Element("Math 53", ["Math 1B"], ["Stat 134"], [150, 100]),
new Element("Stat 20", ["Math 1B"], [], [350,50]),
new Element("Stat 134", ["Math 53"], ["Stat 135", "Stat 150", "Stat 155"], [200, 150]),
new Element("Stat 135", ["Stat 134"], ["Stat 151A", "Stat 152", "Stat 153", "Stat 154", "Stat 156", "Stat 158", "Stat 159"], [300, 200]),
new Element("Stat 150", ["Stat 134"], [], [100, 200]),
new Element("Stat 155", ["Stat 134"], [], [150, 250]),
new Element("Stat 151A", ["Stat 135"], [], [200, 250]),
new Element("Stat 152", ["Stat 135"], [], [250, 300]),
new Element("Stat 153", ["Stat 135"], [], [300, 350]),
new Element("Stat 154", ["Stat 135"], [], [350, 400]),
new Element("Stat 156", ["Stat 135"], [], [400, 350]),
new Element("Stat 158", ["Stat 135"], [], [450, 300]),
new Element("Stat 159", ["Stat 135"], [], [500, 250])
]

let div = document.getElementById("courses");

for (el in els) {
  var el = els[el];
  var edges = el.genEdges(els)
  div.innerHTML += el.genNode();
  for (edge in edges) {
    div.innerHTML += edges[edge];
  }
}
