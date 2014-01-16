angular.module('ngArchitectApp')
  .factory 'PreviewStoryContext', ()->

    # Use Cases
    @useCases =
      'previewStory': (previewer, story) => previewer.preview(story)
      'closeStory': (previewer) => previewer.close()

    return this
