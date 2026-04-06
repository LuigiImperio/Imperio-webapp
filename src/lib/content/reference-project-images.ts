export type ReferenceProjectImage = {
  alt: string;
  caption: string;
  label: string;
  src: string;
};

const workImageDefinitions = [
  {
    label: "Helyszíni kivitelezés",
    caption: "Valós szerelési állapot rendezett kivitelezési részletekkel.",
  },
  {
    label: "Rendszerszintű gondolkodás",
    caption: "Összehangolt gépészeti elemek egy működő rendszer részeként.",
  },
  {
    label: "Gépészeti részlet",
    caption: "Közelkép egy precízen kialakított műszaki csomópontról.",
  },
  {
    label: "Szerelési pontosság",
    caption: "Pontosan vezetett kötési és szerelési részlet a helyszínen.",
  },
  {
    label: "Hálózati rendezés",
    caption: "Több rendszerkapcsolat összehangolt, átlátható elrendezésben.",
  },
  {
    label: "Kivitelezési ritmus",
    caption: "A kivitelezés közbeni állapot is rendezett és következetes.",
  },
  {
    label: "Műszaki hozzáférés",
    caption: "Jól hozzáférhető kialakítás a későbbi karbantartáshoz is.",
  },
  {
    label: "Rendszerelemek",
    caption: "Egymásra hangolt elemek, teljes rendszerként kezelve.",
  },
  {
    label: "Telepítési helyzetkép",
    caption: "Valós helyszíni állapotkép a telepítés közbeni munkáról.",
  },
  {
    label: "Illesztett megoldás",
    caption: "Az adott térhez illesztett kivitelezési megoldás.",
  },
  {
    label: "Gépészeti csomópont",
    caption: "Jól olvasható csomópont, precíz csatlakozásokkal és vezetéssel.",
  },
  {
    label: "Helyszíni finomhangolás",
    caption: "A véglegesítés előtt pontosított helyszíni műszaki részletek.",
  },
  {
    label: "Átgondolt vezetés",
    caption: "Rendezett nyomvonal és arányos elrendezés ugyanabban a térben.",
  },
  {
    label: "Rendszerkapcsolatok",
    caption: "Összetettebb rendszerkapcsolatok egy helyen összehangolva.",
  },
  {
    label: "Kivitelezési fegyelem",
    caption: "Következetes kivitelezési munka, tiszta műszaki renddel.",
  },
  {
    label: "Rendezett kivitel",
    caption: "A végeredmény műszakilag és vizuálisan is rendezett marad.",
  },
  {
    label: "Rendezett végeredmény",
    caption:
      "Elkészült rendszerkép, rendezett és hosszú távra vállalható kivitelben.",
  },
] as const;

export const aboutWorkImages: ReadonlyArray<ReferenceProjectImage> =
  workImageDefinitions.map((image, index) => {
    const imageNumber = String(index + 1).padStart(2, "0");

    return {
      src: `/images/about/work-${imageNumber}.jpg`,
      alt: `${image.label} – ${image.caption.replace(/\.$/, "")}`,
      ...image,
    };
  });

const featuredIndices = [0, 2, 4, 6, 8, 10, 13, 16] as const;

export const featuredReferenceProjectImages: ReadonlyArray<ReferenceProjectImage> =
  featuredIndices
    .map((index) => aboutWorkImages[index])
    .filter((image): image is ReferenceProjectImage => Boolean(image));
