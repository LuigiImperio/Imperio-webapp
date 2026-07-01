export type PartKey = "hoszivattyu" | "oszto" | "cso" | "esztrich" | "szigeteles" | "padlo"

export type SystemPart = {
  key: PartKey
  n: number
  label: string
  desc: string
}

export const systemParts: SystemPart[] = [
  {
    key: "hoszivattyu",
    n: 1,
    label: "Hőszivattyú",
    desc: "A kültéri levegő hőjéből állít elő fűtővizet, alacsony hőmérsékleten és hatékonyan — gázégés nélkül. A padlófűtés ehhez ideális, mert kis hőmérsékleten is jól fűt.",
  },
  {
    key: "oszto",
    n: 2,
    label: "Osztó-gyűjtő",
    desc: "Elosztja a fűtővizet a padlófűtési körök között, és körönként szabályozhatóvá teszi a hőmérsékletet helyiségenként.",
  },
  {
    key: "cso",
    n: 3,
    label: "Padlófűtés-cső",
    desc: "A meleg vizet keringeti a padlóban, nagy felületen. Az egyenletes hőleadás kellemes, huzatmentes, alacsony hőmérsékletű fűtést ad.",
  },
  {
    key: "esztrich",
    n: 4,
    label: "Esztrich (aljzatbeton)",
    desc: "Körülveszi a csöveket, eltárolja és egyenletesen sugározza a hőt a padló felé — így a felület stabilan, lassan adja le a meleget.",
  },
  {
    key: "szigeteles",
    n: 5,
    label: "Hőszigetelés",
    desc: "Lefelé nem engedi a hőt, így az energia a lakásba jut, nem a talaj felé. Enélkül sokat veszítene a rendszer.",
  },
  {
    key: "padlo",
    n: 6,
    label: "Padlóburkolat",
    desc: "A látható felület. Vékony, jó hővezető burkolat (pl. kőlap, csempe) ideális a padlófűtéshez.",
  },
]
