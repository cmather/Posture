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
* __Posture.Class__: `Posture.Class` provides a class functionality including namespacing, mixins (with mixin hooks), and inheritance.
* __Posture.behaviors.EventPublisher__: `Posture.behaviors.EventPublisher` provides a publish/subscribe standalone class or mixin.
* __Posture.Component__: `Posture.Component` provides a base class for building reusable user interface components. It has mechanisms for clearly handling component configurability and component inheritance.

##Posture.Component

###Overview

Posture.Component is the base class for creating reusable user interface components. It has all of the logic for rendering, extending and configuring components.

###Extensibility

You extend Posture.Component to create custom reusable components like this:

    Posture.Component.extend({

      Name: "App.Panel",

      tagName: "div",

      classNames: ["panel"],

      style: {},

      attributes: {},

      childDefaults: {
        factory: Posture.Component
      },

      children: {
        header: {

        },

        content: {

        },

        footer: {

        }
      }

    });
