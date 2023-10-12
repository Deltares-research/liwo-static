import { useTour } from "./use-tour";

export function useMapTour() {
  return useTour([
    { element: selector('layer-visibility'), popover: { description: 'Hiermee kunt uw lagen aan en uit zetten' } },
  ])
}

function selector(id) {
  return `[data-tour-id="${id}"]`
}
