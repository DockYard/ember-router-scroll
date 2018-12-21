# ember-router-scroll

[![Build Status](https://travis-ci.org/dollarshaveclub/ember-router-scroll.svg?branch=master)](https://travis-ci.org/dollarshaveclub/ember-router-scroll)
[![Greenkeeper badge](https://badges.greenkeeper.io/dollarshaveclub/ember-router-scroll.svg)](https://greenkeeper.io/)

> Scroll to page top on transition, like a non-SPA website. An alternative scroll behavior for Ember applications.

## Why Use it?

Ember expects an application to be rendered with nested views. The default behavior is for the scroll position to be
preserved on every transition. However, not all Ember applications use nested views. For these applications, a user
would expect to see the top of the page on most transitions.

In addition to scrolling to the top of the page on most transitions, a user would expect the scroll position to be
preserved when using the back or forward browser buttons.

**ember-router-scroll** makes your single page application feel more like a regular website.


## Installation & Usage

**1.** Install addon

```bash
ember install ember-router-scroll
```

**2.** Import ember-router-scroll

You need to import the mixin in your `app/router.js` file, so it will be injected in all your routes.
Also, you have to add RouterScroll as an extension to your Router object:

```javascript
// app/router.js

import RouterScroll from 'ember-router-scroll';

const Router = EmberRouter.extend(PageTrackerMixin, RouterScroll, {
  ...
});
```

**3.** Update your app's `locationType`

Edit `config/environment.js` and change `locationType`.
Also add `historySupportMiddleware: true,` to get live-reload working in nested routes.
(See [Issue #21](https://github.com/dollarshaveclub/ember-router-scroll/issues/21))

```javascript
locationType: 'router-scroll',
historySupportMiddleware: true,
```

This location type inherits from Ember's `HistoryLocation`.

**4.** If using old style QUnit tests. If tests based on [RFC](https://github.com/emberjs/rfcs/pull/232), you can
ignore this.
In your router and controller tests, add `'service:router-scroll'` and `'service:scheduler'` as dependencies in the
`needs: []` block:

```javascript
//{your-app}}/tests/unit/routes/{{your-route}}.js
needs:[ 'service:router-scroll', 'service:scheduler' ],
```


### Options

If you need to scroll to the top of an area that generates a vertical scroll bar, you can specify the id of an element
of the scrollable area. Default is `window` for using the scroll position of the whole viewport. You can pass an options
object in your application's `config/environment.js` file.

```javascript
ENV['routerScroll'] = {
  scrollElement: '#mainScrollElement'
};
```

If you want to scroll to a target element on the page, you can specify the id or class of the element on the page.  This
is particularly useful if instead of scrolling to the top of the window, you want to scroll to the top of the main
content area (that does not generate a vertical scrollbar).

```javascript
ENV['routerScroll'] = {
  targetElement: '#main-target-element' // or .main-target-element
};
```

Moreover, if your route breaks up render into multiple phases, you may need to delay scrollTop functionality until after
the First Meaningful Paint using `delayScrollTop: true` in your config.  `delayScrollTop` defaults to `false`.

```javascript
ENV['routerScroll'] = {
  delayScrollTop: true
};
```


## A working example

See [demo](https://dollarshaveclub.github.io/router-scroll-demo/) made by [Jon Chua](https://github.com/Chuabacca/).


## A visual demo

### Before

![before-scroll](https://cloud.githubusercontent.com/assets/4430436/17122972/0a1fe454-5295-11e6-937f-f1f5beab9d6b.gif)

Notice that the in the full purple page, the user is sent to the **middle** of the page.


### After

![after-scroll](https://cloud.githubusercontent.com/assets/4430436/17122970/07c1a3a0-5295-11e6-977f-37eb955d95b1.gif)

Notice that the in the full purple page, the user is sent to the **top** of the page.


## Issues with nested routes

### Before:

![before-preserve](https://cloud.githubusercontent.com/assets/4430436/17122971/0a1e34ce-5295-11e6-8d30-9f687dd69dbb.gif)

Notice the unwanted scroll to top in this case.


### After:

![after-preserve](https://cloud.githubusercontent.com/assets/4430436/17122969/07acbb48-5295-11e6-9900-f9ba519affa4.gif)

Adding a query parameter or controller property fixes this issue.


### preserveScrollPosition with queryParams

In certain cases, you might want to have certain routes preserve scroll position when coming from a specific location.
For example, inside your application, there is a way to get to a route where the user expects scroll position to be
preserved (such as a tab section).

**1.** Add query param in controller

Add `preserveScrollPosition` as a queryParam in the controller for the route that needs to preserve the scroll position.

Example:

```javascript
import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: [
    'preserveScrollPosition',
  ],
});
```

**2.** Pass in query param

Next, in the place where a transition is triggered, pass in `preserveScrollPosition=true`. For example

```handlebars
{{link-to "About Tab" 'tab.about' (query-params preserveScrollPosition=true) }}
```


### preserveScrollPosition with a controller property

In other cases, you may have certain routes that always preserve scroll position, or routes where the controller can
decide when to preserve scroll position. For instance, you may have some nested routes that have true nested UI where
preserving scroll position is expected. Or you want a particular route to start off with the default scroll-to-top
behavior but then preserve scroll position when query params change in response to user interaction. Using a controller
property also allows the use of preserveScrollPosition without adding this to the query params.


**1.** Add query param to controller

Add `preserveScrollPosition` as a controller property for the route that needs to preserve the scroll position.
In this example we have `preserveScrollPosition` initially set to false so that we get our normal scroll-to-top behavior
when the route loads. Later on, when an action triggers a change to the `filter` query param, we also set
`preserveScrollPosition` to true so that this user interaction does not trigger the scroll-to-top behavior.

Example:

```javascript
import Controller from '@ember/controller';

export default Controller.extend({
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

**2.** Reset preserveScrollPosition if necessary

If your controller is changing the preserveScrollPosition property, you'll probably need to reset
`preserveScrollPosition` back to the default behavior whenever the controller is reset. This is not necessary on routes
where `preserveScrollPosition` is always set to true.

```javascript
import Router from '@ember/routing/route';

export default Route.extend({
  resetController(controller) {
    controller.set('preserveScrollPosition', false);
  }
});
```


## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Automatic Updates

This repository uses [Greenkeeper](https://greenkeeper.io/) to manage dependencies.
Before doing manual updates to dependencies, please check if a Greenkeeper pull request for the update already exists.

Greenkeeper updates are updated and merged following the steps listed below.

* `git checkout <greenkeeper-pull-request>`
* `nvm i`
* `yarn`
* `yarn update`
