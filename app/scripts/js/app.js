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
    return BacklogItemsService.loadBacklogItems().success(function(items) {
      $scope.backlogItems = items;
    });
  };
  $scope.storyClick = function(story) {
    return EventAdapter.broadcast('story.clicked', story);
  };
});

angular.module('ngArchitectApp').factory('BacklogItemsService', function($http) {
  var service;
  service = {
    'loadBacklogItems': function() {
      return $http.get('data/backlog-items.json');
    }
  };
  return service;
});

angular.module('ngArchitectApp').factory('PreviewStoryContext', function() {
  var _this = this;
  this.roles = {
    'previewer': function(actor) {
      _this.previewer = actor;
    }
  };
  this.useCases = {
    'previewStory': function(story) {
      return _this.previewer.preview(story);
    }
  };
  return this;
});

angular.module('ngArchitectApp').controller('PreviewStoryCtrl', function(PreviewStoryContext, EventAdapter, $scope) {
  this.previewer = {
    preview: function(story) {
      return $scope.story = story;
    }
  };
  PreviewStoryContext.roles.previewer(this.previewer);
  EventAdapter.on('previewStory.previewStory', function(story) {
    return PreviewStoryContext.useCases.previewStory(story);
  });
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
