dashboardScaffold
=================

Plumbing for creating configurable dashboards with D3.js.

[Try it out!](http://curran.github.io/dashboardScaffold/example/index.html)

![An example dashboard](http://farm6.staticflickr.com/5532/9449466691_6c55d58033_z.jpg "Example Dashboard")

When you click on a color or number in the configurator on the left, an interactive editor (color chooser or slider) pops up. When you manipulate the configuration, it is propagated through the dashboard layout to the component visualizations instantly. When you edit properties of the visualizations through their own UI interactions, the configuration JSON is instantly updated.

# Usage

## Installation
Use [Bower](https://github.com/bower/bower) to install:

`bower install dashboardScaffold`

You can declare dashboardScaffold as a Bower dependency in your `bower.json` as follows:

```javascript
{
  "name": "myNeatoProjectThatUsesDashboardScaffold",
  "version": "0.1.0",
  "dependencies": {
    "dashboardScaffold": "git://github.com/curran/dashboardScaffold.git#~0.1.0"
  }
}
```

## Require.js Configuration

Configure the package and its dependencies  with [Require.js](http://requirejs.org/docs/api.html#packages). Dependencies include:

 * [D3](d3js.org)
 * [Underscore](http://underscorejs.org/)
 * [CodeMirror](http://codemirror.net/)
 * [Inlet](https://github.com/enjalot/Inlet)

See the [example project Require.js configuration](example/requireConfig.js).

## API

To wire up a `textArea` to be a configuration editor for a dashboard `div`, use the following call:

```javascript
dashboardScaffold.init('editor', 'dashboard');
```

Here, "editor" and "dashboard" are the ids of the DOM elements to be used.

## Configuration JSON

The call to `init` will load an initial configuration stored in the file `dashboardConfig.json` in the same directory as `index.html`. Key concepts include:

 * 'layout' A tree structure determining the layout of the dashboard components. Inspired by [D3's hierarchy conventions](https://github.com/mbostock/d3/wiki/Hierarchy-Layout#wiki-hierarchy). Each node in the tree should have the following properties:
   * 'size' (Number) The size weight of this node.
   * 'name' (String) The name of this component. Must match a key defined in the 'visualizations' section.
   * 'children' The nodes that will be nested inside this one. Optional.
   * 'orientation' (either 'horizontal' or 'vertical') Determines whether children are places left-right or top-bottom. Only necessary if 'children' has a value.
 * 'visualizations' The configurations for each component in the dashboard.
   * Keys are arbitrary aliases that are used to reference the component in the 'name' property within layout nodes.
   * Values must be objects
     * The 'module' property corresponds to the name of a javascript file that implements the component.
     * All other properties are passed into the `setOptions()` method of the loaded component implementation (on initialization and on update).
