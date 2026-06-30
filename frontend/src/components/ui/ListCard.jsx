import React from "react";
import Card, { CardHeader, CardLink } from "./Card";
import { TicketDateBadge } from "./Badge";

export default function ListCard({
  title,
  subtitle,
  viewAllTo,
  viewAllLabel = "Ver tudo",
  items = [],
  emptyMessage = "Nenhum item encontrado.",
  renderItem,
}) {
  return (
    <Card padding="p-0" className="overflow-hidden">
      <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <CardHeader
          title={title}
          subtitle={subtitle}
          action={
            viewAllTo ? (
              <CardLink to={viewAllTo}>{viewAllLabel}</CardLink>
            ) : null
          }
        />
      </div>

      <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col gap-4">
        {items.length === 0 && (
          <p className="text-muted text-textMuted py-4">{emptyMessage}</p>
        )}

        {items.map((item, index) =>
          renderItem ? (
            renderItem(item, index)
          ) : (
            <ListCardItem key={item.id ?? index} {...item} />
          )
        )}
      </div>
    </Card>
  );
}

export function ListCardItem({ month, day, title, meta, trailing }) {
  return (
    <div className="flex items-center gap-4 py-2">
      {(month || day) && <TicketDateBadge month={month} day={day} />}
      <div className="flex-1 min-w-0">
        <p className="text-body font-semibold text-text truncate">{title}</p>
        {meta && (
          <p className="text-muted text-textMuted mt-0.5 truncate">{meta}</p>
        )}
      </div>
      {trailing}
    </div>
  );
}
