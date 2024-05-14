import { useTour } from "./use-tour";

export function useMapTour() {
  return useTour([
    { element: selector('layer-visibility'), popover: { description: 'Hiermee kunt u een laag aan en uit zetten' } },
    { element: selector('layer-variant-select'), popover: { description: 'Selecteer hiermee de variant van deze kaartlaag' } },
    { element: selector('layer-transparency'), popover: { description: 'Hiermee kunt u de transparantie van de kaartlaag aanpassen' } },
    { element: selector('layer-metadata'), popover: { description: 'Als u hier klikt dan ziet u meer informatie over de laag. Zoals bijv een samenvatting' } },
    { element: '.leaflet-control-geocoder-icon', popover: { description: 'Hiermee kunt uw op locatie zoeken' } },
  ])
}

function selector(id) {
  return `[data-tour-id="${id}"]`
}
