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
  const prop1 = (magn - 35) / magn;
  const prop2 = (magn - 50) / magn;
  const x_1p = x2 - (x2 - x1) * prop1;
  const y_1p = y2 - (y2 - y1) * prop1;
  const x_2p = x1 + (x2 - x1) * prop2;
  const y_2p = y1 + (y2 - y1) * prop2;
  return [x_1p, y_1p, x_2p, y_2p];
}

class Category {
  constructor(label, position, color) {
    this.label = label;
    this.position = position;
    this.color = color;
  }

  getLabel() { return this.label; }
  getX() { return this.position[0] * 1.5; }
  getY() { return this.position[1] * 1.5; }
  getID() { return this.getLabel().split(' ').join(''); }
  getColor() { return this.color; }

  highlight() { document.getElementById(this.getID()).classList.add('highlight', 'highlight'+this.getColor()); }
  unHighlight() { document.getElementById(this.getID()).classList.remove('highlight', 'highlight'+this.getColor()); }

  getCategory(map) {
    var categoryEls = []
    for (el in map) {
      var el = map[el];
      if (el.getCategories().includes(this.getLabel())) {
        categoryEls.push(el);
      }
    }
    return categoryEls;
  }

  highlightCategory(map) {
    var category = this.getCategory(map);
    for (el in category) {
      var el = category[el];
      el.highlight(this.getColor());
    }
  }
  unHighlightCategory(map) {
    var category = this.getCategory(map);
    for (el in category) {
      var el = category[el];
      el.unHighlight(this.getColor());
    }
  }

  genNode(map) {
    return `<g class='node category' onmouseover='cats[${map.indexOf(this)}].highlightCategory(els)' onmouseout='cats[${map.indexOf(this)}].unHighlightCategory(els)'>` +
    `<circle cx=${this.getX()} cy=${this.getY()} id=${this.getID()} class="vertice highlight${this.getColor()} highlight"> </circle>` +
    `<text transform="translate(${this.getX()},${this.getY() - 45})" >${this.getLabel()}</text>` +
    "</g>";
  }
}

class Element {
  constructor(label, parents, children, position, categories) {
    this.label = label;
    this.parents = parents;
    this.children = children;
    this.position = position;
    this.categories = categories;
  }

  getLabel() { return this.label; }
  getX() { return this.position[0] * 1.5; }
  getY() { return this.position[1] * 1.5; }
  getID() { return this.getLabel().split(' ').join(''); }
  getCategories() { return this.categories; }

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

var cats = [
  new Category("Lower Div Req", [50, 500], "Yellow"),
  new Category("Core Class", [125, 500], "RoyalBlue"),
  new Category("Elective", [200, 500], "Red"),
  new Category("Statistics", [275, 500], "Pinkish"),
  new Category("Data Science", [350, 500], "Purple"),
  new Category("Math", [425, 500], "GrassGreen"),
  new Category("Programming", [500, 500], "Pink"),
]

var els = [
  new Element("Math 1A", [], ["Math 1B"], [100, 50], ["Lower Div Req", "Math"]),
  new Element("Math 1B", ["Math 1A"], ["Math 53", "Math 54", "Stat 20"], [200, 50], ["Lower Div Req", "Math"]),
  new Element("Math 53", ["Math 1B"], ["Stat 134"], [150, 100], ["Lower Div Req", "Math"]),
  new Element("Math 54", ["Math 1B"], ["Stat 135", "Data 100", "Data 102"], [250, 100], ["Lower Div Req", "Math"]),
  new Element("Stat 20", ["Math 1B"], [], [300,50], ["Lower Div Req", "Statistics"]),
  new Element("Stat 133", [], [], [600, 150], ["Programming", "Core Class", "Statistics"]),
  new Element("Stat 134", ["Math 53"], ["Stat 135", "Stat 150", "Stat 155", "Data 102"], [200, 150], ["Lower Div Req", "Statistics", "Core Class"]),
  new Element("Stat 135", ["Math 54", "Stat 134"], ["Stat 151A", "Stat 152", "Stat 153", "Stat 154", "Stat 156", "Stat 158", "Stat 159"], [300, 200], ["Lower Div Req", "Statistics", "Core Class"]),
  new Element("Stat 150", ["Stat 134"], [], [100, 200], ["Statistics", "Elective"]),
  new Element("Stat 155", ["Stat 134"], [], [150, 250], ["Statistics", "Elective"]),
  new Element("Stat 151A", ["Stat 135"], [], [200, 250], ["Statistics", "Elective"]),
  new Element("Stat 152", ["Stat 135"], [], [250, 300], ["Statistics", "Elective"]),
  new Element("Stat 153", ["Stat 135"], [], [300, 350], ["Statistics", "Elective"]),
  new Element("Stat 154", ["Stat 135"], [], [350, 400], ["Statistics", "Elective"]),
  new Element("Stat 156", ["Stat 135"], [], [400, 350], ["Statistics", "Elective"]),
  new Element("Stat 158", ["Stat 135"], [], [450, 300], ["Statistics", "Elective"]),
  new Element("Stat 159", ["Stat 135"], [], [500, 250], ["Statistics", "Elective", "Data Science"]),
  new Element("Stat 33A", [], [], [600, 50], ["Programming", "Statistics"]),
  new Element("Stat 33B", ["CS 61A"], [], [600, 100], ["Programming", "Core Class", "Statistics"]),
  new Element("CS 61A", [], ["Data 100", "Stat 33B"], [500, 50], ["Programming"]),
  new Element("Data 8", [], ["Data 100"], [400, 50], ["Lower Div Req", "Data Science"]),
  new Element("Data 100", ["CS 61A", "Data 8", "Math 54"], ["Data 102"], [450, 125], ["Core Class", "Data Science"]),
  new Element("Data 102", ["Data 100", "Stat 134", "Math 54"], [], [450, 200], ["Elective", "Data Science"])
]

var myJSON = JSON.stringify(els);

let div = document.getElementById("courses");

for (cat in cats) {
  div.innerHTML += cats[cat].genNode(cats);
}

for (el in els) {
  var el = els[el];
  var edges = el.genEdges(els)
  div.innerHTML += el.genNode();
  for (edge in edges) {
    div.innerHTML += edges[edge];
  }
}