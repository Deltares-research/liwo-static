const layers = [
  {
    url: '/#/viewer/18',
    id: 'plaatsgebonden_kans_totaal_huidig_0'
  },
  {
    url: '/#/viewer/18',
    id: 'overstromingskansen_actueel_2019_faalkans_primair'
  },
  {
    url: '/#/viewer/18',
    id: 'overstromingskansen_actueel_faalkans_regionaal'
  },
  {
    url: '/#/viewer/1',
    id: 'MaximaleWaterdiepteNederland_Kaart5'
  }
]

export function getLayers () {
  // for now we return mock data, but this should be replaced with real data from a CSV file
  return layers
}
