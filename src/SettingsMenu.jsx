import ControlsMenu from './ControlsMenu.jsx';
import { toggleBedMusic, useBedMusic } from './bedMusic.js';
import { useFullscreen } from './Fullscreen.jsx';

// One "Settings" button for the page-level options (background music, full screen)
export default function SettingsMenu() {
  const { enabled, missing } = useBedMusic();
  const fs = useFullscreen();
  return (
    <ControlsMenu
      label="Settings"
      buttonClassName="h-9 justify-center px-4 py-0 text-sm"
      items={[
        { label: 'Background music', onSelect: toggleBedMusic, toggle: true, on: enabled, hidden: missing },
        { label: 'Full screen', onSelect: fs.toggle, toggle: true, on: fs.on, hidden: !fs.supported },
      ]}
    />
  );
}
