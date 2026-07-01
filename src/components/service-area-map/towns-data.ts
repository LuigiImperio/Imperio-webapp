export type Town = {
  name: string
  x: number
  y: number
  big?: boolean
  note: string
}

export const towns: Town[] = [
  { name: "Pécs", x: 50, y: 56, big: true, note: "Központi bázisunk és a legtöbb munkánk helyszíne." },
  { name: "Kozármisleny", x: 65, y: 63, note: "Elsődleges, Pécs környéki szolgáltatási terület." },
  { name: "Pellérd", x: 37, y: 59, note: "Elsődleges, Pécs környéki szolgáltatási terület." },
  { name: "Gyód", x: 44, y: 64, note: "Elsődleges, Pécs környéki szolgáltatási terület." },
  { name: "Keszü", x: 41, y: 68, note: "Elsődleges, Pécs környéki szolgáltatási terület." },
  { name: "Pogány", x: 56, y: 73, note: "Elsődleges, Pécs környéki szolgáltatási terület." },
  { name: "Orfű", x: 39, y: 35, note: "Elsődleges, Pécs környéki szolgáltatási terület." },
  { name: "Abaliget", x: 30, y: 28, note: "Elsődleges, Pécs környéki szolgáltatási terület." },
  { name: "Komló", x: 60, y: 21, note: "Elsődleges, Pécs környéki szolgáltatási terület." },
  { name: "Hosszúhetény", x: 68, y: 35, note: "Elsődleges, Pécs környéki szolgáltatási terület." },
  { name: "Szentlőrinc", x: 17, y: 51, note: "Elsődleges, nyugati szolgáltatási terület." },
  { name: "Siklós", x: 49, y: 90, note: "Déli irány, rendszeresen vállalt helyszín." },
]
