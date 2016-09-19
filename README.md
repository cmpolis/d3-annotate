# d3-annotate

Interactively add, edit, move and save SVG chart annotations.

## Install

If you use NPM, `npm install d3-annotate`. Otherwise, download the [latest release](https://github.com/cmpolis/d3-annotate/releases/latest).

## Interactions

##### Drag to move

![drag](https://raw.githubusercontent.com/cmpolis/d3-annotate/master/d3-annotate-scatter-drag.gif)

##### Click an element from selection to add annotation
![click](https://raw.githubusercontent.com/cmpolis/d3-annotate/master/d3-annotate-scatter-click.gif)

##### Command + Click to remove an annotation
![click](https://raw.githubusercontent.com/cmpolis/d3-annotate/master/d3-annotate-scatter-click-rm.gif)

##### Shift + Click to edit annotation copy _then [Enter] or unfocus text input to save_
![click](https://raw.githubusercontent.com/cmpolis/d3-annotate/master/d3-annotate-scatter-click-edit.gif)

## API

####`d3.annotate()`

Initialize a new annotation behavior.

#### `.container([d3 <g> or <svg> selection])` _(required)_

Sets container to render annotations to. _Note: should have `translate` to match data.

#### `.key([fn])` _`(d) => d.id` by default_

Sets key to be used for serializing annotations and joining annotations with data

#### `.text([fn])` _indentity by default_

Sets the default text for an annotation. _eg:_ ``.text((d) => `${d.name}: ${d.score}`)``

#### `.attr([attrName(eg: x, y, text-anchor, fill)], [value or fn])` (similar to `d3.select(...).attr`)

`.attr` will get called on `<text>` elements created from annotation. However, instead of only having access to the bound data(`d.data`) - you have access to what is returned from `.getBBox()` of the target element (`d.box`), _eg:_

```js
// Place labels to the left of target element (centered vertically and horizontally by default)
.attr('x', (d) => d.box.x)
.attr('text-anchor', 'end')
  
// Color labels based on data in target element
.attr('fill', (d) => palette(d.data.category))
```

#### `.show([boolean or function])`

Create annotations automatically(`true` will create an annotation for every datum)

#### `.saved([annotation object])`

Add object of annotations to be rendered on `.call(annotation)`, created from calling `annotation.serialize()`

#### `.serialize()`

Returns an object of annotations based on current state of annotations.


## Example Usage

```js
// render some chart elements with data
var bubbles = chartArea.selectAll('.bubble').data(cars) ....

var annotation = d3.annotate()
      .continer(chartArea.append('g'))
      .key((d) => d.model + d.year)
      .text((d) => `${d.make} ${d.model}: ${d.mpg} miles per gallon`)
      .show((d) => d.year === 2016) // create annotations only for 2016 models, initially
      .saved({'prius2015':{text:'Most efficient',x:400,y:600}})
      .attr('fill', (d) => makeColors(d.data.make));

d3.selectAll('.bubble').call(annotation); // <text> elements get created
[User interaction to move, edit, rewrite annotations]
JSON.stringify(annotation.serialize()) // can be saved for creating inital annotation state
```


## CSS

To style annotations, use a selector _a la_:

```css
#myChart .d3-an-container .annotation 
```

For a better experience, add the following CSS to your page or CSS build system:

```css
.d3-an-container .annotation { cursor: move; }
.d3-an-container .annotation.dragging {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
  text-decoration: underline; }
.d3-an-text-edit {
  position: fixed;
  top: 40px;
  left: 40px; }
```


### Author

By [@ChrisPolis](https://twitter.com/ChrisPolis)

### License

This project is licensed under the terms of the MIT license.
