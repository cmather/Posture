Posture.js
=============================

##Introduction

Posture.js is a JavaScript framework for building user interface components and organizing any Web application
JavaScript, not just for single page apps. The framework is built using a combination of namespacing and
requirejs modules. Includes the lodash utility library.

##Getting Started
* Ruby, RubyGems and Bundler are needed for automatically installing developer dependencies.
* After you clone the repo run `rake setup` to automatically run the bundle install command and create symlinks for the test directories.
* `rake server` starts up a server you can use to play with the library.
* `rake test` runs the Jasmine tests found in the tests/spec directory.

##Main Modules

* __Core__: Includes the main `Posture` namespace.
* __Class__: `Posture.Class` provides a class functionality including namespacing, mixins (with mixin hooks), and inheritance.
* __EventPublisher__: `Posture.behaviors.EventPublisher` provides a publish/subscribe standalone class or mixin.
* __Component__: `Posture.Component` provides a base class for building reusable user interface components. It has mechanisms for clearly handling component configurability and component inheritance.

_More documentation to come soon._

