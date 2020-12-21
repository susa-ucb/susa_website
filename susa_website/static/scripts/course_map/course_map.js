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
  const prop2 = (magn - 45) / magn;
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
  getX() { return this.position[0]+200; }
  getY() { return this.position[1]+125; }
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
    return `<g class='node department' onmouseover='deps[${deps.indexOf(this)}].highlightDepartment(els)' onmouseout='deps[${deps.indexOf(this)}].unHighlightDepartment(els)'>` +
    `<circle cx=${this.getX()} cy=${this.getY()} id=${this.getID()} class="vertice ${this.getLabel()}"> </circle>` +
    `<text transform="translate(${this.getX()},${this.getY()-30})" >${this.getLabel()}</text>` +
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

class Articulation extends Node {
  constructor(label, parents, children, fetuses, position) {
    super(label, position)
    this.parents = parents;
    this.children = children;
    this.fetuses = fetuses;
  }

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
  getFetuses() { return this.fetuses; }

  legHighlight(color) { super.highlight(color); }
  legUnHighlight(color) { super.unHighlight(color); }

  highlight(color) {
    if (typeof color == "undefined") {
      document.getElementById(this.getID()).classList.add('highlightSquare');
    } else {
      document.getElementById(this.getID()).classList.add('highlightSquare');
    }
  }
  unHighlight(color) {
    if (typeof color == "undefined") {
      document.getElementById(this.getID()).classList.remove('highlightSquare');
    } else {
      document.getElementById(this.getID()).classList.remove('highlightSquare');
    }
  }

  highlightEdge(parent) {
    document.getElementById(parent.getID()+this.getID()).classList.add('highlightEdge');
  }
  unHighlightEdge(parent) {
    document.getElementById(parent.getID()+this.getID()).classList.remove('highlightEdge');
  }
}

class Element extends Articulation {
  constructor(label, parents, children, fetuses, position, categories, department) {
    super(label, parents, children, fetuses, position);
    this.categories = categories;
    this.department = department;
  }

  getCategories() { return this.categories; }
  getDepartment() { return this.department; }

