import type { ServiceRequestType } from "@/lib/service-requests/service-request-types"

export type ServicePageHighlight = {
  title: string
  description: string
}

export type ServicePageCluster = {
  title: string
  description: string
  items: readonly string[]
}

export type ServicePageRelatedLink = {
  href: string
  label: string
  description: string
}

export type ServicePageFaq = {
  question: string
  answer: string
}

export type ServicePageContent = {
  path: string
  sourcePage: string
  serviceType: ServiceRequestType
  metadata: {
    title: string
    description: string
    path: string
    openGraphTitle: string
    openGraphDescription: string
  }
  structuredData: {
    name: string
    description: string
  }
  hero: {
    title: string
    intro: string
    leadTitle: string
    leadDescription: string
    primaryCtaLabel: string
    highlights: readonly ServicePageHighlight[]
  }
  details: {
    eyebrow: string
    title: string
    intro: string
    clusters: readonly ServicePageCluster[]
    localNoteTitle: string
    localNote: string
    relatedLinks: readonly ServicePageRelatedLink[]
    faqs: readonly ServicePageFaq[]
  }
  formSection: {
    title: string
    intro: string
  }
}

export const servicePageContents = {
  csotoresSzivargas: {
    path: "/szolgaltatasok/csotores-szivargas",
    sourcePage: "csotores-szivargas",
    serviceType: "csotores_szivargas",
    metadata: {
      title: "Csőtörés, vízszivárgás és beázás bejelentése",
      description:
        "Csőtörés, vízszivárgás, rejtett csőhiba vagy beázás bejelentése Pécsen és környékén, rövid helyzetfelméréssel, képes pontosítással és gyorsabb első egyeztetéssel.",
      path: "/szolgaltatasok/csotores-szivargas",
      openGraphTitle:
        "Csőtörés, vízszivárgás és beázás | Imperio Gépészet",
      openGraphDescription:
        "Csőtöréshez, szivárgáshoz és beázási helyzetekhez készült célzott megkeresési oldal Pécsen és környékén.",
    },
    structuredData: {
      name: "Csőtörés, vízszivárgás és beázás",
      description:
        "Csőtöréshez, látható vagy rejtett vízszivárgáshoz, nedvesedéshez és beázáshoz készült megkeresési oldal gyors helyzetfelméréssel és opcionális képfeltöltéssel.",
    },
    hero: {
      title: "Csőtörés, vízszivárgás és beázás",
      intro:
        "Ha csőtörés, aktív szivárgás, nedvesedő fal vagy beázás látszik, itt gyorsan elindítható a megkeresés.",
      leadTitle: "Gyors indulás látható és rejtett szivárgásoknál",
      leadDescription:
        "Az első adatokból gyorsabban látszik, hogy aktív csőtörésről, kisebb, de sürgős vízszivárgásról vagy rejtett csőhibára utaló nedvesedésről van-e szó.",
      primaryCtaLabel: "Megkeresés indítása",
      highlights: [
        {
          title: "Csőtörés és aktív szivárgás",
          description:
            "Folyamatos vízszivárgás, csőrepedés vagy gyorsan romló helyzet esetén.",
        },
        {
          title: "Rejtett csőhiba gyanúja",
          description:
            "Ha a fal, a padló vagy a gépészeti tér nedvesedik, de a hiba forrása nem egyértelmű.",
        },
        {
          title: "Beázás és kárterület",
          description:
            "Ha már látható a nedvesedés, a foltosodás vagy a vízkár, érdemes ezt az útvonalat választani.",
        },
      ],
    },
    details: {
      eyebrow: "Részletesebb eligazítás",
      title: "Milyen helyzetekben érdemes ezzel az oldallal indulni?",
      intro:
        "Ez a szolgáltatásoldal nemcsak klasszikus csőtörésre való. Akkor is jó belépési pont, ha a probléma inkább vízszivárgásnak, nedvesedésnek vagy bizonytalan eredetű beázásnak látszik.",
      clusters: [
        {
          title: "Gyakori jelek",
          description:
            "Olyan panaszok, amelyek gyakran csőhibára vagy szivárgásra utalnak.",
          items: [
            "Csöpögő vagy folyamatosan szivárgó vezeték",
            "Nedvesedő fal, plafon vagy padló",
            "Beázás a fürdőszobában, konyhában vagy gépészeti térben",
            "Nem egyértelmű eredetű vízfolt vagy kárterület",
          ],
        },
        {
          title: "Tipikus feladatok",
          description:
            "A gyors helyzetfelmérés után ezekhez hasonló munkák körvonalazódhatnak.",
          items: [
            "Csőtörés vagy sérült csőszakasz feltárása",
            "Látható és rejtett vízszivárgás körülhatárolása",
            "A hibát érintő terület elsődleges javítási egyeztetése",
            "Beázáshoz kapcsolódó sürgősség és kárterület tisztázása",
          ],
        },
        {
          title: "Mikor ezt válassza?",
          description:
            "Nem kell pontos diagnózis az induláshoz, a helyzet rövid leírása is elég.",
          items: [
            "Ha a cső szivárog, de nem biztos, hol a hiba pontos helye",
            "Ha aktív a probléma, vagy újra és újra visszatér a nedvesedés",
            "Ha a víz elzárása sikerült vagy bizonytalan, de gyors egyeztetés kell",
            "Ha előbb a sürgősséget szeretné tisztázni, és csak utána a részleteket",
          ],
        },
      ],
      localNoteTitle: "Helyi szolgáltatási relevancia",
      localNote:
        "Pécsen, Kozármislenyben, Pellérden, Keszü környékén, Gyód felől, Orfű és a közeli baranyai települések irányából érkező megkereséseknél ez az egyik leggyakoribb sürgős belépési pont.",
      relatedLinks: [
        {
          href: "/szolgaltatasok/hibabejelentes",
          label: "Sürgős hibabejelentés",
          description:
            "Ha nemcsak szivárgás, hanem azonnali figyelmet igénylő összetettebb hiba is fennáll.",
        },
        {
          href: "/szolgaltatasok/vizszereles",
          label: "Víz- és gázszerelés",
          description:
            "Ha a helyzet inkább általános vízszerelési javításnak, szerelvényhibának vagy csapcserének tűnik.",
        },
        {
          href: "/#kapcsolat",
          label: "Kapcsolat és szolgáltatási terület",
          description:
            "Ha bizonytalan a megfelelő útvonalban, a kontaktblokkban röviden áttekinthető a következő lépés.",
        },
      ],
      faqs: [
        {
          question: "Mit érdemes tenni, ha csőtörés vagy vízszivárgás látszik?",
          answer:
            "Az első körben a helyzet rövid leírása, az érintett helyiség és az, hogy sikerült-e elzárni a vizet, már sokat segít. Ha van beázás vagy látható kárterület, ezt is érdemes jelezni.",
        },
        {
          question: "Rejtett szivárgás gyanújánál is ezt az oldalt érdemes használni?",
          answer:
            "Igen. Nem csak az egyértelmű csőtörésekhez jó indulás, hanem akkor is, ha a falban, padlóban vagy gépészeti térben feltételezhető vízszivárgás.",
        },
        {
          question: "Pécs környékéről is küldhető ilyen megkeresés?",
          answer:
            "Igen, az elsődleges fókusz Pécs és környéke. A közeli baranyai településekről érkező megkeresések is ugyanígy rögzíthetők és egyeztethetők.",
        },
      ],
    },
    formSection: {
      title: "Csőtörés vagy szivárgás bejelentése",
      intro:
        "Adja meg röviden, hogy aktív-e még a szivárgás, melyik terület érintett, és hogyan érhető el a legkönnyebben.",
    },
  } satisfies ServicePageContent,
  hibabejelentes: {
    path: "/szolgaltatasok/hibabejelentes",
    sourcePage: "hibabejelentes",
    serviceType: "hibabejelentes",
    metadata: {
      title: "Sürgős gépészeti hibabejelentés",
      description:
        "Sürgős víz-, gáz- és fűtési hibák, leállások és problémás helyzetek bejelentése Pécsen és környékén, rövid leírással, sürgősségi jelzéssel és képes pontosítással.",
      path: "/szolgaltatasok/hibabejelentes",
      openGraphTitle: "Sürgős gépészeti hibabejelentés | Imperio Gépészet",
      openGraphDescription:
        "Gyors hibabejelentési útvonal sürgős víz-, gáz- és fűtéstechnikai problémákhoz Pécsen és környékén.",
    },
    structuredData: {
      name: "Sürgős gépészeti hibabejelentés",
      description:
        "Sürgős víz-, gáz- és fűtéstechnikai problémák bejelentése rövid leírással, sürgősségi megadással és opcionális képfeltöltéssel.",
    },
    hero: {
      title: "Sürgős gépészeti hibabejelentés",
      intro:
        "Ha a hiba nem várhat, és gyors első egyeztetésre van szükség, ez a legjobb indulási pont.",
      leadTitle: "Gyors útvonal problémás helyzetekre",
      leadDescription:
        "A rövid adatrögzítés segít különválasztani a sürgős hibát a tervezhető megkeresésektől, így az első visszajelzés is rendezettebb alapból indul.",
      primaryCtaLabel: "Bejelentés indítása",
      highlights: [
        {
          title: "Víz-, gáz- és fűtési hibák",
          description:
            "Ha több rendszer közül nem egyértelmű, melyik okozza a gondot.",
        },
        {
          title: "Leállás vagy hirtelen meghibásodás",
          description:
            "Kazán, fűtés, melegvíz-ellátás vagy más gépészeti működési zavar esetén.",
        },
        {
          title: "Sürgősség már az elején",
          description:
            "A rövid bejelentésből látszik, mennyire időérzékeny a helyzet.",
        },
      ],
    },
    details: {
      eyebrow: "Mikor ez a legjobb út?",
      title: "Nem kell pontos diagnózis a hibabejelentéshez",
      intro:
        "A hibabejelentés akkor hasznos, ha a helyzet sürgős, bizonytalan vagy több rendszer is érintett lehet. Ez különösen akkor jó út, ha még nem tudja biztosan, hogy vízszerelési, fűtési vagy kazános oldalról kellene-e indulni.",
      clusters: [
        {
          title: "Tipikus sürgős helyzetek",
          description:
            "Olyan panaszok, amelyeknél gyors jelzés segíti a következő lépést.",
          items: [
            "Nincs meleg víz vagy leállt a fűtés",
            "Kazán nem indul, hibát jelez vagy bizonytalanul működik",
            "Hirtelen jelentkező szivárgás, csöpögés vagy vizesedés",
            "Gázkészülék vagy gépészeti rendszer körüli bizonytalan hiba",
          ],
        },
        {
          title: "Mit érdemes megadni?",
          description:
            "Már néhány gyakorlati adatból jobban látszik a hiba jellege.",
          items: [
            "Röviden, mi nem működik vagy miben változott a rendszer működése",
            "Mennyire sürgős a helyzet, és van-e teljes leállás",
            "Melyik településről érkezik a megkeresés",
            "Ha van, képfeltöltéssel is pontosítható a probléma",
          ],
        },
        {
          title: "Mikor jobb külön szolgáltatással indulni?",
          description:
            "Ha a helyzet közben pontosabban beazonosítható, külön szolgáltatási oldal is választható.",
          items: [
            "Aktív csőtörésnél vagy beázásnál a csőtörés / szivárgás oldal részletesebb",
            "Kazános hibánál vagy készülékcserénél a kazános oldal több műszaki adatot kér",
            "Tervezhető víz- vagy gázszerelési munkánál a víz- és gázszerelés oldal pontosabb kiindulást ad",
            "Komplex felújításnál vagy kivitelezésnél a komplett gépészeti oldal a jobb választás",
          ],
        },
      ],
      localNoteTitle: "Pécsi és környékbeli sürgős megkeresések",
      localNote:
        "Pécs és környéke a fő fókusz. A közeli baranyai településekről érkező sürgős megkeresések is ezen az útvonalon jelezhetők a legátláthatóbban.",
      relatedLinks: [
        {
          href: "/szolgaltatasok/csotores-szivargas",
          label: "Csőtörés / szivárgás",
          description:
            "Ha a sürgős probléma egyértelműen vízszivárgás, csőtörés vagy beázás jellegű.",
        },
        {
          href: "/szolgaltatasok/kazancsere",
          label: "Kazánjavítás / kazáncsere",
          description:
            "Ha a hiba a kazán működéséhez, hibakódjához vagy cseréjéhez kapcsolódik.",
        },
        {
          href: "/szolgaltatasok/futeskorszerusites",
          label: "Fűtési rendszerek",
          description:
            "Ha a gond inkább radiátoros, padlófűtéses vagy általános fűtési rendszerhez köthető.",
        },
      ],
      faqs: [
        {
          question: "Milyen problémáknál érdemes hibabejelentéssel indulni?",
          answer:
            "Akkor, ha a helyzet sürgős, hirtelen alakult ki, vagy még nem egyértelmű, hogy a víz-, gáz- vagy fűtési rendszer melyik része okozza a hibát.",
        },
        {
          question: "Ha nincs meleg víz vagy nem indul a kazán, ez a megfelelő út?",
          answer:
            "Igen. A hibabejelentés jó kiindulópont, különösen akkor, ha először a sürgősséget és a jelenlegi működési állapotot szeretné jelezni.",
        },
        {
          question: "Gázkészülék körüli bizonytalan hiba esetén is használható?",
          answer:
            "Igen. Ha a pontos ok még nem tiszta, a hibabejelentés segít röviden leírni a tapasztalt jelenséget, és ebből lehet továbbindulni a következő egyeztetésben.",
        },
      ],
    },
    formSection: {
      title: "Sürgős hibabejelentés",
      intro:
        "Adja meg röviden, mi nem működik, mennyire sürgős a helyzet, és hogyan érhető el a legkönnyebben.",
    },
  } satisfies ServicePageContent,
  kazancsere: {
    path: "/szolgaltatasok/kazancsere",
    sourcePage: "kazancsere",
    serviceType: "kazancsere",
    metadata: {
      title: "Kazánjavítás, kazáncsere és kazános hibák",
      description:
        "Kazánjavítás, kazáncsere, kazánhiba, hibakód, melegvíz- vagy fűtéskimaradás esetén indítható megkeresés Pécsen és környékén, strukturált adatbekéréssel.",
      path: "/szolgaltatasok/kazancsere",
      openGraphTitle:
        "Kazánjavítás, kazáncsere és kazános hibák | Imperio Gépészet",
      openGraphDescription:
        "Kazánjavításhoz, kazáncseréhez és kazános meghibásodásokhoz készült szolgáltatásoldal Pécsen és környékén.",
    },
    structuredData: {
      name: "Kazánjavítás, kazáncsere és kazános hibák",
      description:
        "Kazánjavításhoz, kazáncseréhez, kazánhibákhoz és készülékcseréhez készült megkeresési oldal átlátható adatbekéréssel és opcionális képfeltöltéssel.",
    },
    hero: {
      title: "Kazánjavítás, kazáncsere és kazános hibák",
      intro:
        "Ha a kazán nem indul, bizonytalanul működik, hibát jelez vagy a készülékcsere vált aktuálissá, itt elindítható a megkeresés.",
      leadTitle: "Kazános megkeresés röviden, felesleges körök nélkül",
      leadDescription:
        "A jelenlegi kazán típusa, működési állapota és a megkeresés oka már az elején tisztábban kirajzolja, javításról, hibakeresésről vagy tervezett cseréről van-e szó.",
      primaryCtaLabel: "Megkeresés indítása",
      highlights: [
        {
          title: "Kazán nem indul vagy hibát jelez",
          description:
            "Ha a készülék leállt, bizonytalanul működik vagy hibakódot mutat.",
        },
        {
          title: "Kazáncsere és korszerűsítés",
          description:
            "Ha az elavult berendezés cseréje, modernizálása vagy tervezett kiváltása a cél.",
        },
        {
          title: "Melegvíz és fűtés oldaláról is",
          description:
            "Ha a kazánhiba a melegvíz-ellátást vagy a fűtést is érinti.",
        },
      ],
    },
    details: {
      eyebrow: "Kazános szolgáltatási kör",
      title: "Javítás, csere vagy hibára utaló tünet: mind ugyaninnen indítható",
      intro:
        "A kazános megkeresés akkor is jó választás, ha még csak tünetet lát, például nincs meleg víz, nem indul a készülék vagy bizonytalan, hogy javítás vagy csere lenne a célszerűbb következő lépés.",
      clusters: [
        {
          title: "Gyakori tünetek",
          description:
            "Ilyen panaszoknál sokan kazánszerelőt vagy kazánjavítást keresnek.",
          items: [
            "Kazán nem indul vagy leáll működés közben",
            "Hibakód jelenik meg vagy bizonytalan a működés",
            "Nincs meleg víz vagy nem megfelelő a fűtési teljesítmény",
            "Régi vagy elavult készülék cseréje vált aktuálissá",
          ],
        },
        {
          title: "Tipikus munkák",
          description:
            "A megkeresésből gyorsan látszik, melyik irány valószínűbb.",
          items: [
            "Kazánhiba és működési állapot első tisztázása",
            "Tervezett vagy meghibásodás miatti kazáncsere egyeztetése",
            "Készüléktípushoz és ingatlanhoz kapcsolódó alapadatok rögzítése",
            "Képes kiegészítés adattábláról vagy a jelenlegi rendszerről",
          ],
        },
        {
          title: "Kapcsolódó helyzetek",
          description:
            "A kazános megkeresés gyakran fűtési és melegvízes panaszoknál is releváns.",
          items: [
            "Ha a kazánhiba mellett a fűtés is leállt vagy gyengén működik",
            "Ha a melegvíz-ellátás bizonytalan vagy megszűnt",
            "Ha családi házban vagy lakásban készülékcserét tervez",
            "Ha a jelenlegi rendszer állapota miatt korszerűsítés is szóba kerülhet",
          ],
        },
      ],
      localNoteTitle: "Pécs és környéki kazános megkeresések",
      localNote:
        "Kazánjavítási és kazáncsere megkeresések elsősorban Pécs és környéke irányából jellemzők, de a közeli baranyai helyszínek felől érkező kérések is ezen az oldalon indíthatók el.",
      relatedLinks: [
        {
          href: "/szolgaltatasok/hibabejelentes",
          label: "Sürgős hibabejelentés",
          description:
            "Ha először a sürgősséget szeretné jelezni, és a hiba azonnali figyelmet igényel.",
        },
        {
          href: "/szolgaltatasok/futeskorszerusites",
          label: "Fűtési rendszerek",
          description:
            "Ha a panasz nemcsak a kazánhoz, hanem radiátorhoz, padlófűtéshez vagy beszabályozáshoz is kapcsolódik.",
        },
        {
          href: "/szolgaltatasok/hoszivattyu-telepites",
          label: "Hőszivattyú telepítés",
          description:
            "Ha a készülékcsere mellett korszerűbb hőtermelő megoldás is szóba kerül.",
        },
      ],
      faqs: [
        {
          question: "Kazánhiba és kazáncsere esetén is ugyanitt érdemes kezdeni?",
          answer:
            "Igen. Ez az oldal a meghibásodás miatti javítási igényt és a tervezett készülékcserét is ugyanabba a rendezett megkeresési folyamatba tereli.",
        },
        {
          question: "Ha hibakódot jelez a kazán vagy nem indul, ezt is itt lehet jelezni?",
          answer:
            "Igen. Érdemes röviden leírni, mit tapasztal, és ha segít, képet is feltölteni a kijelzőről vagy az adattábláról.",
        },
        {
          question: "Kazáncsere előtt akkor is lehet megkeresést küldeni, ha még nem ismert minden műszaki részlet?",
          answer:
            "Igen. Az induláshoz a jelenlegi készülék alapadatai és a csere oka is elég lehet, a további részletek később pontosíthatók.",
        },
      ],
    },
    formSection: {
      title: "Kazános megkeresés",
      intro:
        "Adja meg a jelenlegi kazán alapadatait, a hiba vagy csere okát, és azt is, hogyan érhető el a legkönnyebben.",
    },
  } satisfies ServicePageContent,
  vizszereles: {
    path: "/szolgaltatasok/vizszereles",
    sourcePage: "vizszereles",
    serviceType: "vizszereles",
    metadata: {
      title: "Vízszerelés és gázszerelés Pécsen és környékén",
      description:
        "Vízszerelés és gázszerelés csapcsere, lefolyóprobléma, szaniterek, víznyomási gondok, gázvezeték- és gázkészülék-munkák esetén Pécsen és környékén.",
      path: "/szolgaltatasok/vizszereles",
      openGraphTitle: "Vízszerelés és gázszerelés | Imperio Gépészet",
      openGraphDescription:
        "Általános víz- és gázszerelési szolgáltatásoldal csapok, szaniterek, lefolyók, vízvezetékek és gázkészülékek körüli feladatokhoz.",
    },
    structuredData: {
      name: "Vízszerelés és gázszerelés",
      description:
        "Általános víz- és gázszerelési megkeresési oldal csapcsere, lefolyóprobléma, szaniterek, vízvezetékek, gázvezetékek és gázkészülékhez kapcsolódó munkák esetén.",
    },
    hero: {
      title: "Vízszerelés és gázszerelés",
      intro:
        "Itt indítható el a tipikus víz- és gázszerelési megkeresés, ha a feladat nem sürgős hiba, hanem javítás, csere vagy általános szerelési munka.",
      leadTitle: "Lakossági és általános szerelési munkákhoz",
      leadDescription:
        "A munka típusa, a sürgősség és a helyszín gyorsan láthatóvá teszi, hogy csapcseréről, lefolyóproblémáról, vízvezeték-javításról vagy gázszerelési feladatról van-e szó.",
      primaryCtaLabel: "Megkeresés indítása",
      highlights: [
        {
          title: "Csapcsere és szaniterek",
          description:
            "Ha csap, mosdó, WC vagy egyéb szaniter körüli javítás vagy csere aktuális.",
        },
        {
          title: "Lefolyó, vezeték, víznyomás",
          description:
            "Ha akadozik a víz, problémás a lefolyás vagy a vízoldali működés nem egyenletes.",
        },
        {
          title: "Gázvezeték és gázkészülék",
          description:
            "Ha a megkeresés gázvezetéket, gázkészüléket vagy ezek cseréjét érinti.",
        },
      ],
    },
    details: {
      eyebrow: "Szélesebb szerelési lefedés",
      title: "Nem csak általános vízszerelés: hétköznapi problémákra is",
      intro:
        "Az emberek sokszor nem szolgáltatásnévvel keresnek, hanem konkrét panasszal. Ez az oldal ezekhez a hétköznapi, mégis szakembert igénylő víz- és gázszerelési helyzetekhez ad tiszta belépési pontot.",
      clusters: [
        {
          title: "Gyakori otthoni problémák",
          description:
            "Ilyen helyzeteknél gyakran vízszerelőt vagy gázszerelőt keresnek.",
          items: [
            "Csöpögő csap vagy szükséges csapcsere",
            "Lefolyóprobléma vagy nehezen távozó víz",
            "Szaniterek, csatlakozások vagy szerelvények körüli hiba",
            "Vízoldali működési probléma vagy bizonytalan víznyomás",
          ],
        },
        {
          title: "Tipikus munkák",
          description:
            "A megkeresés során ezek a szerelési irányok szoktak kirajzolódni.",
          items: [
            "Általános vízszerelési javítás és csere",
            "Vízvezetékhez és bekötési ponthoz kapcsolódó szerelés",
            "Gázvezeték vagy gázkészülék szerelési igény",
            "Lakásban vagy családi házban végzett kisebb gépészeti munkák",
          ],
        },
        {
          title: "Mikor melyik másik út jobb?",
          description:
            "Ha a helyzet közben pontosabban körülírható, másik szolgáltatásoldal is releváns lehet.",
          items: [
            "Aktív szivárgásnál vagy beázásnál a csőtörés / szivárgás oldal részletesebb",
            "Sürgős, több rendszert érintő hibánál a hibabejelentés a legjobb belépési pont",
            "Kazános vagy fűtési panasznál a kazános, illetve fűtési oldal ad pontosabb keretet",
            "Nagyobb felújításnál vagy fürdőszoba-kiépítésnél a komplett gépészeti oldal a célszerű",
          ],
        },
      ],
      localNoteTitle: "Pécs környéki lakossági megkeresések",
      localNote:
        "Pécs, Kozármisleny, Pellérd, Keszü, Gyód, Orfű, Abaliget és a közeli baranyai helyszínek felől érkező víz- és gázszerelési megkeresésekhez ez az egyik legpraktikusabb kiindulópont.",
      relatedLinks: [
        {
          href: "/szolgaltatasok/csotores-szivargas",
          label: "Csőtörés / szivárgás",
          description:
            "Ha a probléma inkább aktív vízszivárgás, csőtörés vagy beázás jellegű.",
        },
        {
          href: "/szolgaltatasok/futeskorszerusites",
          label: "Fűtési rendszerek",
          description:
            "Ha a megkeresés inkább radiátorra, padlófűtésre vagy központi fűtési rendszerre vonatkozik.",
        },
        {
          href: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
          label: "Komplett épületgépészet",
          description:
            "Ha a szerelési munka felújítással, fürdőszobai gépészettel vagy nagyobb rendszerkiépítéssel függ össze.",
        },
      ],
      faqs: [
        {
          question: "Csapcsere, lefolyóprobléma vagy szanitercsere esetén is ez a jó oldal?",
          answer:
            "Igen. Az oldal kifejezetten az ilyen, hétköznapi vízszerelési megkeresésekhez is alkalmas, nem csak összetettebb műszaki munkákhoz.",
        },
        {
          question: "Gázvezetékhez vagy gázkészülékhez kapcsolódó munka is innen indítható?",
          answer:
            "Igen. A megkeresés során röviden jelezhető, hogy gázvezetékhez, gázkészülékhez vagy ezek cseréjéhez kapcsolódik a feladat.",
        },
        {
          question: "Ha csak annyi a panasz, hogy nem folyik rendesen a víz, akkor is küldhető megkeresés?",
          answer:
            "Igen. Nem kell kész diagnózis. A gyakorlati tünet rövid leírása is elegendő kiindulás az első egyeztetéshez.",
        },
      ],
    },
    formSection: {
      title: "Víz- vagy gázszerelési megkeresés",
      intro:
        "Röviden írja le, milyen jellegű munkáról van szó, mennyire sürgős, és milyen településről érkezik a megkeresés.",
    },
  } satisfies ServicePageContent,
  futeskorszerusites: {
    path: "/szolgaltatasok/futeskorszerusites",
    sourcePage: "futeskorszerusites",
    serviceType: "futeskorszerusites",
    metadata: {
      title: "Fűtésszerelés, radiátor és padlófűtés megkeresése",
      description:
        "Fűtésszerelés, radiátorproblémák, padlófűtés, beszabályozás, karbantartás és korszerűsítés megkeresése Pécsen és környékén, strukturált egyeztetéssel.",
      path: "/szolgaltatasok/futeskorszerusites",
      openGraphTitle:
        "Fűtésszerelés, radiátor és padlófűtés | Imperio Gépészet",
      openGraphDescription:
        "Fűtési rendszerekhez, radiátorokhoz és padlófűtéshez kapcsolódó megkeresési oldal karbantartási, javítási és korszerűsítési igényekhez.",
    },
    structuredData: {
      name: "Fűtésszerelés, radiátor és padlófűtés",
      description:
        "Fűtési rendszerekhez kapcsolódó megkeresési oldal radiátor-, padlófűtés-, karbantartási, optimalizálási és korszerűsítési igényekhez.",
    },
    hero: {
      title: "Fűtésszerelés, radiátor és padlófűtés",
      intro:
        "Ha a radiátor nem meleg, a padlófűtés nem ad elég hőt, zajos a rendszer vagy korszerűsítést tervez, innen indulhat a megkeresés.",
      leadTitle: "Fűtési panaszok és korszerűsítési igények egy helyen",
      leadDescription:
        "A jelenlegi rendszer típusa, a fő tünet és a korszerűsítési cél gyorsan megmutatja, hogy hibáról, karbantartásról, beszabályozásról vagy nagyobb fejlesztésről van-e szó.",
      primaryCtaLabel: "Megkeresés indítása",
      highlights: [
        {
          title: "Radiátor nem meleg",
          description:
            "Ha a radiátoros rendszer egyenetlenül működik, levegős vagy nem ad elég hőt.",
        },
        {
          title: "Padlófűtés és komfortgondok",
          description:
            "Ha a padlófűtés nem fűt megfelelően, vagy a rendszer finomhangolása vált szükségessé.",
        },
        {
          title: "Karbantartás és korszerűsítés",
          description:
            "Ha nemcsak hibaelhárítás, hanem optimalizálás vagy felújítással egybekötött fejlesztés a cél.",
        },
      ],
    },
    details: {
      eyebrow: "Fűtési rendszerintenciók",
      title: "Gyakorlati panaszoktól a rendszerfejlesztésig",
      intro:
        "Sokan nem fűtési rendszert keresnek, hanem azt a problémát fogalmazzák meg, hogy nem meleg a radiátor, levegős a rendszer vagy zajos a fűtés. Ez az oldal éppen ezekre a tipikus helyzetekre is alkalmas.",
      clusters: [
        {
          title: "Gyakori tünetek",
          description:
            "Ilyen panaszoknál gyakori keresés a fűtésszerelő vagy radiátorszerelő.",
          items: [
            "Nem meleg a radiátor vagy csak részben melegszik fel",
            "Levegős radiátor vagy egyenetlen fűtési teljesítmény",
            "Zajos fűtési rendszer, kattogás vagy áramlási zaj",
            "Padlófűtés nem fűt megfelelően vagy nem elég komfortos",
          ],
        },
        {
          title: "Kapcsolódó műszaki feladatok",
          description:
            "A megkeresés a javítási és a korszerűsítési irányt is lefedheti.",
          items: [
            "Karbantartás, átvizsgálás és szezon előtti ellenőrzés",
            "Beszabályozás, finomhangolás és energiahatékonyabb működés",
            "Termosztátok, szelepek és szivattyúk körüli egyeztetés",
            "Elavult rendszer korszerűsítése vagy felújítással egybekötött fejlesztés",
          ],
        },
        {
          title: "Mikor innen érdemes indulni?",
          description:
            "Nem kell tudnia, hogy radiátor-, padlófűtés- vagy kazánoldali eredetű a probléma.",
          items: [
            "Ha a hiba a fűtési komfortban jelentkezik, de a pontos ok még nem ismert",
            "Ha karbantartás, helyreállítás és korszerűsítés is szóba kerülhet",
            "Ha családi házban vagy lakásban a teljes rendszer működését érinti a panasz",
            "Ha a jelenlegi radiátoros vagy padlófűtéses rendszer fejlesztése a cél",
          ],
        },
      ],
      localNoteTitle: "Pécs és környéki fűtési megkeresések",
      localNote:
        "Pécs, Komló, Hosszúhetény, Kozármisleny és a környező baranyai települések felől érkező fűtésszerelési, radiátoros és padlófűtéses megkeresésekhez ez az egyik legjobb indulási pont.",
      relatedLinks: [
        {
          href: "/szolgaltatasok/kazancsere",
          label: "Kazánjavítás / kazáncsere",
          description:
            "Ha a fűtési gond mögött egyértelműen a kazán működése vagy cseréje áll.",
        },
        {
          href: "/szolgaltatasok/hibabejelentes",
          label: "Sürgős hibabejelentés",
          description:
            "Ha a fűtési leállás nem várhat, és először a sürgősséget szeretné jelezni.",
        },
        {
          href: "/szolgaltatasok/hoszivattyu-telepites",
          label: "Hőszivattyú telepítés",
          description:
            "Ha a korszerűsítés részeként új hőtermelő vagy teljesebb rendszerátalakítás merül fel.",
        },
      ],
      faqs: [
        {
          question: "Ha nem meleg a radiátor, ezt az oldalt érdemes választani?",
          answer:
            "Igen. A radiátoros panaszok, a levegős rendszer, az egyenetlen fűtés és a hasonló komfortgondok tipikusan ide tartoznak.",
        },
        {
          question: "Padlófűtésnél is ez a jó indulási pont?",
          answer:
            "Igen. A jelenlegi rendszer típusa a megkeresés elején megadható, így a padlófűtéshez kapcsolódó problémák vagy korszerűsítési igények is jól előkészíthetők.",
        },
        {
          question: "Karbantartás és korszerűsítés esetén is használható ez az oldal?",
          answer:
            "Igen. Nemcsak hiba esetén, hanem átvizsgálás, beszabályozás vagy nagyobb fűtéskorszerűsítési igény esetén is releváns.",
        },
      ],
    },
    formSection: {
      title: "Fűtési megkeresés",
      intro:
        "Adja meg a jelenlegi fűtési rendszer típusát, a fő problémát vagy korszerűsítési célt, és azt is, hogy melyik településről ír.",
    },
  } satisfies ServicePageContent,
  hoszivattyuTelepites: {
    path: "/szolgaltatasok/hoszivattyu-telepites",
    sourcePage: "hoszivattyu-telepites",
    serviceType: "hoszivattyu_telepites",
    metadata: {
      title: "Hőszivattyú telepítés és rendszerkiépítés",
      description:
        "Hőszivattyú telepítés, új építésű vagy felújított ingatlan gépészeti előkészítése, radiátoros vagy padlófűtéses rendszerhez illesztett egyeztetéssel Pécsen és környékén.",
      path: "/szolgaltatasok/hoszivattyu-telepites",
      openGraphTitle:
        "Hőszivattyú telepítés és rendszerkiépítés | Imperio Gépészet",
      openGraphDescription:
        "Hőszivattyús projektekhez készült szolgáltatásoldal műszaki alapadatokkal, rendszeroldali egyeztetéssel és strukturált megkereséssel.",
    },
    structuredData: {
      name: "Hőszivattyú telepítés és rendszerkiépítés",
      description:
        "Hőszivattyús projektekhez készült megkeresési oldal új építéshez, meglévő rendszer átalakításához, radiátoros vagy padlófűtéses kialakításhoz.",
    },
    hero: {
      title: "Hőszivattyú telepítés és rendszerkiépítés",
      intro:
        "Ha hőszivattyús rendszer kialakítását, új építésű ház gépészetét vagy meglévő fűtési rendszer korszerűsítését tervezi, innen indulhat a megkeresés.",
      leadTitle: "Műszaki alapokkal előkészített hőszivattyús indulás",
      leadDescription:
        "Az ingatlan típusa, a jelenlegi hőtermelő, a hőleadó oldal és a projekt szakasza már az elején láthatóvá teszi, mennyire előkészített a feladat.",
      primaryCtaLabel: "Megkeresés indítása",
      highlights: [
        {
          title: "Új építés vagy átalakítás",
          description:
            "Ha új rendszerkiépítésről vagy meglévő fűtési rendszer átalakításáról van szó.",
        },
        {
          title: "Radiátor vagy padlófűtés",
          description:
            "A jelenlegi vagy tervezett hőleadó oldal már a megkeresés elején rögzíthető.",
        },
        {
          title: "Kazánról hőszivattyúra",
          description:
            "Ha a meglévő gázkazános vagy egyéb hőtermelő rendszer kiváltása is felmerül.",
        },
      ],
    },
    details: {
      eyebrow: "Projekt- és rendszerintenciók",
      title: "Hőszivattyús projektekhez, nem csak egyetlen típusú feladathoz",
      intro:
        "A hőszivattyús megkeresések lehetnek új építéshez, meglévő családi ház korszerűsítéséhez vagy összetettebb rendszerátalakításhoz kapcsolódók. Ez az oldal az első műszaki egyeztetést készíti elő.",
      clusters: [
        {
          title: "Milyen projektekhez jó?",
          description:
            "A megkeresés már a projekt logikáját is láthatóvá teszi.",
          items: [
            "Új építésű ház gépészeti előkészítése",
            "Meglévő rendszer átalakítása hőszivattyús megoldásra",
            "Radiátoros vagy padlófűtéses rendszerhez illesztett tervezés",
            "Felújítás közben vagy kivitelezésre kész állapotban lévő projekt",
          ],
        },
        {
          title: "Műszaki alapadatok",
          description:
            "Az első egyeztetéshez ezek a kiinduló pontok a leghasznosabbak.",
          items: [
            "Jelenlegi hőtermelő: gázkazán, villanykazán vagy egyéb rendszer",
            "Hőleadó oldal: radiátor, padlófűtés vagy vegyes kialakítás",
            "Használati melegvíz-igény és elektromos háttér",
            "Projektfázis és rövid műszaki leírás",
          ],
        },
        {
          title: "Kapcsolódó keresési szándékok",
          description:
            "A hőszivattyús keresések sokszor korszerűsítési vagy teljes gépészeti projektként jelennek meg.",
          items: [
            "Fűtéskorszerűsítés családi házban",
            "Kazán kiváltása korszerűbb rendszerrel",
            "Új építésű ház teljes gépészeti kialakítása",
            "Padlófűtéses vagy vegyes rendszerhez illesztett hőtermelőváltás",
          ],
        },
      ],
      localNoteTitle: "Helyi fókusz, nagyobb projektekhez is",
      localNote:
        "A hőszivattyús megkeresések elsődleges fókusza Pécs és környéke. Összetettebb, nagyobb léptékű projektek esetén budapesti helyszín is szóba jöhet, egyedi egyeztetéssel.",
      relatedLinks: [
        {
          href: "/szolgaltatasok/futeskorszerusites",
          label: "Fűtési rendszerek",
          description:
            "Ha a megkeresés inkább a meglévő rendszer állapotából, komfortjából vagy korszerűsítéséből indul ki.",
        },
        {
          href: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
          label: "Komplett épületgépészet",
          description:
            "Ha a hőszivattyús rendszer egy nagyobb, teljesebb kivitelezési projekt része.",
        },
        {
          href: "/szolgaltatasok/kazancsere",
          label: "Kazánjavítás / kazáncsere",
          description:
            "Ha a kiindulópont inkább a meglévő kazán állapota, hibája vagy cseréje.",
        },
      ],
      faqs: [
        {
          question: "Új építésű ház gépészetéhez is innen érdemes indulni?",
          answer:
            "Igen, ha a hőszivattyú a projekt része. Az oldal az új építésű és a meglévő rendszer átalakításából induló megkereséseket is támogatja.",
        },
        {
          question: "Padlófűtéses és radiátoros rendszerhez is releváns ez a megkeresés?",
          answer:
            "Igen. A jelenlegi vagy tervezett hőleadó oldal a megkeresés elején megadható, így a rendszer típusa már a kezdetektől látszik.",
        },
        {
          question: "Budapesti projekt esetén is lehet hőszivattyús megkeresést küldeni?",
          answer:
            "Igen, de ez elsősorban nagyobb, összetettebb projektek esetén releváns. A pontos lehetőségek minden esetben külön egyeztetést igényelnek.",
        },
      ],
    },
    formSection: {
      title: "Hőszivattyús megkeresés",
      intro:
        "Adja meg a projekt jellegét, az ingatlan és a rendszer alapadatait, majd írja le röviden, milyen megoldásban gondolkodik.",
    },
  } satisfies ServicePageContent,
  komplettEpuletgepeszetiKivitelezes: {
    path: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
    sourcePage: "komplett-epuletgepeszeti-kivitelezes",
    serviceType: "komplett_epuletgepeszeti_kivitelezes",
    metadata: {
      title: "Komplett épületgépészeti kivitelezés és felújítás",
      description:
        "Komplett épületgépészeti kivitelezés, rendszerkiépítés, családi ház gépészet, fürdőszobai gépészeti munka és nagyobb felújítási projekt megkeresése Pécsen és környékén.",
      path: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
      openGraphTitle:
        "Komplett épületgépészeti kivitelezés és felújítás | Imperio Gépészet",
      openGraphDescription:
        "Nagyobb vagy összetettebb épületgépészeti projektekhez készült szolgáltatásoldal családi házakhoz, felújításokhoz és rendszerkiépítésekhez.",
    },
    structuredData: {
      name: "Komplett épületgépészeti kivitelezés és felújítás",
      description:
        "Komplex épületgépészeti kivitelezési oldal családi ház, lakásfelújítás, fürdőszobai gépészet, rendszerkiépítés és nagyobb projektmegkeresések számára.",
    },
    hero: {
      title: "Komplett épületgépészeti kivitelezés és felújítás",
      intro:
        "Ha a feladat túlmutat egyetlen javításon, és teljesebb gépészeti szemléletre van szükség, ez a megfelelő kiindulópont.",
      leadTitle: "Komplexebb projektekhez, tisztább műszaki kerettel",
      leadDescription:
        "A projekt jellege, az ingatlan típusa, a rendszer fókusza és az előkészítettség együtt már az első körben megmutatja, mennyire összetett megkeresésről van szó.",
      primaryCtaLabel: "Megkeresés indítása",
      highlights: [
        {
          title: "Teljes rendszerkiépítés",
          description:
            "Ha komplett víz-, gáz- és fűtési rendszer vagy több együttműködő gépészeti rész a téma.",
        },
        {
          title: "Felújítás és fürdőszobai gépészet",
          description:
            "Ha a projekt lakásfelújítással, fürdőszobai átépítéssel vagy korszerűsítéssel kapcsolódik össze.",
        },
        {
          title: "Családi ház, társasház, üzleti projekt",
          description:
            "Ha a megkeresés ingatlantípus és projektlépték szerint is összetettebb.",
        },
      ],
    },
    details: {
      eyebrow: "Projektalapú megkeresések",
      title: "Amikor már nem egy javításról, hanem teljesebb gépészeti feladatról van szó",
      intro:
        "Ez az oldal azokhoz a megkeresésekhez készült, ahol a feladat nem egyetlen hiba elhárítása, hanem új kiépítés, nagyobb felújítás, több rendszer együtt kezelése vagy átgondolt műszaki kivitelezés.",
      clusters: [
        {
          title: "Tipikus projektek",
          description:
            "Ilyen helyzetekben érdemes komplett épületgépészeti kivitelezőben gondolkodni.",
          items: [
            "Családi ház teljes vagy részleges gépészeti kialakítása",
            "Nagyobb felújításhoz kapcsolódó víz-, gáz- és fűtési rendszerkiépítés",
            "Fürdőszoba kiépítés vagy fürdőszobai gépészeti felújítás",
            "Társasházi, lakóépületi vagy üzlethelyiségi gépészeti feladat",
          ],
        },
        {
          title: "Műszaki fókuszok",
          description:
            "A projekt fókusza több különböző rendszerből is összeállhat.",
          items: [
            "Komplett épületgépészet és több rendszer összehangolása",
            "Fűtés és hőtermelés központi kérdései",
            "Víz és csőhálózat kialakítása vagy korszerűsítése",
            "Szaniterekhez, fürdőszobához vagy belső gépészethez kapcsolódó megoldások",
          ],
        },
        {
          title: "Mikor különösen releváns?",
          description:
            "Nem csak új építésnél, hanem szervezettebb felújításoknál is ideális indulás.",
          items: [
            "Ha a megkeresés generálkivitelezéshez vagy több szakág összehangolásához kapcsolódik",
            "Ha nagyobb felújítás közben kell rendezni a gépészeti oldalt",
            "Ha nem egyetlen eszköz vagy hiba, hanem teljes rendszerlogika a kérdés",
            "Ha a projekt Pécs környékén vagy nagyobb budapesti helyszínen valósulna meg",
          ],
        },
      ],
      localNoteTitle: "Helyi és nagyobb projektlogika",
      localNote:
        "Az elsődleges fókusz Pécs, környéke és a közeli baranyai települések. Nagyobb, összetettebb budapesti épületgépészeti projektek esetén szintén releváns lehet ez a megkeresési út.",
      relatedLinks: [
        {
          href: "/szolgaltatasok/hoszivattyu-telepites",
          label: "Hőszivattyú telepítés",
          description:
            "Ha a projekt fókusza elsősorban a hőszivattyús rendszer és annak műszaki előkészítése.",
        },
        {
          href: "/szolgaltatasok/vizszereles",
          label: "Víz- és gázszerelés",
          description:
            "Ha a feladat inkább általánosabb szerelési munka, és nem teljes kivitelezési projekt.",
        },
        {
          href: "/szolgaltatasok/futeskorszerusites",
          label: "Fűtési rendszerek",
          description:
            "Ha a megkeresés főként a meglévő fűtési rendszer állapotára, komfortjára vagy korszerűsítésére vonatkozik.",
        },
      ],
      faqs: [
        {
          question: "Családi ház teljes gépészeti kivitelezésére is ez a jó indulási pont?",
          answer:
            "Igen. Ha a projekt több rendszer összehangolt kialakítását vagy nagyobb léptékű gépészeti munkát igényel, ez az oldal a megfelelő belépési pont.",
        },
        {
          question: "Fürdőszoba-felújítás gépészeti oldala is ide tartozhat?",
          answer:
            "Igen. Ha a felújítás vízoldali, csőhálózati, szaniteres vagy összetettebb gépészeti egyeztetést igényel, ez az oldal releváns lehet.",
        },
        {
          question: "Budapesti projekt esetén is lehet komplett kivitelezési megkeresést küldeni?",
          answer:
            "Igen, de ez elsősorban a nagyobb, hitelesen projektjellegű feladatokra vonatkozik. A mindennapi helyi szolgáltatási fókusz továbbra is Pécs és környéke.",
        },
      ],
    },
    formSection: {
      title: "Épületgépészeti projektmegkeresés",
      intro:
        "Írja le röviden a projekt jellegét, az ingatlan típusát és azt, hogy melyik rendszer áll a középpontban, így az első egyeztetés is tisztább alapból indulhat.",
    },
  } satisfies ServicePageContent,
} as const satisfies Record<string, ServicePageContent>
