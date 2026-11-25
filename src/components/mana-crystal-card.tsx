import { CrestBadge, StanceTag } from "@/components/badges";
import type { ManaCrystal } from "@/lib/schema";

interface ManaCrystalCardProps {
  crystal: ManaCrystal;
  labels: {
    cost: string;
    maxChain: string;
    additional: string;
    auto: string;
    noCrest: string;
  };
}

export function ManaCrystalCard({ crystal, labels }: ManaCrystalCardProps) {
  return (
    <article className="panel flex flex-col gap-3 p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-sm tracking-wide text-abyss-100">
          {crystal.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <StanceTag stance={crystal.slot} />
          {crystal.crest !== null ? (
            <CrestBadge crest={crystal.crest} />
          ) : (
            <span className="inline-flex items-center rounded-md border border-abyss-600 bg-abyss-850 px-2 py-0.5 text-xs text-abyss-400">
              {labels.noCrest}
            </span>
          )}
        </div>
      </header>

      <dl className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <div className="flex gap-2">
          <dt className="text-abyss-400">{labels.cost}</dt>
          <dd className="font-display text-abyss-100">{crystal.cost}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-abyss-400">{labels.maxChain}</dt>
          <dd className="font-display text-abyss-100">{crystal.maxChain}</dd>
        </div>
      </dl>

      <p className="text-sm leading-relaxed text-abyss-200">{crystal.forceChain}</p>

      {crystal.forceChainAdditionalEffect !== null ? (
        <div className="rounded-md border border-crest-impact/30 bg-crest-impact/5 p-3">
          <p className="panel-heading text-crest-impact">{labels.additional}</p>
          <p className="mt-1 text-sm leading-relaxed text-abyss-200">
            {crystal.forceChainAdditionalEffect}
          </p>
        </div>
      ) : null}

      <p className="text-xs text-abyss-400">
        {labels.auto}: {crystal.autoCondition}
      </p>
    </article>
  );
}
