import { useEffect, useState } from 'react';
import { CATEGORIES, buildQuestions } from './data.js';
import TeamRegistration from './TeamRegistration.jsx';
import GameBoard from './GameBoard.jsx';
import QuestionModal from './QuestionModal.jsx';
import Scoreboard from './Scoreboard.jsx';
import FullScoreboard from './FullScoreboard.jsx';
import Podium from './Podium.jsx';
import DesktopOnly, { useIsSmallScreen } from './DesktopOnly.jsx';
import { enterFullscreen } from './Fullscreen.jsx';
import { setBedPhase } from './bedMusic.js';
import { ChosenReveal, NameModal, PasscodeModal, SurpriseBoard, SurpriseFinalResults, SurpriseQuestion } from './Surprise.jsx';
import { SURPRISE_QUESTIONS } from './surpriseData.js';

// Progress is saved in this browser, so a refresh doesn't restart the game.
const SAVE_KEY = 'level-up-save-v1';
const loadSave = () => {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    return s && Array.isArray(s.teams) ? { phase: 'registration', answered: [], activeId: null, ...s } : null;
  } catch {
    return null;
  }
};
// Coming back after a refresh: an open question returns to the board (its card is still unanswered);
// a question that was still being scored resumes scoring; otherwise stay where you were.
const restorePhase = (s) => {
  if (!s || s.teams.length === 0) return ['registration', null];
  if (s.phase === 'scoreboard' && s.activeId && !s.answered.includes(s.activeId)) return ['scoreboard', s.activeId];
  return s.phase === 'registration' ? ['registration', null] : ['board', null];
};

