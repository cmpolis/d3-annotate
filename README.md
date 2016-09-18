# d3-annotate

Interactively and programmatically add, edit, move and save SVG chart annotations

## Installing

If you use NPM, `npm install d3-annotate`. Otherwise, download the [latest release](https://github.com/cmpolis/d3-annotate/releases/latest).

## API Reference (WIP)

```js
var annotation = d3.annoate()
  .container(svg.append('g')) // parent of annotation <text> elements
  .key((d) => d.id) // must be serializable, array index by default(a la d3.data)
  .text((d) => `${d.name}: ${d.score}`)
  .show((d) => d.score > 100); // can be true, false or fn
  .attr('dx', 10)
  .attr('text-anchor', 'start'); // .attr calls cary over to <text>

// TODO
annotation.editMode(true); // enable controls, true by default

var bubbles = d3.selectAll('circle').data(teams);
bubbles.enter().append('circle').....

bubbles.call(annotation);
```
