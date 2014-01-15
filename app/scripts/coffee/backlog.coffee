angular.module('ngArchitectApp')
  .factory 'Backlog', ($http, $q) ->
    constructor = (uri)->
      @uri = uri
      @load = (config) =>
        deferred = $q.defer()
        $http.get(uri, config)
          .success((items) =>
            @items = items
            deferred.resolve @items)
          .error(() -> deferred.reject())
        return deferred.promise
      @removeStory = (story) =>
        @items = _.without @items, story
      @insertStory = (story) =>
        @items.push story

      return this

    return constructor
