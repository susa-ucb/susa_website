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

  showDetails() {
    var courseInfo = document.getElementById(`cat-${this.getID()}`).innerHTML;
    activeInfo.innerHTML = courseInfo;
    defaultInfo.classList.add('hidden');
  }

  unShowDetails() {
    activeInfo.innerHTML = null;
    defaultInfo.classList.remove('hidden');
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

  highlightAll(map) {
    this.highlight();
    var departmentEls = this.getDepartment(map);
    for (el in departmentEls) {
      departmentEls[el].highlight();
    }
  }

  unHighlightAll(map) {
    this.unHighlight();
    var departmentEls = this.getDepartment(map);
    for (el in departmentEls) {
      departmentEls[el].unHighlight();
    }
  }

  genNode() {
    return `<g class='node department' onclick='curActive.unHighlightAll(els);curActive=deps[${deps.indexOf(this)}];curActive.highlightAll(els); curActive.showDetails();'>` +
    //<g class='node department' onmouseover='deps[${deps.indexOf(this)}].highlightAll(els)' onmouseout='deps[${deps.indexOf(this)}].unHighlightAll(els)'>` +
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

  highlightAll(map) {
    this.highlight();
    var category = this.getCategory(map);
    for (el in category) {
      var el = category[el];
      el.highlight(this.color);
    }
  }
  unHighlightAll(map) {
    this.unHighlight();
    var category = this.getCategory(map);
    for (el in category) {
      var el = category[el];
      el.unHighlight(this.color);
    }
  }

  genNode(map) {
    return `<g class='node category' onclick='curActive.unHighlightAll(els);curActive=cats[${map.indexOf(this)}];curActive.highlightAll(els); curActive.showDetails();'>` +
    // <g class='node category' onmouseover='cats[${map.indexOf(this)}].highlightAll(els)' onmouseout='cats[${map.indexOf(this)}].unHighlightAll(els)'>` +
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

  isArt(){
    return true;
  }

  getCategories() { return []; }
  getDepartment() { return [];}

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

  highlightEdge(parent) {
    document.getElementById(parent.getID()+this.getID()).classList.add('highlightEdge');
  }
  unHighlightEdge(parent) {
    document.getElementById(parent.getID()+this.getID()).classList.remove('highlightEdge');
  }

  highlightChildren(map, ref) {
    var children = this.getChildren(map);
    if (!children.includes(ref)) {
      for (child in children) {
        var child = children[child];
        if (child.isArt()) {
          child.highlight();
          child.highlightChildren(els, ref);
        } else {
          child.highlight('Blue');
        }
        child.highlightEdge(this);
      }
    }
  }
  highlightParents(map) {
    var parents = this.getParents(map);
    for (parent in parents) {
      var parent = parents[parent];
      if (parent.isArt()) {
        parent.highlight();
      } else {
        parent.highlight('Green');
      }
      parent.highlightParents(els);
      this.highlightEdge(parent);
    }
  }

  unHighlightChildren(map) {
    var children = this.getChildren(map);
    var child;
    for (child in children) {
      var child = children[child];
      if (child.isArt()) {
        child.unHighlight();
        child.unHighlightChildren(els);
      } else {
        child.unHighlight('Blue');
      }
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

  highlightAll(map) {
    for (el in map) {
      document.getElementById(map[el].getID()).classList.add('focus');
    }
    var edges = document.getElementsByClassName("edge");
    var i;
    for (i = 0; i < edges.length; i++) {
      edges[i].classList.add('focus');
    }
    if (this.isArt()) {
      this.highlight();
      var parents = this.getParents(map);
      for (parent in parents) {
        var parent = parents[parent];
        parent.highlight('Orange');
        parent.highlightParents(map);
        this.highlightEdge(parent);
      }
    } else {
      this.highlight('Orange');
      this.highlightParents(map);
    }
    this.highlightChildren(map, this);
  }
  unHighlightAll(map) {
    for (el in map) {
      document.getElementById(map[el].getID()).classList.remove('focus');
    }
    var edges = document.getElementsByClassName("edge");
    var i;
    for (i = 0; i < edges.length; i++) {
      edges[i].classList.remove('focus');
    }
    if (this.isArt()) {
      this.unHighlight();
      var parents = this.getParents(map);
      for (parent in parents) {
        var parent = parents[parent];
        parent.unHighlight('Orange');
        parent.unHighlightParents(map);
        this.unHighlightEdge(parent);
      }
    } else {
      this.unHighlight('Orange');
      this.unHighlightParents(map);
    }
    this.unHighlightChildren(map);
  }

  genNode() {
    return `<g class='node' onclick='curActive.unHighlightAll(els);curActive=els[${els.indexOf(this)}];curActive.highlightAll(els); curActive.showDetails();'>` +
    //onmouseout='els[${els.indexOf(this)}].unHighlightAll(els); els[${els.indexOf(this)}].unShowDetails()'>` +
    `<circle cx=${this.getX()} cy=${this.getY()} id=${this.getID()} class="vertice art"> </circle>` +
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
      var edge = `<line x1="${this.getX()}" y1="${this.getY()}" x2="${ends[2]}" y2="${ends[3]}"` +
      `id=${this.getID() + child.getID()} class="${edgeClass}"></line>`;
      edges.push(edge);
    }
    return edges;
  }
}

class Element extends Articulation {
  constructor(label, parents, children, fetuses, position, categories, department) {
    super(label, parents, children, fetuses, position);
    this.categories = categories;
    this.department = department;
  }

  isArt() {
    return false;
  }

  getCategories() { return this.categories; }
  getDepartment() { return this.department; }

  genNode() {
    return `<g class='node' onclick='curActive.unHighlightAll(els);curActive=els[${els.indexOf(this)}];curActive.highlightAll(els); curActive.showDetails();'>` +
    //onmouseout='els[${els.indexOf(this)}].unHighlightAll(els); els[${els.indexOf(this)}].unShowDetails()'>` +
    `<circle cx=${this.getX()} cy=${this.getY()} id=${this.getID()} class="vertice ${this.getDepartment()}"> </circle>` +
    `<text transform="translate(${this.getX()},${this.getY()+5})" >${this.getLabel()}</text>` +
    "</g>";
  }

  genEdges(map) {
    var edges = [];
    var children = this.getChildren(map)
    for (child in children) {
      var child = children[child];
      var edgeClass = "edge";
      if (child.isArt()) {
        var edge = `<line x1="${this.getX()}" y1="${this.getY()}" x2="${child.getX()}" y2="${child.getY()}"` +
        `id=${this.getID() + child.getID()} class="${edgeClass} art"></line>`
      } else {
        var ends = scaleSegment(this.getX(), this.getY(), child.getX(), child.getY());
        if (this.getFetuses().includes(child.getLabel())) {
          edgeClass += " opt-edge"
        }
        var edge = `<line x1="${ends[0]}" y1="${ends[1]}" x2="${ends[2]}" y2="${ends[3]}"` +
        `id=${this.getID() + child.getID()} class="${edgeClass}"></line>`;
      }
      edges.push(edge);
    }
    return edges;
  }
}
