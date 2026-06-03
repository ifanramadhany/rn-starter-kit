import React from 'react';

import ContentCard from '../components/ContentCard';
import ScreenScaffold from '../components/ScreenScaffold';

export default function JournalScreen() {
  return (
    <ScreenScaffold title="Journal" subtitle="Reflection">
      <ContentCard
        title="Daily note"
        body="Capture thoughts, wins, blockers, and anything worth remembering."
      />
      <ContentCard
        title="Prompts"
        body="Add guided prompts for gratitude, lessons learned, and tomorrow's focus."
      />
      <ContentCard
        title="Entries"
        body="Build this screen into a searchable archive of past reflections."
      />
    </ScreenScaffold>
  );
}
