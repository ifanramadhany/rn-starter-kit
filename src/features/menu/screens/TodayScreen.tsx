import React from 'react';

import ContentCard from '../components/ContentCard';
import ScreenScaffold from '../components/ScreenScaffold';

export default function TodayScreen() {
  return (
    <ScreenScaffold title="Today" subtitle="Daily focus">
      <ContentCard
        title="Morning check-in"
        body="Review your priorities and choose the habits that matter most today."
      />
      <ContentCard
        title="Today's plan"
        body="Keep the day simple with a short list of tasks, routines, and notes."
      />
      <ContentCard
        title="Evening reflection"
        body="Come back later to capture what worked and what needs attention tomorrow."
      />
    </ScreenScaffold>
  );
}
