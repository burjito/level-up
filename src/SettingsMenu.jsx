import { useState } from 'react';
import ControlsMenu from './ControlsMenu.jsx';
import ConfirmModal from './ConfirmModal.jsx';
import { toggleBedMusic, useBedMusic } from './bedMusic.js';
import { useFullscreen } from './Fullscreen.jsx';

// One "Settings" button for the page-level options (background music, full screen, new game).
// onNewGame: pass it to show "New game" (it asks for confirmation first).
// onToggleHide + hideRanking: pass them to show "Hide ranking" (hides the top 3 on the board and while scoring).
export default function SettingsMenu({ onNewGame, onRegisterTeam, registrationLabel = 'Register a team', hideRanking, onToggleHide }) {
  const { enabled, missing } = useBedMusic();
  const fs = useFullscreen();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <ControlsMenu
        label="Settings"
        buttonClassName="h-9 justify-center px-4 py-0 text-sm"
        items={[
          { label: 'Background music', onSelect: toggleBedMusic, toggle: true, on: enabled, hidden: missing },
          { label: 'Full screen', onSelect: fs.toggle, toggle: true, on: fs.on, hidden: !fs.supported },
          { label: 'Hide ranking', onSelect: onToggleHide, toggle: true, on: !!hideRanking, hidden: !onToggleHide },
          { label: registrationLabel, onSelect: onRegisterTeam, hidden: !onRegisterTeam },
          { label: 'New game', onSelect: () => setConfirming(true), hidden: !onNewGame },
        ]}
      />
      {confirming && (
        <ConfirmModal
          title="Start a new game?"
          message="This clears all teams, scores and answered questions. This can't be undone."
          confirmLabel="Yes, start new game"
          onConfirm={() => { setConfirming(false); onNewGame(); }}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}
