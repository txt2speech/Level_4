// @ts-check
import { VisualNovelEngine } from './engine.js';

const storyInitialState = {
  visitedFairy: false,
  visitedLake: false,
  hasSword: false,
  storyEnding: null,
};

/** @type {Record<string, import('./engine.js').EngineAction>} */
const storyActions = {
  restartStory(game) {
    game.stopAllAudio();
    game.resetState();
    return 'scene-velkommen';
  },

  showFugoInfo(game) {
    return 'scene-fugo-info';
  },

  // --- ØRNEN ---
  hideEagle(game) {
    game.setDialog("Narrator", "Xavier slipper væk, men falder og slår knæet. Han halter videre med smerter.", "#a0e8af");
  },
  scareEagle(game) {
    game.setDialog("Narrator", "Ørnen trækker sig. Men larmen vækker noget i skoven og Xavier hører tunge trin nærme sig bag ham.", "#a0e8af");
  },

  // --- ILLUSION OF FREE CHOICE (FEEN & SØEN) ---
  finishFairy(game) {
    game.setState({ visitedFairy: true });

    // Hvis søen også er klaret, tager feen os direkte til muldvarperne
    if (game.state.visitedLake) {
      return 'scene-feen-to-moles';
    }
    // Ellers sender hun os tilbage til krydset for at klare søen
    return 'scene-intermission-only-lake';
  },

  finishLake(game) {
    game.setState({ visitedLake: true });

    // Hvis feen også er klaret, tager bæveren os direkte til muldvarperne
    if (game.state.visitedFairy) {
      return 'scene-soen-to-moles';
    }
    // Ellers sender bæveren os tilbage til krydset for at klare feen
    return 'scene-intermission-only-fairy';
  },

  // --- MULDVARPERNE ---
  answerRiddleCorrect(game) {
    game.setState({ hasSword: true });
  },
  giveUpRiddle(game) {
    game.setState({ hasSword: false });
    game.setDialog("Xavier", "Jeg har ikke tid til gåder. Jeg må finde Fugu nu!", "#79b8f9");
  },
  nameSword(game) {
    game.setDialog("Xavier", "Jeg døber dig... Rodalon!", "#79b8f9");
  },

  // Tjekker om man har sværdet og sender én til den korrekte bossscene
  goToFinale(game) {
    return game.state.hasSword ? 'scene-finale-sword' : 'scene-finale-nosword';
  },

  // --- BOSS KAMP ---
  attackDirectly(game) {
    game.setDialog("Narrator", "Xavier løber. Svampene griber efter ham, men han når frem og hugger sværdet dybt ned i Kong Fugu.", "#f9e076");
  },
  sneakAttack(game) {
    game.setDialog("Narrator", "Xavier bevæger sig rundt og lokker svampene væk. Han finder det rette øjeblik og stikker sværdet ind præcist og roligt.", "#f9e076");
  },
  throwRocks(game) {
    game.setDialog("Narrator", "Xavier har intet sværd. Han samler sten op og kaster dem. Sten efter sten, til Bad Fungus synker ned med et tungt drøn.", "#f9e076");
  }
};

VisualNovelEngine.boot({
  startSceneId: 'scene-velkommen',
  initialState: storyInitialState,
  actions: storyActions,
});
