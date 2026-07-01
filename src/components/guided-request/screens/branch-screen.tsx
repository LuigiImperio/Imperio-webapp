"use client"

import { Building2, TriangleAlert, Wrench } from "lucide-react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { OptionCard } from "@/components/guided-request/shared/option-card"

export function BranchScreen() {
  const { pickUrgent, pickEveryday, pickProject } = useGuidedRequest()

  return (
    <div>
      <p className="text-[11.5px] tracking-[0.22em] text-[#c89758] uppercase">
        Vezetett megkeresés
      </p>
      <h2 className="mt-3 text-white text-[1.5rem] font-bold tracking-tight sm:text-[2.1rem]">
        Mi a helyzet?
      </h2>
      <p className="mt-3 max-w-[34rem] text-[15px] leading-6 text-zinc-400">
        Válassza ki, mi áll a legközelebb a helyzetéhez. Pár lépés, és visszajelzünk.
      </p>

      <div className="mt-6 grid gap-3">
        <OptionCard
          title="Sürgős hiba"
          description="Csőtörés, beázás, leállt kazán, nincs meleg víz"
          icon={<TriangleAlert className="size-6" />}
          onClick={pickUrgent}
        />
        <OptionCard
          title="Hétköznapi probléma"
          description="Csap, radiátor, kazán, gáz, szanitercsere"
          icon={<Wrench className="size-6" />}
          onClick={pickEveryday}
        />
        <OptionCard
          title="Nagyobb projekt"
          description="Felújítás, hőszivattyú, fürdőszoba, új kiépítés"
          icon={<Building2 className="size-6" />}
          onClick={pickProject}
        />
      </div>
    </div>
  )
}
