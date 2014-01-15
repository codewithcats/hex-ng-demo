angular.module('ngArchitectApp')
  .controller('PlanningCtrl', (PlanningContext, Backlog, EventAdapter, $scope) ->
    $scope.leftBacklog = new Backlog('data/backlog-items.json')
    $scope.rightBacklog = new Backlog('data/backlog-items.json')

    $scope.leftBacklog.load()
    $scope.rightBacklog.load()

    $scope.storyClick = (story) -> EventAdapter.broadcast('story.clicked', story)
    $scope.moveStoryToRightBacklog = (story) =>
      PlanningContext.useCases.moveStory $scope.leftBacklog, $scope.rightBacklog, story
    $scope.moveStoryToLeftBacklog = (story) =>
      PlanningContext.useCases.moveStory $scope.rightBacklog, $scope.leftBacklog, story

    return
  )
