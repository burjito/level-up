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
    <div className="h-full">

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
