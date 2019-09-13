# Changelog

## 1.3.2
* [#222](https://github.com/DockYard/ember-router-scroll/pull/222) Fix FastBoot

## 1.3.1
* [#217](https://github.com/DockYard/ember-router-scroll/pull/219) Dont batch reads and writes in same rAF

## 1.3.0
* [#217](https://github.com/DockYard/ember-router-scroll/pull/217) Recursively check document height before scrollTo

## 1.2.1
* [#212](https://github.com/DockYard/ember-router-scroll/pull/212) Allow configure so consuming app can override
* [#210](https://github.com/DockYard/ember-router-scroll/pull/210) Fix query-params-only transitions

## 1.2.0
* [#209](https://github.com/DockYard/ember-router-scroll/pull/209) Restore necessary `locationType`
* [#207](https://github.com/DockYard/ember-router-scroll/pull/207) Remove ember-getowner-polyfill
* [#206](https://github.com/DockYard/ember-router-scroll/pull/206) Improve the deprecation notice
* [#198](https://github.com/DockYard/ember-router-scroll/pull/198) fix preserveScrollPosition for ember 3.6+
* [#195](https://github.com/DockYard/ember-router-scroll/pull/195) Router scroll service
* [#191](https://github.com/DockYard/ember-router-scroll/pull/191) Ember 3.9 deprecation fixes
* [#187](https://github.com/DockYard/ember-router-scroll/pull/187) 1.1.0 minor version bump
* [#183](https://github.com/DockYard/ember-router-scroll/pull/183) Fix router event deprecations, update to Ember 3.7
* [#178](https://github.com/DockYard/ember-router-scroll/pull/178) Update to 3.6 + bump ember-app-scheduler to fix deprecations

## Unreleased (2017-11-20)

#### :house: Internal
* [#78](https://github.com/dollarshaveclub/ember-router-scroll/pull/78) Allow tests to run by adding rootURL to asset paths.. ([@ppegusii](https://github.com/ppegusii))
* [#76](https://github.com/dollarshaveclub/ember-router-scroll/pull/76) Updates the demo app with the `rootUrl`. ([@gowthamrm](https://github.com/gowthamrm))
* [#75](https://github.com/dollarshaveclub/ember-router-scroll/pull/75) Add `ember-cli-github-pages` to deploy demo app. ([@gowthamrm](https://github.com/gowthamrm))
* [#74](https://github.com/dollarshaveclub/ember-router-scroll/pull/74) Moves the demo app inside the tests/dummy. ([@gowthamrm](https://github.com/gowthamrm))

#### Committers: 2
- Gowtham Raj ([gowthamrm](https://github.com/gowthamrm))
- [ppegusii](https://github.com/ppegusii)


## v0.4.0 (2017-10-08)

#### :bug: Bug Fix
* [#73](https://github.com/dollarshaveclub/ember-router-scroll/pull/73) Update ember-app-scheduler to 0.2.0 (Closes [#72](https://github.com/dollarshaveclub/ember-router-scroll/issues/72)). ([@YoranBrondsema](https://github.com/YoranBrondsema))

#### Committers: 1
- Yoran Brondsema ([YoranBrondsema](https://github.com/YoranBrondsema))


## v0.3.1 (2017-09-11)

#### :rocket: Enhancement
* [#67](https://github.com/dollarshaveclub/ember-router-scroll/pull/67) configurable scroll element. ([@ktrhn](https://github.com/ktrhn))

#### :memo: Documentation
* [#69](https://github.com/dollarshaveclub/ember-router-scroll/pull/69) Update readme with 'service:scheduler' dependency for unit tests. ([@barryofguilder](https://github.com/barryofguilder))

#### :house: Internal
* [#64](https://github.com/dollarshaveclub/ember-router-scroll/pull/64) Update "ember-cli-qunit" to v4.0.1. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 3
- Jason Barry ([barryofguilder](https://github.com/barryofguilder))
- Sebastian Helbig ([ktrhn](https://github.com/ktrhn))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v0.3.0 (2017-08-02)

#### :rocket: Enhancement
* [#57](https://github.com/dollarshaveclub/ember-router-scroll/pull/57) Schedule window.scrollTo() to after content paint by using ember-app-scheduler. ([@cclo7](https://github.com/cclo7))

#### :bug: Bug Fix
* [#60](https://github.com/dollarshaveclub/ember-router-scroll/pull/60) made ember-app-scheduler a prod dep. ([@briangonzalez](https://github.com/briangonzalez))

#### :memo: Documentation
* [#51](https://github.com/dollarshaveclub/ember-router-scroll/pull/51) Updated docs. ([@briangonzalez](https://github.com/briangonzalez))

#### :house: Internal
* [#63](https://github.com/dollarshaveclub/ember-router-scroll/pull/63) testem: Use headless Chrome by default. ([@Turbo87](https://github.com/Turbo87))
* [#62](https://github.com/dollarshaveclub/ember-router-scroll/pull/62) CI: Use yarn instead of npm. ([@Turbo87](https://github.com/Turbo87))
* [#61](https://github.com/dollarshaveclub/ember-router-scroll/pull/61) Cleanup unused dependencies. ([@Turbo87](https://github.com/Turbo87))
* [#58](https://github.com/dollarshaveclub/ember-router-scroll/pull/58) Update to Babel 6 and New Module Imports. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 3
- Brian Gonzalez ([briangonzalez](https://github.com/briangonzalez))
- Chiachi Lo ([cclo7](https://github.com/cclo7))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v0.2.0 (2017-04-21)

#### :memo: Documentation
* [#44](https://github.com/dollarshaveclub/ember-router-scroll/pull/44) [DOC] Add comma in code snippet. ([@YoranBrondsema](https://github.com/YoranBrondsema))

#### Committers: 2
- Brian Gonzalez ([briangonzalez](https://github.com/briangonzalez))
- Yoran Brondsema ([YoranBrondsema](https://github.com/YoranBrondsema))


## v0.1.1 (2017-02-01)

#### :bug: Bug Fix
* [#42](https://github.com/dollarshaveclub/ember-router-scroll/pull/42) Fix ember-getowner-polyfill deprecation. ([@krasnoukhov](https://github.com/krasnoukhov))

#### Committers: 2
- Brian Gonzalez ([briangonzalez](https://github.com/briangonzalez))
- Dmitry Krasnoukhov ([krasnoukhov](https://github.com/krasnoukhov))


## v0.1.0 (2017-01-24)

#### :rocket: Enhancement
* [#40](https://github.com/dollarshaveclub/ember-router-scroll/pull/40) Align with Ember's HistoryLocation router. ([@briangonzalez](https://github.com/briangonzalez))
* [#20](https://github.com/dollarshaveclub/ember-router-scroll/pull/20) Fastboot compatibility. ([@arjansingh](https://github.com/arjansingh))

#### :memo: Documentation
* [#41](https://github.com/dollarshaveclub/ember-router-scroll/pull/41) [README] A note about ember rfc and core implementation. ([@briangonzalez](https://github.com/briangonzalez))
* [#36](https://github.com/dollarshaveclub/ember-router-scroll/pull/36) Remove unwanted whitespace. ([@andrewgordstewart](https://github.com/andrewgordstewart))
* [#28](https://github.com/dollarshaveclub/ember-router-scroll/pull/28) Add field to config to get live-reload working. ([@bennycwong](https://github.com/bennycwong))
* [#19](https://github.com/dollarshaveclub/ember-router-scroll/pull/19) Ember install.... ([@arjansingh](https://github.com/arjansingh))
* [#18](https://github.com/dollarshaveclub/ember-router-scroll/pull/18) update readme. ([@bennycwong](https://github.com/bennycwong))

#### :house: Internal
* [#39](https://github.com/dollarshaveclub/ember-router-scroll/pull/39) travis fixes. ([@briangonzalez](https://github.com/briangonzalez))

#### Committers: 4
- Arjan Singh ([arjansingh](https://github.com/arjansingh))
- Benny C. Wong ([bennycwong](https://github.com/bennycwong))
- Brian Gonzalez ([briangonzalez](https://github.com/briangonzalez))
- [andrewgordstewart](https://github.com/andrewgordstewart)


## v0.0.4 (2016-08-04)

#### :bug: Bug Fix
* [#14](https://github.com/dollarshaveclub/ember-router-scroll/pull/14) Enable backbutton for same routes. ([@bcardarella](https://github.com/bcardarella))

#### Committers: 1
- Brian Cardarella ([bcardarella](https://github.com/bcardarella))


## v0.0.3 (2016-08-04)

#### :rocket: Enhancement
* [#13](https://github.com/dollarshaveclub/ember-router-scroll/pull/13) move to index.js for easier importing. ([@bennycwong](https://github.com/bennycwong))

#### :bug: Bug Fix
* [#3](https://github.com/dollarshaveclub/ember-router-scroll/pull/3) Minor fixes. ([@bennycwong](https://github.com/bennycwong))

#### :memo: Documentation
* [#10](https://github.com/dollarshaveclub/ember-router-scroll/pull/10) use ember install instead of npm install. ([@bcardarella](https://github.com/bcardarella))
* [#4](https://github.com/dollarshaveclub/ember-router-scroll/pull/4) Add readme. ([@jacefarm](https://github.com/jacefarm))

#### Committers: 3
- Benny C. Wong ([bennycwong](https://github.com/bennycwong))
- Brian Cardarella ([bcardarella](https://github.com/bcardarella))
- Jason Farmer ([jacefarm](https://github.com/jacefarm))


## v0.0.1 (2016-07-21)

#### :rocket: Enhancement
* [#1](https://github.com/dollarshaveclub/ember-router-scroll/pull/1) ERS creation. ([@jacefarm](https://github.com/jacefarm))

#### :house: Internal
* [#2](https://github.com/dollarshaveclub/ember-router-scroll/pull/2) increment version and add eslint. ([@bennycwong](https://github.com/bennycwong))

#### Committers: 2
- Benny C. Wong ([bennycwong](https://github.com/bennycwong))
- Jason Farmer ([jacefarm](https://github.com/jacefarm))
