import React from 'react';

import ContentCard from '../components/ContentCard';
import ScreenScaffold from '../components/ScreenScaffold';

export default function CalendarScreen() {
  return (
    <ScreenScaffold title="Calendar" subtitle="Schedule">
      <ContentCard
        title="Upcoming"
        body="Preview routines, journal prompts, and important moments across the week."
      />
      <ContentCard
        title="Monthly view"
        body="Use this screen as the foundation for a full habit and reflection calendar."
      />
      <ContentCard
        title="Planning notes"
        body="Reserve space for future events, recurring routines, and review sessions."
      />
    </ScreenScaffold>
  );
}
