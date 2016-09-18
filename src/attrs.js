// https://github.com/d3/d3-selection-multi/blob/master/src/selection/attrs.js
import {select} from "d3-selection";

function attrsFunction(selection, map) {
  return selection.each(function() {
    var x = map.apply(this, arguments), s = select(this);
    for (var name in x) s.attr(name, x[name]);
  });
}

function attrsObject(selection, map) {
  for (var name in map) selection.attr(name, map[name]);
  return selection;
}

export default function(map) {
  return (typeof map === "function" ? attrsFunction : attrsObject)(this, map);
}
