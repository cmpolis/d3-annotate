import {drag} from "d3-drag";
import {event, select} from "d3-selection";

export default function() {
  var keyFn = (_, ndx) => ndx,
      textFn = (d) => d,
      container,
      x = (d) => d.box.x + (d.box.width / 2),
      y = (d) => d.box.y + (d.box.height / 2),
      textAnchor = 'middle',
      show = true,
      dragControl = drag()
        .on("start", function() { this.classList.add('dragging'); })
        .on("end", function() { this.classList.remove('dragging'); })
        .on("drag", function () {
          var el = select(this);
          el.attr('x', +el.attr('x') + event.dx);
          el.attr('y', +el.attr('y') + event.dy);
        });

  //
  // serialize keys, bind click to add text, add text if `show` is T or fn
  function annotate(selection) {
    selection.nodes().forEach((el, ndx) => el.__key__ = keyFn(el.__data__, ndx));
    selection.on('click', function() { appendText(select(this)); });
    if(show) { appendText(selection, true); }
  }

  //
  // add new data bound <text> annotation
  function appendText(sel, filter) {
    var _sel = (show instanceof Function && filter) ? sel.filter(show) : sel,
        _textFn = (d) => textFn(d.data),
        annotationData = _sel.nodes().map((node) => {
          return { data: node.__data__, key: node.__key__, box: node.getBBox() };
        });

    var textSelection = container.selectAll('text.with-data')
      .data(annotationData, (d) => d.key);
    textSelection.enter().append('text')
      .text(_textFn)
      .attr('class', 'annotation with-data')
      .attr('x', x).attr('y', y)
      .attr('text-anchor', textAnchor)
      .call(dragControl)
      .on('click', function() {
        if(event.metaKey) { this.remove(); }
        else if(event.shiftKey) { _editText(select(this)); }
      });
  }


  //
  // text editor
  function _editText(el) {
    select('body').append('input')
      .attr('type', 'text')
      .attr('class', 'd3-an-text-edit')
      .attr('value', el.text())
      .on('keyup', function() { event.keyCode === 13 && this.blur(); }) // ESC
      .on('focusout', function() { el.text(this.value) && this.remove(); })
      .node().focus();
  }

  //
  // return serialize pojo of annotations
  annotate.serialize = function() {
    return container.selectAll('text.with-data').nodes().map(function(node) {
      var nodeSel = d3.select(node);
      return {
        x: nodeSel.attr('x'),
        y: nodeSel.attr('y'),
        key: node.__data__.key,
        text: nodeSel.text()
      };
    });
  }

  //
  // TODO: add annotations from object


  //
  // properties
  annotate.container = function(_) {
    if(!arguments.length) return container;
    container = _;
    container.classed('d3-an-container', true);
    return annotate;
  };
  annotate.text = function(_) {
    if(!arguments.length) return text;
    textFn = _; return annotate;
  };
  annotate.key = function(_) {
    if(!arguments.length) return keyFn;
    keyFn = _; return annotate;
  };
  annotate.show = function(_) {
    if(!arguments.length) return show;
    show = _; return annotate;
  };
  annotate.textAnchor = function(_) {
    if(!arguments.length) return textAnchor;
    textAnchor = _; return annotate;
  };
  annotate.x = function(_) {
    if(!arguments.length) return x;
    x = _; return annotate;
  };
  annotate.y = function(_) {
    if(!arguments.length) return y;
    y = _; return annotate;
  };

  return annotate;
};
