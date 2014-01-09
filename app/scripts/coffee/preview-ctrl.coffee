angular.module('ngArchitectApp')
  .controller('PreviewCtrl', ($scope, EventAdapter) ->
    ctrl = this;

    # Use Cases
    $scope.useCases =
      'previewStory': (story) -> ctrl.previewStory(story)

    # Use Cases executions
    EventAdapter.on 'story.preview', (story) -> $scope.useCases.previewStory(story)

    # Use Case implementations
    ctrl.previewStory = (story) -> 
      $scope.story = story
      return

    return
  )
