angular.module('ngArchitectApp')
  .factory 'BacklogContext', () ->
    @useCases =
      'displayBacklogItems': (backlog) ->
        backlog.displayItems()

    return this

