import { useTour } from "./use-tour";

export function useAppTour() {
  return useTour([
    { element: selector('kaarten-link'), popover: { title: 'Kaarten', description: 'Hier kunt u alle kaarten vinden' } },
    { element: selector('over-liwo-link'), popover: { title: 'Over LIWO', description: 'Hier leest uw meer over LIWO' } },
  ])
}

function selector(id) {
  return `[data-tour-id="${id}"]`
}
