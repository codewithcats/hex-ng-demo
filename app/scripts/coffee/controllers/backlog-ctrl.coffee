angular.module('ngArchitectApp')
  .controller('BacklogCtrl', (BacklogContext, BacklogItemsService, EventAdapter, $scope, $http) ->

    @backlog =
      displayItems: () ->
        BacklogItemsService.loadBacklogItems()
          .success (items) -> $scope.backlogItems = items

    BacklogContext.useCases.displayBacklogItems @backlog

    # GUI actions
    $scope.storyClick = (story) -> EventAdapter.broadcast('story.clicked', story)

    return
  )
