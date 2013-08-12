dashboardScaffold
=================

Plumbing for creating configurable visualization dashboards with D3.js.

![An example dashboard](http://farm6.staticflickr.com/5532/9449466691_6c55d58033_z.jpg "Example Dashboard")

Check out the [example project](https://github.com/curran/dashboardScaffoldExample).

[Try it out!](http://curran.github.io/dashboardScaffoldExample/v0.1.0/index.html)

Features include:

 * A nested box layout using D3.js and CSS to position divs
 * A system that synchronizes visualization dashboards with a JSON-based configuration
 * An editor system that uses CodeMirror and Inlet to dynamically configure visualization dashboards

In addition, the following standalone [AMD](http://requirejs.org/docs/whyamd.html) modules are included:

 * `getterSetters` A module that generates getter-setter functions (in the style of [Mike Bostock's Toward Reusable Charts](http://bost.ocks.org/mike/chart/)). The generated functions also emit 'change' events when changed (using [Backbone Events](http://backbonejs.org/#Events).
   * `getterSetters.connect(a, b)` provides a simple API for assembling data flow networks based on the getter-setter-with-events pattern. This can be used to create visualization dashboards with multiple linked views.
 * `loadCSS` A module that dynamically loads CSS files into the page (inspired by the [Require.js advice on loading CSS](http://requirejs.org/docs/faq-advanced.html#css).

# Usage

## Require.js Configuration

Configure the package and its dependencies  with [Require.js](http://requirejs.org/docs/api.html#packages). Dependencies include:

 * [D3](d3js.org)
 * [Underscore](http://underscorejs.org/)
 * [Backbone](http://backbonejs.org/)
 * [CodeMirror](http://codemirror.net/)
 * [Inlet](https://github.com/enjalot/Inlet)

See the [Require.js configuration file in the example project](https://github.com/curran/dashboardScaffoldExample/blob/gh-pages/requireConfig.js) for a working configuration.

You can configure Require.js to use the modules hosted with GitHub Pages:

 * `var dashboardScaffoldDir = 'http://curran.github.io/dashboardScaffold/v0.1.1';`

If you use Bower, you can configure Require.js to use the installed modules:

 * `var dashboardScaffoldDir = '../bower_components/dashboardScaffold';`

## Installation with [Bower](https://github.com/bower/bower)

`bower install dashboardScaffold`

You can declare dashboardScaffold as a Bower dependency in your `bower.json` as follows (this file wil be automatically created and filled in if you run `bower init`):

```javascript
{
  "name": "myNeatoProjectThatUsesDashboardScaffold",
  "version": "0.1.0",
  "dependencies": {
    "dashboardScaffold": "git://github.com/curran/dashboardScaffold.git#~0.1.1"
  }
}
```

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
     * The 'module' property corresponds to the name of a javascript file (more precicely, the name of the AMD module) that implements the component.
     * All other options are passed into the component by calling its corresponding setter-getter functions (on initialization and on update).
