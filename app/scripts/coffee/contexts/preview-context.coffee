angular.module('ngArchitectApp')
  .factory 'PreviewStoryContext', ()->
    # Roles
    @roles =
      'previewer': (actor) => @previewer = actor

    # Use Cases
    @useCases =
      'previewStory': (story) => @previewer.preview(story)
      'closeStory': () => @previewer.close()

    return this
