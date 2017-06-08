# Notes

## Multiple transformation in SVG group elements are applied from right to left

_Opened by [Colin Peh](https://github.com/GitHubStig)_

According to https://www.dashingd3js.com/svg-group-element-and-d3js
> The SVG Transform Attribute applies a list of transformations to an element and it's children.
> Each transform definition is separated by white space and or commas.

Example given:

```
<g transform="translate(...) scale(...) rotate(...) translate(...) rotate(...)">
```
> The transformations are applied from right to left.
> They are applied right to left because they are treated as nested transforms.

I know it's not an issue and to keep things simple it's not handled. But just leaving it here since I found it quite interesting.
