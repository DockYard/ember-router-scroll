# ember-router-scroll

[![Build Status](https://travis-ci.org/dollarshaveclub/ember-router-scroll.svg?branch=master)](https://travis-ci.org/dollarshaveclub/ember-router-scroll) [![Greenkeeper badge](https://badges.greenkeeper.io/dollarshaveclub/ember-router-scroll.svg)](https://greenkeeper.io/)

> Scroll to page top on transition, like a non-SPA website. An alternative scroll behavior for Ember applications.

## Installation

```
ember install ember-router-scroll
```

### Options
You can specify the id of an element for which the scroll position is saved and set. Default is `window` for using the scroll position of the whole viewport. You can pass an options object in your application's `config/environment.js` file.

```javascript
ENV['routerScroll'] = {
  scrollElement: '#mainScrollElement'
};
```

### A small note

Like all good ember addons, this behavior was considered for core implementation. Good news, people like the idea. For now, the feature will live under the flag `ember-unique-location-history-state` until it's finally released in Ember 2.13. You can follow along for yourself [here](https://github.com/emberjs/ember.js/pull/14011/) and read up on the [RFC](https://github.com/emberjs/rfcs/pull/186#issuecomment-271416805) if you'd like as well.

## A working example
See [demo](https://dollarshaveclub.github.io/router-scroll-demo/) and [repo](https://github.com/dollarshaveclub/router-scroll-demo) made by [Jon Chua](https://github.com/Chuabacca/).

## A visual demo

### Before
![before-scroll](https://cloud.githubusercontent.com/assets/4430436/17122972/0a1fe454-5295-11e6-937f-f1f5beab9d6b.gif)

Notice that the in the full purple page, the user is sent to the **middle** of the page.

### After
![after-scroll](https://cloud.githubusercontent.com/assets/4430436/17122970/07c1a3a0-5295-11e6-977f-37eb955d95b1.gif)

Notice that the in the full purple page, the user is sent to the **top** of the page.

## Why Use it?

Ember expects an application to be rendered with nested views. The default behavior is for the scroll position to be preserved on every transition. However, not all Ember applications use nested views. For these applications, a user would expect to see the top of the page on most transitions.

In addition to scrolling to the top of the page on most transitions, a user would expect the scroll position to be preserved when using the back or forward browser buttons.

**ember-router-scroll** makes your single page application feel more like a regular website.

## Usage

1. Install addon

```bash
ember install ember-router-scroll
```

2. Import ember-router-scroll

In your app/router.js file, import the mixin:

```javascript
import RouterScroll from 'ember-router-scroll';
```

And add RouterScroll as an extension to your Router object:

```javascript
const Router = Ember.Router.extend(RouterScroll, {});
```

3. Update your app's `locationType`

Edit `config/environment.js` and change `locationType`.
Also add `historySupportMiddleware: true,` to get live-reload working in nested routes. (See [Issue #21](https://github.com/dollarshaveclub/ember-router-scroll/issues/21))

```js
locationType: 'router-scroll',
historySupportMiddleware: true,
```

This location type inherits from Ember's `HistoryLocation`.

4. Tests
In your router and controller tests, add `'service:router-scroll'` and `'service:scheduler'` as dependencies in the `needs: []` block:

```js
//{your-app}}/tests/unit/routes/{{your-route}}.js
needs:[ 'service:router-scroll', 'service:scheduler' ],
```

## Issues with nested routes

### Before:
![before-preserve](https://cloud.githubusercontent.com/assets/4430436/17122971/0a1e34ce-5295-11e6-8d30-9f687dd69dbb.gif)

Notice the unwanted scroll to top in this case.

### After:
![after-preserve](https://cloud.githubusercontent.com/assets/4430436/17122969/07acbb48-5295-11e6-9900-f9ba519affa4.gif)

Adding a query parameter or controller property fixes this issue.

### preserveScrollPosition with queryParams

In certain cases, you might want to have certain routes preserve scroll position when coming from a specific location. For example, inside your application, there is a way to get to a route where the user expects scroll position to be preserved (such as a tab section).

1. Add query param in controller

Add `preserveScrollPosition` as a queryParam in the controller for the route that needs to preserve the scroll position.

Example:

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    'preserveScrollPosition',
  ],
});
```

2. Pass in query param

Next, in the place where a transition is triggered, pass in `preserveScrollPosition=true`. For example

```handlebars
{{link-to "About Tab" 'tab.about' (query-params preserveScrollPosition=true) }}
```

### preserveScrollPosition wiith a controller property

In other cases, you may have certain routes that always preserve scroll position, or routes where the controller can decide when to preserve scroll position. For instance, you may have some nested routes that have true nested UI where preserving scroll position is expected. Or you want a particular route to start off with the default scroll-to-top behavior but then preserve scroll position when query params change in reponse to user interaction. Using a conroller property also allows the use of preserveScrollPosition without adding this to the query params.


1. Add query param to controller

Add `preserveScrollPosition` as a controller property for the route that needs to preserve the scroll position.
In this example we have `preserveScrollPosition` initially set to false so that we get our normal scroll-to-top behavior when the route loads. Later on, when an action triggers a change to the `filter` query param, we also set `preserveScrollPosition` to true so that this user interaction does not trigger the scroll-to-top behavior.

Example:

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['filter'],

  preserveScrollPosition: false,

  actions: {
    changeFilter(filter) {
      this.set('preserveScrollPosition', true);
      this.set('filter', filter);
    }
  }
});
```

2. Reset preserveScrollPosition if necessary

If your controller is changing the preserveScrollPosition property, you'll probably need to reset `preserveScrollPosition` back to the default behavior whenever the controller is reset. This is not necceary on routes where `preserveScrollPosition` is always set to true.

```javascript
import Ember from 'ember';

export default Ember.Route.extend({
  resetController(controller) {
    controller.set('preserveScrollPosition', false);
  }
});
```

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`
