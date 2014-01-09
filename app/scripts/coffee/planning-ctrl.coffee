angular.module('ngArchitectApp')
  .controller('PlanningCtrl', ($scope) ->
    # Use Cases
    $scope.useCases =
      'moveStory': (src, dest, story) ->
        src.removeStory(story)
        dest.addStory(story)
    return
  )
