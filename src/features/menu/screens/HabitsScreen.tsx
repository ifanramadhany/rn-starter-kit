import React from 'react';

import ContentCard from '../components/ContentCard';
import ScreenScaffold from '../components/ScreenScaffold';

export default function HabitsScreen() {
  return (
    <ScreenScaffold title="Habits" subtitle="Routine builder">
      <ContentCard
        title="Active habits"
        body="Track daily routines like hydration, exercise, reading, mindfulness, or sleep."
      />
      <ContentCard
        title="Streaks"
        body="See which habits are gaining momentum and where consistency needs support."
      />
      <ContentCard
        title="Adjust goals"
        body="Tune frequency, reminders, and difficulty so routines stay realistic."
      />
    </ScreenScaffold>
  );
}
