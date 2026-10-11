import { useState } from 'react';
import { CATEGORIES, buildQuestions } from './data.js';
import TeamRegistration from './TeamRegistration.jsx';
import GameBoard from './GameBoard.jsx';
import QuestionModal from './QuestionModal.jsx';
import Scoreboard from './Scoreboard.jsx';

export default function App() {
  const [teams, setTeams] = useState([]); // { id, name, color, score }
  const [questions, setQuestions] = useState(buildQuestions);
  // 'registration' | 'board' | 'question-active' | 'scoreboard'
  const [currentPhase, setCurrentPhase] = useState('registration');
  const [activeId, setActiveId] = useState(null);

  const active = questions.find((q) => q.id === activeId);
  const category = active && CATEGORIES.find((c) => c.id === active.categoryId);

  const openQuestion = (q) => {
    setActiveId(q.id);
    setCurrentPhase('question-active');
  };

  const awardPoints = (teamIds, points) =>
    setTeams((ts) => ts.map((t) => (teamIds.includes(t.id) ? { ...t, score: t.score + points } : t)));

  const returnToBoard = () => {
    setQuestions((qs) => qs.map((q) => (q.id === activeId ? { ...q, isAnswered: true } : q)));
    setActiveId(null);
    setCurrentPhase('board');
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* aurora backdrop gives the glass something to blur */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-violet-600/40 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-cyan-500/30 blur-[130px]" />
        <div className="absolute -bottom-48 left-1/4 h-[26rem] w-[26rem] rounded-full bg-fuchsia-600/25 blur-[120px]" />
      </div>

      {currentPhase === 'registration' && (
        <TeamRegistration teams={teams} setTeams={setTeams} onStart={() => setCurrentPhase('board')} />
      )}

      {currentPhase !== 'registration' && (
        <GameBoard categories={CATEGORIES} questions={questions} teams={teams} onPick={openQuestion} />
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
          onAward={(ids) => awardPoints(ids, active.points)}
          onReturn={returnToBoard}
        />
      )}
    </div>
  );
}
