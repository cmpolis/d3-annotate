import {drag} from "d3-drag";
import {event, select, selection} from "d3-selection";

// hacky :( could not get rollup to play nice with d3-selection-multi. << TODO
// import "d3-selection-multi";
import selection_attrs from "./attrs";
selection.prototype.attrs = selection_attrs;

export default function() {
  var keyFn = (_, ndx) => ndx,
      textFn = (d) => d,
      getKey = (d) => d.key,
      container,
      saved,
      mapAnnotationData = (node) => {
        return { data: node.__data__,
                 key: node.__key__,
                 box: node.getBBox() }; },
      displayAttrs = {
        x: (d) => d.box.x + (d.box.width / 2),
        y: (d) => d.box.y + (d.box.height / 2),
        'text-anchor': 'middle'
      },
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
  // svg.selectAll('.city').call(annotation) ->
  function annotate(_selection) {

    // serialize keys for saving/joining
    _selection.nodes().forEach((el, ndx) => {
      el.__key__ = keyFn(el.__data__, ndx).toString() });

    // click selection el to create annotation
    _selection.on('click', function() { appendText(select(this)); });

    // prepopulate and/or add saved annotations
    if(show) { appendText(_selection, true); }
    if(saved) { appendTextFromData(_selection, saved); }
  }

  //
  //
  function buildAnnotation(sel) {
    sel.attr('class', 'annotation with-data')
      .attrs(displayAttrs)
      .call(dragControl)
      .on('click', function() {
        if(event.metaKey) { this.remove(); }
        else if(event.shiftKey) { _editText(select(this)); }
      });
  }

  //
  // add new data bound <text> annotation
  function appendText(sel, filter) {
    var _sel = (show instanceof Function && filter) ? sel.filter(show) : sel,
        _textFn = (d) => textFn(d.data),
        annotationData = _sel.nodes().map(mapAnnotationData);

    var textSel = container.selectAll('text.with-data').data(annotationData, getKey);
    textSel.enter().append('text')
      .text(_textFn)
      .call(buildAnnotation);
  }
  function appendTextFromData(sel) {
    var savedKeys = Object.keys(saved),
        savedNodes = sel.filter(function() {
          return savedKeys.indexOf(this.__key__) !== -1; }),
        savedData = savedNodes.nodes().map(mapAnnotationData);

    var savedSel= container.selectAll('text.with-data').data(savedData, getKey);
    savedSel.enter().append('text').call(buildAnnotation)
      .merge(savedSel)
        .text((d) => saved[d.key].text)
        .attr('x', (d) => saved[d.key].x)
        .attr('y', (d) => saved[d.key].y);
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
    var annotations = {};
    container.selectAll('text.with-data').each(function() {
      var sel = d3.select(this);
      annotations[this.__data__.key] = {
        x: sel.attr('x'),
        y: sel.attr('y'),
        text: sel.text()
      };
    });
    return annotations;
  };

  //
  // properties
  annotate.container = function(_) {
    if(!arguments.length) return container;
    container = _;
    container.classed('d3-an-container', true);
    return annotate;
  };

  // TODO:
  //  - handle Array for dataless annotation
  //  - joining multiple .saved() calls
  annotate.saved = function(_) {
    saved = _;
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
  annotate.attr = function(attrName) {
    if(!attrName) {
      return displayAttrs;
    } else if(arguments.length === 1) {
      return displayAttrs[attrName];
    } else {
      arguments[1] === null ? (delete displayAttrs[attrName]) :
                              (displayAttrs[attrName] = arguments[1]);
      return annotate;
    }
  };

  return annotate;
};
