import { VisualNovelEngine } from './engine.js';

const storyInitialState = {
  visitedFairy: false,
  visitedLake: false,
  hasSword: false,
  storyEnding: null,
};

const storyActions = {
  restartStory(game) {
    game.stopAllAudio();
    game.resetState();
    return 'scene-velkommen';
  },

  showFugoInfo(game) {
    return 'scene-fugo-info';
  },

  hideEagle(game) {
    game.setDialog("Narrator", "Xavier slipper væk, men falder og slår knæet. Han halter videre med smerter.", "#a0e8af");
  },

  scareEagle(game) {
    game.setDialog("Narrator", "Ørnen trækker sig. Men larmen vækker noget i skoven og Xavier hører tunge trin nærme sig bag ham.", "#a0e8af");
  },

  finishFairy(game) {
    game.setState({ visitedFairy: true });

    if (game.state.visitedLake) {
      return 'scene-feen-to-moles';
    }
    return 'scene-intermission-only-lake';
  },

  finishLake(game) {
    game.setState({ visitedLake: true });

    if (game.state.visitedFairy) {
      return 'scene-soen-to-moles';
    }
    return 'scene-intermission-only-fairy';
  },

  answerRiddleCorrect(game) {
    game.setState({ hasSword: true });
  },

  giveUpRiddle(game) {
    game.setState({ hasSword: false });
    game.setDialog("Xavier", "Jeg har ikke tid til gåder. Jeg må finde Fugu nu!", "#79b8f9");
  },

  nameSword(game) {
    game.setDialog("Xavier", "Jeg døber dig... Rodalon!", "#79b8f9");
    const swordSound = document.getElementById('sfx-magic');
    if (swordSound) {
      swordSound.currentTime = 0; // Sletter eventuel forsinkelse hvis man trykker hurtigt
      swordSound.play().catch(err => console.log("Lyd blokeret af browser indtil første klik:", err));
    }
  },

  goToFinale(game) {
    return game.state.hasSword ? 'scene-finale-sword' : 'scene-finale-nosword';
  },

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
// Funktion til at fade musikken IND (fra 0.0 til 0.4)
function fadeInBGM(audio, duration = 3000) {
  audio.volume = 0;
  audio.play().catch(err => console.log("Afspilning venter på klik:", err));

  let start = null;
  const targetVolume = 0.4; // Sætter musikken til et behageligt baggrundsniveau

  function animate(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    audio.volume = Math.min((progress / duration) * targetVolume, targetVolume);
    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}


function fadeOutAndLoopBGM(audio, duration = 3000) {
  let start = null;
  const startVolume = audio.volume;

  function animate(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    audio.volume = Math.max(startVolume - (progress / duration) * startVolume, 0);

    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      audio.currentTime = 0;
      fadeInBGM(audio, duration);
    }
  }
  requestAnimationFrame(animate);
}

document.addEventListener('click', function startMusicOnFirstClick() {
  const bgm = document.getElementById('bgm-forest');
  if (bgm && bgm.paused) {
    fadeInBGM(bgm, 3000);

    bgm.addEventListener('timeupdate', function checkTime() {
      if (bgm.duration - bgm.currentTime <= 3) {
        bgm.removeEventListener('timeupdate', checkTime);
        fadeOutAndLoopBGM(bgm, 3000);
      }
    });
  }

  document.removeEventListener('click', startMusicOnFirstClick);
}, { once: true });
