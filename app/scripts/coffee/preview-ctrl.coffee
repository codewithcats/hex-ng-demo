angular.module('ngArchitectApp')
  .controller('PreviewCtrl', ($scope, EventAdapter) ->
    ctrl = this

    # Use Cases
    $scope.useCases =
      'previewStory': (story) ->
        ctrl.previewStory(story)

    # (Event -> Use Cases) Bindings
    EventAdapter.on 'preview.previewStory', (story) -> $scope.useCases.previewStory(story)

    # GUI implementations
    ctrl.previewStory = (story) ->
      $scope.story = story
      return

    return
  )
