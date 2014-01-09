'use strict';

angular.module('ngArchitectApp')
  .factory('EventAdapter', function(eventAdapterConfig) {
    var eventListeners,
        destinationToMediumMap,
        sourceToMediumMap;

    function push(key, value, map) {
      if(!(key in map)) {
        map[key] = [];
      }
      map[key].push(value);
    }

    function putMedium(key, medium, map) {
      push(key, medium, map);
    }

    function mapSourceToMedium(config) {
      sourceToMediumMap = {};
      angular.forEach(config, function(sourceArray, medium) {
        angular.forEach(sourceArray, function(source) {
          putMedium(source, medium, sourceToMediumMap);
        });
      });
    }

    function mapDestinationToMedium(config) {
      destinationToMediumMap = {};
      angular.forEach(config, function(destinationArray, medium) {
        angular.forEach(destinationArray, function(destination) {
          putMedium(destination, medium, destinationToMediumMap);
        });
      });
    }

    eventListeners = {};
    mapDestinationToMedium(eventAdapterConfig.out);
    mapSourceToMedium(eventAdapterConfig.in);

    return {
      'broadcast': function(source, param) {
        var mediumsArray = sourceToMediumMap[source];
        var listeners = [];
        angular.forEach(mediumsArray, function(m) {
          var listenersOfM = this.listenersOf(m);
          listeners = _.union(listeners, _.compact(listenersOfM));
        }, this);

        var uniqueListeners = _.uniq(listeners);
        angular.forEach(uniqueListeners, function(l) {
          l(param);
        });
      },
      'on': function(destination, listener) {
        var mediumsArray = destinationToMediumMap[destination];
        angular.forEach(mediumsArray, function(m) {
          push(m, listener, eventListeners);
        });
      },
      'listenersOf': function(medium) {
        return eventListeners[medium];
      }
    };

  })
  .factory('BacklogItemsService', function () {
    var items = [
      {
        'title': 'HTML5 Boilerplate',
        'content': 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.'
      },
      {
        'title': 'Angular',
        'content': 'AngularJS is a toolset for building the framework most suited to your application development.'
      },
      {
        'title': 'Karma',
        'content': 'Spectacular Test Runner for JavaScript.'
      }
    ];
    return {
      'loadBacklogItems': function() {
        return items;
      }
    };
  })
  .controller('PlanningCtrl', function($scope) {
    // Use Cases
    $scope.useCases = {
      'moveStory': function(src, dest, story) {
        src.removeStory(story);
        dest.addStory(story);
      }
    };
  })
  .controller('PreviewCtrl', function($scope, EventAdapter) {
    var ctrl = this;

    // Use Cases
    $scope.useCases = {
      'previewStory': function(story) {
        ctrl.previewStory(story);
      }
    };

    // Use Cases executions
    EventAdapter.on('story.preview', function(story) {
      $scope.useCases.previewStory(story);
    });

    // Use Case implementations
    ctrl.previewStory = function(story) {
      $scope.story = story;
    };
  })
  .controller('BacklogCtrl', function($scope, EventAdapter, BacklogItemsService) {
    var ctrl = this;

    // Use Cases
    $scope.useCases = {
      'displayBacklogItems': function() {
        ctrl.loadAndDisplayBacklogItems();
      }
    };
    ctrl.addStory = function(story) {
      $scope.backlogItems.push(story);
    };

    ctrl.removeStory = function(story) {
      $scope.backlogItems = _.without($scope.backlogItems, story);
    };

    // Use Case implementations
    ctrl.loadAndDisplayBacklogItems = function() {
      var items = BacklogItemsService.loadBacklogItems();
      $scope.backlogItems = items;
    };

    // GUI actions
    $scope.storyClick = function(story) {
      EventAdapter.broadcast('story.clicked', story);
    };
  });
