'use strict';
angular.module('ngArchitectApp', []);

angular.module('ngArchitectApp').controller('BacklogCtrl', function($scope, EventAdapter, BacklogItemsService) {
  var ctrl;
  ctrl = this;
  $scope.useCases = {
    'displayBacklogItems': function() {
      return ctrl.loadAndDisplayBacklogItems();
    }
  };
  ctrl.addStory = function(story) {
    return $scope.backlogItems.push(story);
  };
  ctrl.removeStory = function(story) {
    $scope.backlogItems = _.without($scope.backlogItems, story);
    return $scope.backlogItems;
  };
  ctrl.loadAndDisplayBacklogItems = function() {
    var items;
    items = BacklogItemsService.loadBacklogItems();
    $scope.backlogItems = items;
    return $scope.backlogItems;
  };
  $scope.storyClick = function(story) {
    return EventAdapter.broadcast('story.clicked', story);
  };
});

angular.module('ngArchitectApp').factory('BacklogItemsService', function() {
  var items, service;
  items = [
    {
      'title': 'HTML5 Boilerplate',
      'content': 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.'
    }, {
      'title': 'Angular',
      'content': 'AngularJS is a toolset for building the framework most suited to your application development.'
    }, {
      'title': 'Karma',
      'content': 'Spectacular Test Runner for JavaScript.'
    }
  ];
  service = {
    'loadBacklogItems': function() {
      return items;
    }
  };
  return service;
});

angular.module('ngArchitectApp').factory('EventAdapter', function(eventAdapterConfig) {
  var destinationToMediumMap, eventAdapter, eventListeners, mapDestinationToMedium, mapSourceToMedium, push, putMedium, sourceToMediumMap;
  push = function(key, value, map) {
    if (!(key in map)) {
      map[key] = [];
    }
    map[key].push(value);
    return map;
  };
  putMedium = function(key, medium, map) {
    return push(key, medium, map);
  };
  mapSourceToMedium = function(config) {
    var map;
    map = {};
    angular.forEach(config, function(sourceArray, medium) {
      return angular.forEach(sourceArray, function(source) {
        map = putMedium(source, medium, map);
      });
    });
    return map;
  };
  mapDestinationToMedium = function(config) {
    var map;
    map = {};
    angular.forEach(config, function(destinationArray, medium) {
      return angular.forEach(destinationArray, function(destination) {
        map = putMedium(destination, medium, map);
      });
    });
    return map;
  };
  eventListeners = {};
  destinationToMediumMap = mapDestinationToMedium(eventAdapterConfig.out);
  sourceToMediumMap = mapSourceToMedium(eventAdapterConfig['in']);
  eventAdapter = {
    'broadcast': function(source, param) {
      var collectListeners, listeners, mediumsArray, uniqueListeners;
      mediumsArray = sourceToMediumMap[source];
      listeners = [];
      collectListeners = function(m) {
        var listenersOfM;
        listenersOfM = this.listenersOf(m);
        listeners = _.union(listeners, _.compact(listenersOfM));
      };
      angular.forEach(mediumsArray, collectListeners, this);
      uniqueListeners = _.uniq(listeners);
      angular.forEach(uniqueListeners, function(listener) {
        return listener(param);
      });
      return true;
    },
    'on': function(destination, listener) {
      var mediumsArray;
      mediumsArray = destinationToMediumMap[destination];
      angular.forEach(mediumsArray, function(m) {
        return push(m, listener, eventListeners);
      });
      return true;
    },
    'listenersOf': function(medium) {
      return eventListeners[medium];
    }
  };
  return eventAdapter;
});

angular.module('ngArchitectApp').controller('PlanningCtrl', function($scope) {
  $scope.useCases = {
    'moveStory': function(src, dest, story) {
      src.removeStory(story);
      return dest.addStory(story);
    }
  };
});

angular.module('ngArchitectApp').controller('PreviewCtrl', function($scope, EventAdapter) {
  var ctrl;
  ctrl = this;
  $scope.useCases = {
    'previewStory': function(story) {
      return ctrl.previewStory(story);
    }
  };
  EventAdapter.on('story.preview', function(story) {
    return $scope.useCases.previewStory(story);
  });
  ctrl.previewStory = function(story) {
    $scope.story = story;
  };
});