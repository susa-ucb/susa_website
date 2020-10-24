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

class Node {
  constructor(label, position) {
    this.label = label;
    this.position = position;
  }

  getLabel() { return this.label; }
  getX() { return this.position[0] * 1.5; }
  getY() { return (this.position[1] + 50) * 1.5; }
  getID() { return this.getLabel().split(' ').join(''); }

  highlight(color) {
    if (typeof color == "undefined") {
      document.getElementById(this.getID()).classList.add('highlight');
    } else {
      document.getElementById(this.getID()).classList.add('highlight', 'highlight' + color);
    }
  }
  unHighlight(color) {
    if (typeof color == "undefined") {
      document.getElementById(this.getID()).classList.remove('highlight');
    } else {
      document.getElementById(this.getID()).classList.remove('highlight', 'highlight' + color);
    }
  }
}

class Department extends Node {
  constructor(label, position, color) {
    super(label, position);
    this.color = color;
  }

  highlight() { super.highlight(); }
  unHighlight() { super.unHighlight(); }

  getDepartment(map) {
    var departmentEls = []
    for (el in map) {
      var el = map[el];
      if (el.getDepartment() == this.getLabel()) {
        departmentEls.push(el);
      }
    }
    return departmentEls;
  }

  highlightDepartment(map) {
    this.highlight();
    var departmentEls = this.getDepartment(map);
    for (el in departmentEls) {
      departmentEls[el].highlight();
    }
  }

  unHighlightDepartment(map) {
    this.unHighlight();
    var departmentEls = this.getDepartment(map);
    for (el in departmentEls) {
      departmentEls[el].unHighlight();
    }
  }

  genNode() {
    return `<g class='node' onmouseover='deps[${deps.indexOf(this)}].highlightDepartment(els)' onmouseout='deps[${deps.indexOf(this)}].unHighlightDepartment(els)'>` +
    `<circle cx=${this.getX()} cy=${this.getY()} id=${this.getID()} class="vertice ${this.getLabel()}"> </circle>` +
    `<text transform="translate(${this.getX()},${this.getY()+5})" >${this.getLabel()}</text>` +
    "</g>";
  }

}

class Category extends Node {
  constructor(label, position) {
    super(label, position);
    this.color = "Orange";
  }

  highlight() { super.highlight(this.color); }
  unHighlight() { super.unHighlight(this.color); }

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
    this.highlight();
    var category = this.getCategory(map);
    for (el in category) {
      var el = category[el];
      el.highlight(this.color);
    }
  }
  unHighlightCategory(map) {
    this.unHighlight();
    var category = this.getCategory(map);
    for (el in category) {
      var el = category[el];
      el.unHighlight(this.color);
    }
  }

  genNode(map) {
    return `<g class='node category' onmouseover='cats[${map.indexOf(this)}].highlightCategory(els)' onmouseout='cats[${map.indexOf(this)}].unHighlightCategory(els)'>` +
    `<circle cx=${this.getX()} cy=${this.getY()} id=${this.getID()} class="vertice"> </circle>` +
    `<text transform="translate(${this.getX()},${this.getY() - 30})" >${this.getLabel()}</text>` +
    "</g>";
  }
}

class Element extends Node {
  constructor(label, parents, children, position, categories, department) {
    super(label, position);
    this.parents = parents;
    this.children = children;
    this.categories = categories;
    this.department = department;
  }

