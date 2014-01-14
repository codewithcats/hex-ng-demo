angular.module('ngArchitectApp')
  .factory('BacklogItemsService', ($http) ->
    service =
      'loadBacklogItems': () ->
        $http.get('data/backlog-items.json')
    return service
  )
