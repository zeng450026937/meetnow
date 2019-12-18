import { createEvents } from '../events';

export function createUsers() {
  const events = createEvents();
  return {
    ...events,
  };
}
