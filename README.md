# Ember-router-scroll

Scroll to page top on transition, like a non-SPA website. An alternative scroll behavior for Ember applications.
## Demo
See [demo](https://dollarshaveclub.github.io/router-scroll-demo/) made by [@Chuabacca](https://github.com/Chuabacca/)

Relevant repo: [https://github.com/dollarshaveclub/router-scroll-demo](https://github.com/dollarshaveclub/router-scroll-demo)

## Real Life Usage

### Before
![before-scroll](https://cloud.githubusercontent.com/assets/4430436/17122972/0a1fe454-5295-11e6-937f-f1f5beab9d6b.gif)  
Notice that the in the full purple page, the user is sent to the **middle** of the page



### After
![after-scroll](https://cloud.githubusercontent.com/assets/4430436/17122970/07c1a3a0-5295-11e6-977f-37eb955d95b1.gif)  
Notice that the in the full purple page, the user is sent to the **top** of the page


## Why Use it?

Ember expects an application to be rendered with nested views. The default behavior is for the scroll position to be preserved on every transition.

However not all Ember applications use nested views. For these applications, a user would expect to see the top of the page on most transitions.

In addition to scrolling to the top of the page on most transitions, a user would expect the scroll position to be preserved when using the back or forward browser buttons.

**Ember-router-scroll** makes your single page application feel more like a regular website.

## How it works

#### Definitions

For the purposes of this section, here are some definitions:

`previous route`: the route you are leaving

`next route`: the route you are going to next

`popStateEvent`: the event triggered by clicking the back or forward button in the browser. See more [here at mdn](https://developer.mozilla.org/en-US/docs/Web/Events/popstate).

#### Details:

**Ember-router-scroll** is a mixin that adds behavior to the `willTransition` and `didTransition` hooks in the router.

When `willTransition` is triggered, the scroll position is stored in a map with the **previous route's** ID from the HistoryLocation API as the key with the scroll position as the value.

`scrollMap[previous_route] = 1234`

On `didTransition`, it first checks to see if the route transition was triggered by a `popStateEvent`. If so, go to the scroll position defined by the `scrollMap`. Otherwise, scroll to the top of the page.

 **With one exception: if the queryParam `preserveScrollPosition` is set to `true`, it maintains the scroll position of the previous route. See below for further information on this queryParam.**

## Usage

### Step 1: Install Ember Router Scroll

```bash
ember install ember-router-scroll
```

### Step 2: Import ember-router-scroll


In your app/router.js file, import the mixin:

```javascript
import RouterScroll from 'ember-router-scroll';
```

And add RouterScroll as an extension to your Router object:

```javascript
const Router = Ember.Router.extend(RouterScroll, {}
```

### Step 3: Update your app's locationType

Edit `config/environment.js` and change `locationType`.  
Also add `historySupportMiddleware: true,` to get live-reload working in nested routes. (See [Issue #21](https://github.com/dollarshaveclub/ember-router-scroll/issues/21))

```js
locationType: 'router-scroll'
historySupportMiddleware: true,
```

This location type inherits from Ember's `HistoryLocation`.

### Step 4: Tests
In your router and controller tests, add `'service:router-scroll',` it as a dependency in the `needs: []` block:

```js
//{your-app}}/tests/unit/routes/{{your-route}}.js
needs:[ 'service:router-scroll '],
```
### Step 5: Profit

## Preserve Scroll Position

### Before:
![before-preserve](https://cloud.githubusercontent.com/assets/4430436/17122971/0a1e34ce-5295-11e6-8d30-9f687dd69dbb.gif)  
Notice the unwanted scroll to top in this case.

### After:
![after-preserve](https://cloud.githubusercontent.com/assets/4430436/17122969/07acbb48-5295-11e6-9900-f9ba519affa4.gif)  
Adding a query parameter fixes this issue.

In certain cases, you might want to have certain routes preserve scroll position when coming from a specific location. For example, inside your application, there is a way to get to a route where the user expects scroll position to be preserved (such as a tab section).

To use this feature:

##### Step 1.

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

##### Step 2.

Next, in the place where a transition is triggered, pass in `preserveScrollPosition=true`. For example

```handlebars
{{link-to "About Tab" 'tab.about' (query-params preserveScrollPosition=true) tagName='span' }}
```
<!--
##Example:

See example app: (EXAMPLE APP HERE) -->

## Development Instructions

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