export default function App() {
  const [saved] = useState(loadSave);
  const [teams, setTeams] = useState(saved?.teams ?? []); // { id, name, color, score }
  const [questions, setQuestions] = useState(() =>
    buildQuestions().map((q) => ({ ...q, isAnswered: !!saved?.answered.includes(q.id) }))
  );
  const [[startPhase, startActive]] = useState(() => restorePhase(saved));
  // 'registration' | 'board' | 'question-active' | 'scoreboard'
  const [currentPhase, setCurrentPhase] = useState(startPhase);
  const [activeId, setActiveId] = useState(startActive);
  const [showTally, setShowTally] = useState(false);
  const [showPodium, setShowPodium] = useState(false);
  const [podiumDone, setPodiumDone] = useState(false); // all three places have been revealed
  const [podiumMusic, setPodiumMusic] = useState(false);
  const [hideRanking, setHideRanking] = useState(!!saved?.hideRanking); // hides the top 3 on the board and while scoring
  const [showPasscode, setShowPasscode] = useState(false);
  const [showChosenReveal, setShowChosenReveal] = useState(false);
  const [chosenAudio, setChosenAudio] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [surprisePhase, setSurprisePhase] = useState('board');
  const [surpriseId, setSurpriseId] = useState(null);
  const [surpriseAnswered, setSurpriseAnswered] = useState([]);
  const [surprisePlayerName, setSurprisePlayerName] = useState('');
  const [surpriseScore, setSurpriseScore] = useState(0);
  const [showRegistration, setShowRegistration] = useState(false);
  const smallScreen = useIsSmallScreen();

  // background music plays on registration and the board, fades out while a question is open
  // on the podium the music stays off during the reveal and fanfare, then comes back a few seconds after the winner is shown
  useEffect(() => {
    if (!showPodium || !podiumDone) { setPodiumMusic(false); return; }
    const t = setTimeout(() => setPodiumMusic(true), 2500);
    return () => clearTimeout(t);
  }, [showPodium, podiumDone]);
  useEffect(() => {
    const phase = surpriseOpen ? (surprisePhase === 'board' ? 'board' : surprisePhase === 'scoreboard' ? 'scoreboard' : surprisePhase === 'final-results' ? 'question-active' : 'question-active') : currentPhase;
    setBedPhase(smallScreen ? 'off' : showChosenReveal ? 'off' : showPodium ? (podiumMusic ? 'podium' : 'off') : phase);
  }, [currentPhase, smallScreen, showChosenReveal, showPodium, podiumMusic, surpriseOpen, surprisePhase]);

  useEffect(() => {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({ teams, answered: questions.filter((q) => q.isAnswered).map((q) => q.id), phase: currentPhase, activeId, hideRanking })
      );
    } catch {}
  }, [teams, questions, currentPhase, activeId, hideRanking]);

  const active = questions.find((q) => q.id === activeId);
  const category = active && CATEGORIES.find((c) => c.id === active.categoryId);

  const openQuestion = (q) => {
    setActiveId(q.id);
    setCurrentPhase('question-active');
  };

  const markAnswered = (id) => setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, isAnswered: true } : q)));

  const awardPoints = (teamIds, points) =>
    setTeams((ts) => ts.map((t) => (teamIds.includes(t.id) ? { ...t, score: t.score + points } : t)));

  // manual fix from the Full scoreboard (delta can be negative)
  const adjustScore = (teamId, delta) =>
    setTeams((ts) => ts.map((t) => (t.id === teamId ? { ...t, score: t.score + delta } : t)));

  const adjustSurpriseScore = (playerId, delta) => {
    if (playerId === 'surprise-player') setSurpriseScore((score) => score + delta);
  };

  const returnToBoard = () => {
    markAnswered(activeId);
    setActiveId(null);
    setCurrentPhase('board');
  };

  const openSurpriseQuestion = (q) => { setSurpriseId(q.id); setSurprisePhase('question-active'); };
  const returnFromSurpriseScoreboard = () => {
    setSurpriseAnswered((ids) => [...ids, surpriseId]);
    setSurpriseId(null);
    setSurprisePhase('board');
  };

  const newGame = () => {
    try { localStorage.removeItem(SAVE_KEY); } catch {}
    setTeams([]);
    setQuestions(buildQuestions());
    setActiveId(null);
    setShowTally(false);
    setShowPodium(false);
    setPodiumDone(false);
    setHideRanking(false);
    setShowPasscode(false);
    setShowChosenReveal(false);
    setChosenAudio(null);
    setShowNamePrompt(false);
    setSurpriseOpen(false);
    setSurprisePhase('board');
    setSurpriseId(null);
    setSurpriseAnswered([]);
    setSurprisePlayerName('');
    setSurpriseScore(0);
    setShowRegistration(false);
    setCurrentPhase('registration');
  };

  if (smallScreen) return <DesktopOnly />; // the game state above is kept, so resizing back resumes it

  return (
    <div className="h-full">
      {currentPhase === 'registration' && (
        <TeamRegistration teams={teams} setTeams={setTeams} onStart={() => { enterFullscreen(); setCurrentPhase('board'); }} onNewGame={newGame} onRegisterTeam={() => setShowRegistration((visible) => !visible)} registrationLabel={showRegistration ? 'Hide registration' : 'Register a team'} showForm={showRegistration} />
      )}

      {currentPhase !== 'registration' && (
        <GameBoard categories={CATEGORIES} questions={questions} teams={teams} onPick={openQuestion} onShowTally={() => setShowTally(true)} onNewGame={newGame} hideRanking={hideRanking} onToggleHide={() => setHideRanking((h) => !h)} onFinalResults={() => setShowPodium(true)} onSurprise={() => setShowPasscode(true)} />
      )}
      {currentPhase === 'question-active' && active && (
        <QuestionModal
          key={active.id}
          question={active}
          category={category}
          onProceed={() => setCurrentPhase('scoreboard')}
        />
      )}

      {currentPhase === 'scoreboard' && active && (
        <Scoreboard
          key={active.id}
          question={active}
          teams={teams}
          // marking it answered right away means a refresh can't let the same question be scored twice
          onAward={(ids) => { awardPoints(ids, active.points); markAnswered(active.id); }}
          onReturn={returnToBoard}
          onShowTally={() => setShowTally(true)}
          hideRanking={hideRanking}
        />
      )}

      {showTally && (
        <FullScoreboard
          teams={surpriseOpen
            ? [{ id: 'surprise-player', name: surprisePlayerName, color: '#ff8a00', score: surpriseScore }]
            : teams}
          onAdjust={surpriseOpen ? adjustSurpriseScore : adjustScore}
          onClose={() => setShowTally(false)}
        />
      )}

      {showPodium && <Podium teams={teams} onRevealed={setPodiumDone} onClose={() => { setShowPodium(false); setPodiumDone(false); }} />}

      {showPasscode && <PasscodeModal onUnlock={(audio) => { setChosenAudio(audio); setShowPasscode(false); setShowChosenReveal(true); }} onClose={() => setShowPasscode(false)} />}
      {showChosenReveal && <ChosenReveal audio={chosenAudio} onComplete={() => { setShowChosenReveal(false); setChosenAudio(null); setShowNamePrompt(true); }} />}
      {showNamePrompt && <NameModal onConfirm={(name) => { setSurprisePlayerName(name); setShowNamePrompt(false); setSurpriseOpen(true); setSurprisePhase('board'); }} onClose={() => setShowNamePrompt(false)} />}
      {surpriseOpen && surprisePhase === 'board' && (
        <SurpriseBoard
          answered={surpriseAnswered}
          playerName={surprisePlayerName}
          onPick={openSurpriseQuestion}
          onFinalResults={() => setSurprisePhase('final-results')}
          onClose={() => { setSurpriseOpen(false); setSurpriseId(null); }}
          onShowTally={() => setShowTally(true)}
          onNewGame={newGame}
          hideRanking={hideRanking}
          onToggleHide={() => setHideRanking((h) => !h)}
        />
      )}
      {surpriseOpen && surprisePhase === 'final-results' && (
        <SurpriseFinalResults playerName={surprisePlayerName} score={surpriseScore} onClose={() => setSurprisePhase('board')} />
      )}
      {surpriseOpen && surprisePhase === 'question-active' && surpriseId && (
        <SurpriseQuestion
          question={SURPRISE_QUESTIONS.find((q) => q.id === surpriseId)}
          playerName={surprisePlayerName}
          onProceed={() => setSurprisePhase('scoreboard')}
          onShowTally={() => setShowTally(true)}
          onNewGame={newGame}
          hideRanking={hideRanking}
          onToggleHide={() => setHideRanking((h) => !h)}
        />
      )}
      {surpriseOpen && surprisePhase === 'scoreboard' && surpriseId && (
        <Scoreboard
          key={`surprise-${surpriseId}`}
          question={SURPRISE_QUESTIONS.find((q) => q.id === surpriseId)}
          teams={[{ id: 'surprise-player', name: surprisePlayerName, color: '#ff8a00', score: surpriseScore }]}
          onAward={(ids) => { if (ids.includes('surprise-player')) setSurpriseScore((score) => score + SURPRISE_QUESTIONS.find((q) => q.id === surpriseId).points); }}
          onReturn={returnFromSurpriseScoreboard}
          onShowTally={() => setShowTally(true)}
          hideRanking={hideRanking}
        />
      )}
    </div>
  );
}
