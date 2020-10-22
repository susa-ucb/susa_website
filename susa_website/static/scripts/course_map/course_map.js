/**
 * Find the magnitude of the segment between two points.
 * @params x1, y1, x2, y2 The coordinates of the points (x1, y1) (x2, y2).
 * @return The magnitude of the segment between the points.
 */
function mag(x1, y1, x2, y2) {
  return Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
}

/**
 * Adjust two points based on a scaling of the segment formed between two points
 * on the center.
 * @params x1, y1, x2, y2 The coordinates of the points (x1, y1) (x2, y2).
 * @return The points of the rescaled line segment.
 */
function scaleSegment(x1, y1, x2, y2) {
  const magn = mag(x1, y1, x2, y2);
  const prop = (magn - 40) / magn;
  const dx = (x2 - x1) * prop;
  const dy = (y2 - y1) * prop;
  const x_2p = x1 + dx;
  const y_2p = y1 + dy;
  const x_1p = x2 - dx;
  const y_1p = y2 - dy;
  return [x_1p, y_1p, x_2p, y_2p];
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
  highlight(color) { document.getElementById(this.getID()).classList.add('highlight', 'highlight'+color); }
  highlightChildren(map) {
    var children = this.getChildren(map);
    for (child in children) {
      var child = children[child];
      child.highlight('Blue');
      child.highlightEdge(this);
    }
  }
  highlightParents(map) {
    var parents = this.getParents(map);
    for (parent in parents) {
      var parent = parents[parent];
      parent.highlight('Green');
      parent.highlightParents(map);
      this.highlightEdge(parent);
    }
  }
  highlightPath(map) {
    this.highlight('Orange');
    this.highlightChildren(map);
    this.highlightParents(map);
  }

  unHighlight(color) { document.getElementById(this.getID()).classList.remove('highlight', 'highlight'+color); }
  unHighlightEdge(parent) {
    document.getElementById(parent.getID()+this.getID()).classList.remove('highlightEdge');
  }
  unHighlightChildren(map) {
    var children = this.getChildren(map);
    var child;
    for (child in children) {
      var child = children[child];
      child.unHighlight('Blue');
      child.unHighlightEdge(this);
    }
  }
  unHighlightParents(map) {
    var parents = this.getParents(map);
    for (parent in parents) {
      var parent = parents[parent];
      parent.unHighlight('Green');
      parent.unHighlightParents(map);
      this.unHighlightEdge(parent);
    }
  }
  unHighlightPath(map) {
    this.unHighlight('Orange');
    this.unHighlightChildren(map);
    this.unHighlightParents(map);
  }

  genNode() {
    return `<g class='node' onmouseover='els[${els.indexOf(this)}].highlightPath(els)' onmouseout='els[${els.indexOf(this)}].unHighlightPath(els)'>` +
    `<circle cx=${this.getX()} cy=${this.getY()} id=${this.getID()} class="vertice"> </circle>` +
    `<text transform="translate(${this.getX()},${this.getY()})" >${this.getLabel()}</text>` +
    "</g>";
  }

  genEdges(map) {
    var edges = [];
    var children = this.getChildren(map)
    for (child in children) {
      var child = children[child];
      var ends = scaleSegment(this.getX(), this.getY(), child.getX(), child.getY());
      var edge = `<line x1="${ends[0]}" y1="${ends[1]}" x2="${ends[2]}" y2="${ends[3]}"` +
      `id=${this.getID() + child.getID()} class="edge"></line>`;
      edges.push(edge);
    }
    return edges;
  }
}

var els = [];

els = [new Element("Math 1A", [], ["Math 1B"], [100, 50]),
new Element("Math 1B", ["Math 1A"], ["Math 53", "Math 54", "Stat 20"], [200, 50]),
new Element("Math 53", ["Math 1B"], ["Stat 134"], [150, 100]),
new Element("Math 54", ["Math 1B"], [], [250, 100]),
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
