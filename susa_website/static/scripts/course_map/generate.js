var defaultInfo = document.getElementById('default-info');
var activeInfo = document.getElementById('active-info');

var div = document.getElementById("courses");

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

var curActive = els[0];
