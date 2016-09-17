# d3-annotate

Interactively and programmatically add, edit, move and save SVG chart annotations

## Installing

If you use NPM, `npm install d3-annotate`. Otherwise, download the [latest release](https://github.com/cmpolis/d3-annotate/releases/latest).

## API Reference (WIP)

```js
var annotation = d3.annoate()
  .key((d) => d.id) // if annotation will be applied to data selection
  .text((d) => `${d.name}: ${d.score}`)
  .show((d) => d.score > 100); // can be true, false or fn
  // TODO: .dx(), .dy(), .canWrite, .canMove, .canDelete

annotation.editMode(true); // enable controls, false by default

var bubbles = d3.selectAll('circle').data(teams, (d) => d.id);
bubbles.enter().append('circle').....

bubbles.call(annotation());
```
