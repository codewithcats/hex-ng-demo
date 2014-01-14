angular.module('ngArchitectApp')
  .controller('BacklogCtrl', ($scope, EventAdapter, BacklogItemsService) ->
    ctrl = this

    # Use Cases
    $scope.useCases =
      'displayBacklogItems': () ->
        ctrl.loadAndDisplayBacklogItems()

    ctrl.addStory = (story) -> 
      $scope.backlogItems.push(story)
    ctrl.removeStory = (story) ->
      $scope.backlogItems = _.without($scope.backlogItems, story)
      return $scope.backlogItems

    # GUI implementations
    ctrl.loadAndDisplayBacklogItems = () ->
      BacklogItemsService.loadBacklogItems()
        .success (items)->
          $scope.backlogItems = items
          return

    # GUI actions
    $scope.storyClick = (story) -> EventAdapter.broadcast('story.clicked', story)

    return
  )
