angular.module('ngArchitectApp')
  .controller 'PreviewStoryCtrl', (PreviewStoryContext, EventAdapter, $scope)->

    @previewer =
      preview: (story) -> $scope.story = story
      close: () -> $scope.story = null

    # Role assignments
    PreviewStoryContext.roles.previewer @previewer

    # (Events -> Use cases) bindings
    EventAdapter.on 'previewStory.previewStory', (story) ->
      PreviewStoryContext.useCases.previewStory(story)

    $scope.close = () -> PreviewStoryContext.useCases.closeStory()
    return
