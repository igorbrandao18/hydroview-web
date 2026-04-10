import { Badge } from "@/components/ui/badge";
import type { AssetTreeNode } from "@/lib/mock-pages";

const typeLabel: Record<AssetTreeNode["type"], string> = {
  parceiro: "Parceiro",
  condomínio: "Condomínio",
  torre: "Torre",
  reservatório: "Reservatório",
  dispositivo: "Dispositivo",
};

function Node({ node }: { node: AssetTreeNode }) {
  return (
    <li className="list-none">
      <div className="flex flex-wrap items-center gap-2 py-1.5">
        <Badge tone="neutral">{typeLabel[node.type]}</Badge>
        <span className="text-sm font-medium text-[var(--foreground)]">{node.label}</span>
        <span className="font-mono text-[0.625rem] text-[var(--muted)]">{node.id}</span>
      </div>
      {node.children && node.children.length > 0 ? (
        <ul className="ml-3 border-l border-[var(--border)] pl-4">
          {node.children.map((c) => (
            <Node key={c.id} node={c} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function AssetTree({ root }: { root: AssetTreeNode }) {
  return (
    <ul className="m-0 p-0">
      <Node node={root} />
    </ul>
  );
}
