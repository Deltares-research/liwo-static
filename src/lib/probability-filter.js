// These identifiers originate from the excel file in the ETL process.
export const probabilityConfig = [
  { title: 'alles weergeven', identifier: 'no_filter' },
  { title: 'grote kans (groter dan 1:30)', identifier: 'lt30' },
  { title: 'middelgrote kans (1:30 tot 1:300)', identifier: 'f30t300' },
  { title: 'kleine kans (1:300 tot 1:3000)', identifier: 'f300t3000' },
  { title: 'zeer kleine kans (1:3000 tot 1:30.000)', identifier: 'f3000t30k' },
  { title: 'extreem kleine kans (kleiner dan 1:30.000)', identifier: 'gt30k' }
]

export const matchValueToProbability = (value) => {
  if (value < 30) {
    return 'lt30'
  } else if (value >= 30 && value <= 300) {
    return 'f30t300'
  } else if (value >= 300 && value <= 3000) {
    return 'f300t3000'
  } else if (value >= 3000 && value <= 30000) {
    return 'f3000t30k'
  } else if (value >= 30000) {
    return 'gt30k'
  }
}

export const probabilityTitles = probabilityConfig.map((entry) => entry.title)
