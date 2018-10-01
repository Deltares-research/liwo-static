export const probabilityConfig = [
  { title: 'alles weergeven', identifier: 'no_filter' },
  { title: 'grote kans (groter dan 1:30)', identifier: 'lt30' },
  { title: 'middelgrote kans (1:30 tot 1:300)', identifier: 'from30to300' },
  { title: 'kleine kans (1:300 tot 1:3000)', identifier: 'from300to3000' },
  { title: 'zeer kleine kans (1:3000 tot 1:30.000)', identifier: 'from3000to30000' },
  { title: 'extreem kleine kans (kleiner dan 1:30.000)', identifier: 'gt30000' }
]

export const probabilityTitles = probabilityConfig.map((entry) => entry.title)
