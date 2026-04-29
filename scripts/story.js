// @ts-check

import { VisualNovelEngine } from './engine.js';

const storyInitialState = {
  statTrust: 0,
  statFocus: 0,
  storyEnding: /** @type {'good' | 'bad' | null} */ (null),
};

/**
 * @typedef {typeof storyInitialState} StoryState
 */

/**
 * @typedef {Omit<import('./engine.js').VisualNovelEngine, 'initialState' | 'state' | 'setState' | 'resetState'> & {
 *   initialState: StoryState,
 *   state: StoryState,
 *   setState: (updates?: Partial<StoryState>) => StoryState,
 *   resetState: () => StoryState,
 * }} StoryEngine
 */

/**
 * @typedef {(game: StoryEngine, details: import('./engine.js').EngineActionDetails) => (string | void | null)} StoryAction
 * @typedef {(game: StoryEngine, context: import('./engine.js').EngineConditionContext) => boolean} StoryCondition
 */

/** @type {Record<string, StoryCondition>} */
const storyConditions = {
  hasPositiveTrust(game) {
    return game.state.statTrust > 0;
  },
};

/** @type {Record<string, StoryAction>} */
const storyActions = {
  restartStory(game) {
    game.stopAllAudio();
    game.resetState();
    return 'intro-scene';
  },

  chooseSupport(game) {
    game.setState({
      statTrust: game.state.statTrust + 1,
    });
  },

  choosePressure(game) {
    game.setState({
      statTrust: game.state.statTrust - 1,
    });
  },

  choosePlan(game) {
    game.setState({
      statFocus: game.state.statFocus + 1,
    });
  },

  chooseRush(game) {
    game.setState({
      statFocus: game.state.statFocus - 1,
    });
  },

  resolveEnding(game) {
    const isGoodEnding =
      game.state.statTrust > 0 && game.state.statFocus > 0;

    game.setState({
      storyEnding: isGoodEnding ? 'good' : 'bad',
    });

    return isGoodEnding ? 'ending-good-scene' : 'ending-bad-scene';
  },
};

VisualNovelEngine.boot({
  startSceneId: 'intro-scene',
  initialState: storyInitialState,
  conditions: /** @type {Record<string, import('./engine.js').EngineCondition>} */ (
    storyConditions
  ),
  actions: /** @type {Record<string, import('./engine.js').EngineAction>} */ (
    storyActions
  ),
});
