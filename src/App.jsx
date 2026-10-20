import { useEffect, useState } from 'react';
import { CATEGORIES, buildQuestions } from './data.js';
import TeamRegistration from './TeamRegistration.jsx';
import GameBoard from './GameBoard.jsx';
import QuestionModal from './QuestionModal.jsx';
import Scoreboard from './Scoreboard.jsx';
import FullScoreboard from './FullScoreboard.jsx';
import DesktopOnly, { useIsSmallScreen } from './DesktopOnly.jsx';
import { enterFullscreen } from './Fullscreen.jsx';
import { setBedPhase } from './bedMusic.js';

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
  const smallScreen = useIsSmallScreen();

  // background music plays on registration and the board, fades out while a question is open
  useEffect(() => { setBedPhase(smallScreen ? 'off' : currentPhase); }, [currentPhase, smallScreen]);

  useEffect(() => {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({ teams, answered: questions.filter((q) => q.isAnswered).map((q) => q.id), phase: currentPhase, activeId })
      );
    } catch {}
  }, [teams, questions, currentPhase, activeId]);

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

  const returnToBoard = () => {
    markAnswered(activeId);
    setActiveId(null);
    setCurrentPhase('board');
  };

  const newGame = () => {
    try { localStorage.removeItem(SAVE_KEY); } catch {}
    setTeams([]);
    setQuestions(buildQuestions());
    setActiveId(null);
    setShowTally(false);
    setCurrentPhase('registration');
  };

  if (smallScreen) return <DesktopOnly />; // the game state above is kept, so resizing back resumes it

  return (
    <div className="h-full">
      {currentPhase === 'registration' && (
        <TeamRegistration teams={teams} setTeams={setTeams} onStart={() => { enterFullscreen(); setCurrentPhase('board'); }} onNewGame={newGame} />
      )}

      {currentPhase !== 'registration' && (
        <GameBoard categories={CATEGORIES} questions={questions} teams={teams} onPick={openQuestion} onShowTally={() => setShowTally(true)} onNewGame={newGame} />
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
        />
      )}

      {showTally && <FullScoreboard teams={teams} onAdjust={adjustScore} onClose={() => setShowTally(false)} />}
    </div>
  );
}
