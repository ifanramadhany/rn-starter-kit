import React from 'react';

import ContentCard from '../components/ContentCard';
import ScreenScaffold from '../components/ScreenScaffold';

export default function StatsScreen() {
  return (
    <ScreenScaffold title="Stats" subtitle="Progress">
      <ContentCard
        title="Completion rate"
        body="Summarize habit consistency and daily completion trends over time."
      />
      <ContentCard
        title="Best days"
        body="Identify the days when routines feel strongest and easiest to maintain."
      />
      <ContentCard
        title="Patterns"
        body="Connect journal notes, missed habits, and calendar activity into useful insights."
      />
    </ScreenScaffold>
  );
}
