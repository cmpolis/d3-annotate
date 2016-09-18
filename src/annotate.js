import {drag} from "d3-drag";
import {event, select} from "d3-selection";

export default function() {
  var keyFn = (_, ndx) => ndx,
      textFn = (d) => d,
      container,
      dx = 0, dy = 0,
      x = (d) => d.pos.x + (d.pos.width / 2),
      y = (d) => d.pos.y + (d.pos.height / 2),
      textAnchor = 'start',
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
    container.classed('d3-an-container', true);
    selection.nodes().forEach((el, ndx) => el.__key__ = keyFn(el.__data__, ndx));
    selection.on('click', function() { appendText(select(this)); });
    if(show) { appendText(selection, true); }
  }

  //
  // add new data bound <text> annotation
  function appendText(sel, filter) {
    var _sel = (show instanceof Function && filter) ? sel.filter(show) : sel,
        _keyFn = (d) => keyFn(d.data),
        _textFn = (d) => textFn(d.data),
        annotationData = _sel.nodes().map((node, ndx) => {
          return {
            data: node.__data__,
            key: node.__key__,
            pos: node.getBBox()
          };
        });

    var textSelection = container.selectAll('text.with-data')
      .data(annotationData, (d) => d.key);
    textSelection.enter().append('text')
      .text(_textFn)
      .attr('class', 'annotation with-data')
      .attr('x', x).attr('y', y)
      .attr('dx', dx).attr('dy', dy)
      .attr('text-anchor', textAnchor)
      .call(dragControl)
      .on('click', function() {
        if(event.metaKey) { this.remove(); }
        else if(event.shiftKey) { _editText(select(this)); }
      });
  }

  //
  // properties
  annotate.container = function() {
    if(arguments.length) {
      container = arguments[0];
      return annotate;
    } else { return container; }
  };
  annotate.text = function() {
    if(arguments.length) {
      textFn = arguments[0];
      return annotate;
    } else { return textFn; }
  };
  annotate.show = function() {
    if(arguments.length) {
      show = arguments[0];
      return annotate;
    } else { return show; }
  };

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

  return annotate;
};
