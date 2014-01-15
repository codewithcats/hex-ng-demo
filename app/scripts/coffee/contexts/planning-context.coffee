angular.module('ngArchitectApp')
  .factory 'PlanningContext', () ->
    @useCases =
      'moveStory': (src, dest, story) ->
        src.removeStory(story)
        dest.insertStory(story)

    return this
