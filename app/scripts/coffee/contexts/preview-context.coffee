angular.module('ngArchitectApp')
  .factory 'PreviewStoryContext', ()->
    # Roles
    @roles =
      'previewer': (actor) =>
        @previewer = actor
        return

    # Use Cases
    @useCases =
      'previewStory': (story) =>
        @previewer.preview(story)

    return this
