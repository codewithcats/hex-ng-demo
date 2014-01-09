angular.module('ngArchitectApp')
  .factory('EventAdapter', (eventAdapterConfig) ->
    push = (key, value, map) ->
      if not (key of map) then map[key] = []
      map[key].push(value)
      return map

    putMedium = (key, medium, map) -> push(key, medium, map)

    mapSourceToMedium = (config) ->
      map = {}
      angular.forEach config, (sourceArray, medium) ->
        angular.forEach sourceArray, (source)->
          map = putMedium(source, medium, map)
          return
      return map

    mapDestinationToMedium = (config) ->
      map = {}
      angular.forEach config, (destinationArray, medium) ->
          angular.forEach destinationArray, (destination) ->
            map = putMedium(destination, medium, map);
            return
      return map

    eventListeners = {};
    destinationToMediumMap = mapDestinationToMedium(eventAdapterConfig.out);
    sourceToMediumMap = mapSourceToMedium(eventAdapterConfig['in']);
    eventAdapter =
      'broadcast': (source, param) ->
        mediumsArray = sourceToMediumMap[source]
        listeners = []
        collectListeners = (m) ->
          listenersOfM = this.listenersOf(m)
          listeners = _.union(listeners, _.compact(listenersOfM))
          return
        angular.forEach mediumsArray, collectListeners, this
        uniqueListeners = _.uniq(listeners);
        angular.forEach uniqueListeners, (listener) -> listener(param)
        return true

      'on': (destination, listener) ->
        mediumsArray = destinationToMediumMap[destination]
        angular.forEach mediumsArray, (m) -> push(m, listener, eventListeners)  
        return true

      'listenersOf': (medium) -> eventListeners[medium]

    return eventAdapter
  )
