import type { ReactNode } from "react";
import { Card, CardContent } from "./card";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: Props) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="font-medium text-[var(--foreground)]">{title}</p>
        {description ? <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">{description}</p> : null}
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
