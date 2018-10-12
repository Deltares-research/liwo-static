export const probabilityConfig = [
  { title: 'alles weergeven', identifier: 'no_filter' },
  { title: 'grote kans (groter dan 1:30)', identifier: 'lt30' },
  { title: 'middelgrote kans (1:30 tot 1:300)', identifier: '30to300' },
  { title: 'kleine kans (1:300 tot 1:3000)', identifier: '300to3000' },
  { title: 'zeer kleine kans (1:3000 tot 1:30.000)', identifier: '3000to30k' },
  { title: 'extreem kleine kans (kleiner dan 1:30.000)', identifier: 'gt30k' }
]

export const probabilityTitles = probabilityConfig.map((entry) => entry.title)