  getCategories() { return this.categories; }
  getDepartment() { return this.department; }

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
  highlight(color) { super.highlight(color); }
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
    for (el in map) {
      document.getElementById(map[el].getID()).classList.add('focus');
    }
    var edges = document.getElementsByClassName("edge");
    var i;
    for (i = 0; i < edges.length; i++) {
      edges[i].classList.add('focus');
    }
    this.highlight('Orange');
    this.highlightChildren(map);
    this.highlightParents(map);
  }

  unHighlight(color) { super.unHighlight(color); }
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
    for (el in map) {
      document.getElementById(map[el].getID()).classList.remove('focus');
    }
    var edges = document.getElementsByClassName("edge");
    var i;
    for (i = 0; i < edges.length; i++) {
      edges[i].classList.remove('focus');
    }
    this.unHighlight('Orange');
    this.unHighlightChildren(map);
    this.unHighlightParents(map);
  }

  genNode() {
    return `<g class='node' onmouseover='els[${els.indexOf(this)}].highlightPath(els)' onmouseout='els[${els.indexOf(this)}].unHighlightPath(els)'>` +
    `<circle cx=${this.getX()} cy=${this.getY()} id=${this.getID()} class="vertice ${this.getDepartment()}"> </circle>` +
    `<text transform="translate(${this.getX()},${this.getY()+5})" >${this.getLabel()}</text>` +
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

var deps = [
  new Department("Statistics", [600/1.5, 450], "Pinkish"),
  new Department("Data", [700/1.5, 450], "Purple"),
  new Department("Math", [800/1.5, 450], "GrassGreen")
]

var cats = [
  new Category("Lower Div Req", [200/1.5, 450]),
  new Category("Core Class", [300/1.5, 450]),
  new Category("Elective", [400/1.5, 450]),
  new Category("Programming", [500/1.5, 450]),
]

var els = [
  new Element("1A", [], ["1B"], [100, 50], ["Lower Div Req"], "Math"),
  new Element("1B", ["1A"], ["53", "54", "20"], [200, 50], ["Lower Div Req"], "Math"),
  new Element("53", ["1B"], ["134", "C140"], [150, 125], ["Lower Div Req"], "Math"),
  new Element("54", ["1B"], ["135", "C100", "C102", "C140"], [250, 125], ["Lower Div Req"], "Math"),
  new Element("20", ["1B"], ["C140"], [300,50], ["Lower Div Req"], "Statistics"),
  new Element("133", [], ["159"], [600, 170], ["Programming", "Core Class"], "Statistics"),
  new Element("134", ["53"], ["135", "150", "155", "C102"], [200, 200], ["Lower Div Req", "Core Class"], "Statistics"),
  new Element("135", ["54", "134", "C140"], ["151A", "152", "153", "154", "156", "158", "159"], [500/1.5, 250], ["Lower Div Req", "Core Class"], "Statistics"),
  new Element("150", ["134", "C140"], [], [0 + 83+50, 260], ["Elective"], "Statistics"),
  new Element("155", ["134", "C140"], [], [50+ 83+50, 300], ["Elective"], "Statistics"),
  new Element("151A", ["135"], [], [100+ 83+50, 330], ["Elective"], "Statistics"),
  new Element("152", ["135"], [], [150+ 83+50, 350], ["Elective"], "Statistics"),
  new Element("153", ["135"], [], [200+ 83+50, 360], ["Elective"], "Statistics"),
  new Element("154", ["135"], [], [250+ 83+50, 350], ["Elective"], "Statistics"),
  new Element("156", ["135"], [], [300+ 83+50, 330], ["Elective"], "Statistics"),
  new Element("158", ["135"], [], [350+ 83+50, 300], ["Elective"], "Statistics"),
  new Element("159", ["135", "133"], [], [400+ 83 +50, 260], ["Elective"], "Statistics"),
  new Element("33A", [], [], [600, 50], ["Programming"], "Statistics"),
  new Element("33B", ["61A"], [], [600, 110], ["Programming", "Core Class"], "Statistics"),
  new Element("61A", [], ["C100", "33B", "C140"], [500, 50], ["Programming"]),
  new Element("C8", [], ["C100", "C140"], [400, 50], ["Lower Div Req"], "Data"),
  new Element("C100", ["61A", "C8", "54"], ["C102", "C140"], [450, 125], ["Core Class"], "Data"),
  new Element("C102", ["C100", "134", "54", "C140"], [], [450, 200], ["Elective"], "Data"),
  new Element("C140", ["54", "53", "C8", "C100", "20", "61A"], ["135", "150", "155", "C102"], [315, 175], ["Lower Div Req", "Core Class"], "Data")
]

let div = document.getElementById("courses");

for (dep in deps) {
  div.innerHTML += deps[dep].genNode(deps);
}

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
