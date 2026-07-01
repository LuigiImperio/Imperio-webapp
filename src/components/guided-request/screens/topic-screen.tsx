"use client"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { everydayTopics, topicMeta } from "@/components/guided-request/guided-request-data"
import { OptionCard } from "@/components/guided-request/shared/option-card"

export function TopicScreen() {
  const { state, selectTopic } = useGuidedRequest()

  return (
    <div>
      <h2 className="text-white text-[1.4rem] font-bold tracking-tight sm:text-[1.95rem]">Miről van szó?</h2>
      <p className="mt-3 text-[15px] leading-6 text-zinc-400">
        Válassza ki a legközelebbi területet.
      </p>
      <div className="mt-6 grid gap-2.5">
        {everydayTopics.map((topic) => (
          <OptionCard
            key={topic}
            title={topicMeta[topic].label}
            description={topicMeta[topic].desc}
            selected={state.topic === topic}
            onClick={() => selectTopic(topic)}
          />
        ))}
      </div>
    </div>
  )
}
