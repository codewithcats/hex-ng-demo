angular.module('ngArchitectApp')
  .controller 'PreviewStoryCtrl', (PreviewStoryContext, EventAdapter, $scope)->

    @previewer =
      preview: (story) -> $scope.story = story
      close: () -> $scope.story = null

    # (Events -> Use cases) bindings
    EventAdapter.on 'previewStory.previewStory', (story) =>
      PreviewStoryContext.useCases.previewStory(@previewer, story)

    $scope.close = () => PreviewStoryContext.useCases.closeStory(@previewer)
    return
