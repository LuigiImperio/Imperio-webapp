import type { Branch, StepKey, TopicKey } from "@/components/guided-request/guided-request-types"

export const topicMeta: Record<TopicKey, { label: string; desc: string }> = {
  viz: {
    label: "Vízszerelés",
    desc: "Csap, szanitercsere, lefolyó, vezetékjavítás.",
  },
  gaz: {
    label: "Gázszerelés",
    desc: "Gázkészülék, vezeték, bekötés, felülvizsgálat.",
  },
  futes: {
    label: "Fűtésszerelés / -korszerűsítés",
    desc: "Radiátor, padlófűtés, beszabályozás, karbantartás.",
  },
  kazan: {
    label: "Kazánjavítás / kazáncsere",
    desc: "Hibakód, leállás, csere, beüzemelés.",
  },
  hoszivattyu: {
    label: "Hőszivattyú telepítés",
    desc: "Tervezés, telepítés, hibrid rendszerek.",
  },
  furdo: {
    label: "Fürdőszoba-felújítás gépészete",
    desc: "Szaniterek, vezetékek, vízelvezetés.",
  },
  komplett: {
    label: "Komplett kivitelezés / felújítás",
    desc: "Több rendszert érintő gépészeti projekt.",
  },
}

export const everydayTopics: TopicKey[] = ["viz", "gaz", "futes", "kazan"]

export const symptomsByTopic: Record<string, string[]> = {
  viz: [
    "Csöpögő csap",
    "Eldugult lefolyó",
    "Szanitercsere",
    "Vezetékszivárgás",
    "Új bekötés",
    "Vízkőtelenítés",
  ],
  gaz: [
    "Gázkészülék hiba",
    "Szivárgásérzet",
    "Új vezeték",
    "Bekötés / áthelyezés",
    "Ellenőrzés",
  ],
  futes: [
    "Hideg radiátor",
    "Gyenge padlófűtés",
    "Beszabályozás",
    "Légtelenítés",
    "Szivattyúhiba",
    "Korszerűsítés",
  ],
  kazan: [
    "Hibakódot jelez",
    "Nem indul",
    "Zajos / lüktet",
    "Nincs meleg víz",
    "Csere tervezése",
    "Éves karbantartás",
  ],
}

export const urgentSymptoms = [
  "Csőtörés",
  "Szivárgás",
  "Beázás",
  "Leállt kazán",
  "Nincs meleg víz",
  "Elöntés / vízkár",
]

export const propertyTypes = ["Lakás", "Családi ház", "Társasház", "Üzleti ingatlan", "Egyéb"]

export const contactTimes = ["Délelőtt", "Délután", "Este", "Bármikor"]

export const scopeChoices = [
  "Komplett épületgépészet",
  "Fűtés és hőtermelés",
  "Víz és csőhálózat",
  "Fürdőszoba és szaniterek",
  "Hőszivattyús rendszer",
  "Több rendszer együtt",
]

export const scopePresetByTopic: Partial<Record<TopicKey, string>> = {
  furdo: "Fürdőszoba és szaniterek",
  hoszivattyu: "Hőszivattyús rendszer",
  komplett: "Komplett épületgépészet",
}

export const branchTitles: Record<Exclude<Branch, null>, string> = {
  surgos: "Sürgős hiba",
  hetkoznapi: "Hétköznapi probléma",
  projekt: "Nagyobb projekt",
}

export const stepLabelMap: Partial<Record<StepKey, string>> = {
  topic: "Terület",
  symptoms: "Részletek",
  scope: "Projekt",
  location: "Helyszín",
  contact: "Kapcsolat",
  extra: "Fotó és megjegyzés",
  summary: "Összegzés",
}
