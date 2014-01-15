angular.module('ngArchitectApp')
  .factory 'Backlog', ($http) ->
    constructor = (uri)->
      @uri = uri
      @get = (config) =>
        $http.get @uri, config

    return constructor
