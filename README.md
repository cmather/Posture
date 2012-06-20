Posture.js
=============================


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

      Includes: [],

      tagName: "div",

      classNames: ["panel"],

      style: {},

      attributes: {},

      defaults: {
        html: "Hello World!"
      },

      childDefaults: {
        factory: Posture.Component
      },

      children: {
        header: {},

        content: {},

        footer: {}
      }
    });

All of the major methods in Posture.Component are decorated with a hook wrapper. This means they will all automatically fire begin and after events, and call onBefore and onAfter methods if they exist on the component instance object. For example, you can hook into the rendering process in an extended component like this:

    Posture.Component.extend({
      Name: "App.Panel",

      onAfterInitialize: function onAfterInitialize() {
        /* You can bind to events on major component methods */

        this.on("beforeRender", _.bind(this.onPreRender, this));
        this.on("afterRender", _.bind(this.onAfterRender, this));
      },

      /* or just override the hook methods */

      onBeforeRender: function onBeforeRender() {
        /* called before the render(...) method is applied */
      },

      onAfterRender: function onAfterRender() {
        /* called after the render(...) method is applied */
      }
    });

###Configurability

You create new instances of the component and configure it like this:

    var instance = new App.Panel({
      html: "Some html",
      classNames: ["additional class"],
      style: { border: "1px solid #000" }
    });

Components are automatically rendered unless autoRender is set to false.