  highlight(color) { super.legHighlight(color); }
  highlightChildren(map) {
    var children = this.getChildren(map);
    for (child in children) {
      var child = children[child];
      child.highlight('Blue');
      child.highlightEdge(this);
    }
  }
  highlightParents(map, referred) {
    var parents = this.getParents(map);
    for (parent in parents) {
      var parent = parents[parent];
      parent.highlight('Green');
      if (referred != parent) {
      parent.highlightParents(map, referred);
    } else {
      console.log("conflict", referred, parent);
    }
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
    this.highlightParents(map, this);
  }

  unHighlight(color) { super.legUnHighlight(color); }
  unHighlightChildren(map) {
    var children = this.getChildren(map);
    var child;
    for (child in children) {
      var child = children[child];
      child.unHighlight('Blue');
      child.unHighlightEdge(this);
    }
  }
  unHighlightParents(map, referred) {
    var parents = this.getParents(map);
    for (parent in parents) {
      var parent = parents[parent];
      parent.unHighlight('Green');
      if (referred != parent) {
      parent.unHighlightParents(map, parent);
      } else {
        console.log("conflict", referred, parent);
      }
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
    this.unHighlightParents(map, this);
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
      var edgeClass = "edge";
      if (this.getFetuses().includes(child.getLabel())) {
        edgeClass += " opt-edge"
      }
      var edge = `<line x1="${ends[0]}" y1="${ends[1]}" x2="${ends[2]}" y2="${ends[3]}"` +
      `id=${this.getID() + child.getID()} class="${edgeClass}"></line>`;
      edges.push(edge);
    }
    return edges;
  }
}

function circle_gen(center, radius) {
  const cx = center[0]
  const cy = center[1]
  function circle_coord(rad_frac) {
    const deg = Math.PI * rad_frac
    return [cx + Math.cos(deg) * radius, cy - Math.sin(deg) * radius]
  }
  return circle_coord
}

var department_circ = circle_gen([850, 250], 45);

var deps = [
  new Department("Statistics", department_circ(1/2), "Pinkish"),
  new Department("Data", department_circ(7/6), "Purple"),
  new Department("Math", department_circ(-1/6), "GrassGreen")
]

var cat_circ = circle_gen([850, 425], 80);

var cats = [
  new Category("Lower Div Req", cat_circ(1/4)),
  new Category("Core Class", cat_circ(3/4)),
  new Category("Elective", cat_circ(5/4)),
  new Category("Programming", cat_circ(7/4))
]

var stat_135_circ = circle_gen([350, 300], 200)
var stat_135_circ2 = circle_gen([350, 300], 125)
var stat_134_circ = circle_gen([55, 250], 150)
var math_1a_circ = circle_gen([0, 0], 125)
var math_1a_circ2 = circle_gen([0, 0], 250)
var math_1b_circ = circle_gen(math_1a_circ(-3/8), 125)
var math_1b_circ2 = circle_gen(math_1a_circ(-3/8), 250)
var data_c8_circ = circle_gen([425, 50], 175)
var data_c100_circ = circle_gen(data_c8_circ(-7/16), 175)
var elective_circ = circle_gen([400, 75], 600)

var els = [
  new Element("1A", [], ["C131A", "1B", "20", "88"], [], [0, 0], ["Lower Div Req"], "Math"),
  new Element("1B", ["1A"], ["89A","53", "54", "55", "134", "C140"], ["20"], math_1a_circ(-3/8), ["Lower Div Req"], "Math"),
  new Element("53", ["1B"], ["134", "C140", "154"], ["134", "C140"], math_1b_circ(13/8), ["Lower Div Req"], "Math"),
  new Element("54", ["1B"], ["135", "C100", "C102", "C140"], [], math_1b_circ(15/8), ["Lower Div Req"], "Math"),
  new Element("55", ["1B"], ["154"], ["154"], math_1b_circ(11/8), [], "Math"),
  new Element("C8", [], ["C131A", "89A","C100", "C140", "88"], [], [425, 25], ["Lower Div Req"], "Data"),
  new Element("20", ["1A"], ["C131A", "C140"], [], math_1a_circ2(0), ["Lower Div Req"], "Statistics"),
  new Element("33A", [], ["C131A"], ["C131A"], [750, 0], ["Programming"], "Statistics"),
  new Element("33B", ["61A"], [], [], [750, 100], ["Programming", "Core Class"], "Statistics"),
  new Element("61A", [], ["C100", "33B", "C140"], [], [600, 0], ["Programming"]),
  new Element("88", ["1A", "C8"], ["C8"], [], data_c8_circ(5/4), [], "Statistics"),
  new Element("89A", ["1B", "C8"], ["135", "C100", "C102", "C140", "C8"], ["C8"], math_1b_circ(17/8), [], "Statistics"),
  new Element("C100", ["61A", "C8", "54", "89A"], ["C102", "C140", "54", "89A"], [], data_c8_circ(-7/16), ["Core Class"], "Data"),
  new Element("C102", ["C100", "134", "54", "C140", "89A"], ["151A"], [], data_c100_circ(12.5/8), ["Elective"], "Data"),
  new Element("C131A", ["33A", "133", "C8", "20", "1A"], ["33A", "133"], ["33A", "133"], data_c8_circ(-3/16), [], "Data"),
  new Element("133", [], ["C131A", "159", "151A", "152", "153", "158", "135"], ["C131A", "158", "152", "151A", "153","135"], [525, 500], ["Programming", "Core Class"], "Statistics"),
  new Element("134", ["53", "1B"], ["135", "150", "155", "C102", "152", "153"], [], math_1b_circ2(12/8), ["Lower Div Req", "Core Class"], "Statistics"),
  new Element("135", ["54", "89A", "134", "C140", "133"], ["151A", "152", "153", "154", "156", "157", "158", "159", "133"], ["152", "153", "133"], [325, 500], ["Lower Div Req", "Core Class"], "Statistics"),
  new Element("C140", ["54", "53", "C8", "C100", "20", "61A", "89A", "1B"], ["135", "150", "155", "C102", "54", "89A"], [], data_c100_circ(9.5/8), ["Lower Div Req", "Core Class"], "Data"),
  new Element("150", ["134", "C140"], [], [], elective_circ(9.7/8), ["Elective"], "Statistics"),
  new Element("151A", ["135", "C102", "133"], [], [], elective_circ(10.5/8), ["Elective"], "Statistics"),
  new Element("152", ["135", "133", "134"], [], [], elective_circ(10.9/8), ["Elective"], "Statistics"),
  new Element("153", ["134", "133", "135"], [], [], elective_circ(11.3/8), ["Elective"], "Statistics"),
  new Element("154", ["135", "53", "55"], [], [], elective_circ(11.7/8), ["Elective"], "Statistics"),
  new Element("155", ["134", "C140"], [], [], elective_circ(10.1/8), ["Elective"], "Statistics"),
  new Element("156", ["135"], [], [], elective_circ(12.1/8), ["Elective"], "Statistics"),
  new Element("157", ["135"], [], [], elective_circ(12.5/8), ["Elective"], "Statistics"),
  new Element("158", ["135", "133"], ["135"], [], elective_circ(12.9/8), ["Elective"], "Statistics"),
  new Element("159", ["135", "133"], [], [], elective_circ(13.3/8), ["Elective"], "Statistics")
]

let div = document.getElementById("courses");

for (dep in deps) {
  div.innerHTML += deps[dep].genNode(deps);
}

for (cat in cats) {
  div.innerHTML += cats[cat].genNode(cats);
}

for (el in els) {
  var edges = els[el].genEdges(els)
  for (edge in edges) {
    div.innerHTML += edges[edge];
  }
}

for (el in els) {
  div.innerHTML += els[el].genNode();
}
