import type { Passive, Skill } from "@/lib/schema";

interface SkillCardProps {
  skill: Skill;
  chargeLabel: string;
  forceChainLabel: string;
}

export function SkillCard({ skill, chargeLabel, forceChainLabel }: SkillCardProps) {
  return (
    <article className="panel p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-sm tracking-wide text-gold-400">
          {skill.name}
        </h3>
        {skill.charge !== null ? (
          <p className="text-xs text-abyss-300">
            {chargeLabel}
            <span className="ml-1 font-medium text-abyss-100">{skill.charge}</span>
          </p>
        ) : null}
      </header>
      <p className="mt-2 text-sm leading-relaxed text-abyss-200">{skill.effect}</p>
      {skill.forceChainEffect !== null ? (
        <div className="mt-3 rounded-md border border-crest-impact/30 bg-crest-impact/5 p-3">
          <p className="panel-heading text-crest-impact">{forceChainLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-abyss-200">
            {skill.forceChainEffect}
          </p>
        </div>
      ) : null}
    </article>
  );
}

interface PassiveCardProps {
  passive: Passive;
  awakenedLabel: string;
}

export function PassiveCard({ passive, awakenedLabel }: PassiveCardProps) {
  return (
    <article className="panel p-4">
      <h3 className="font-display text-sm tracking-wide text-abyss-100">
        {passive.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-abyss-200">{passive.effect}</p>
      {passive.awakenedEffect !== null ? (
        <div className="mt-3 rounded-md border border-gold-600/30 bg-gold-500/5 p-3">
          <p className="panel-heading">{awakenedLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-abyss-200">
            {passive.awakenedEffect}
          </p>
        </div>
      ) : null}
    </article>
  );
}
