import { Auction } from "@/types/auction";
import { cn } from "@packtok/ui/lib/utils";
import { MachineCard } from "./machine-card";

const formatCurrency = (value: string, currency: string) => {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numeric);
  }
  return `${currency} ${value}`;
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
};

interface RegularBiddingSectionProps {
  auctions: Auction[];
  onSelectAuction: (auctionId: string) => void;
}

export function RegularBiddingSection({
  auctions,
  onSelectAuction,
}: RegularBiddingSectionProps) {
  return (
    <section className="w-full py-8 lg:py-12 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <h2
            className={cn(
              // Typography
              "text-3xl md:text-4xl lg:text-5xl font-black mb-4",

              // Colors
              "text-gray-900"
            )}
          >
            Regular Bidding
          </h2>
        </div>

        {auctions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
            No upcoming auctions have been scheduled yet.
          </div>
        ) : (
          <div
            className={cn(
              "flex gap-8 lg:gap-12 overflow-x-auto pb-4",
              "w-full",
              "scrollbar-hide"
            )}
          >
            {auctions.map((auction) => {
              const image =
                auction.product?.imagesThumbnail ??
                auction.product?.images?.[0] ??
                undefined;
              return (
                <MachineCard
                  key={auction.id}
                  machineName={auction.product?.title ?? "Untitled product"}
                  startingPrice={formatCurrency(
                    auction.startingAmount,
                    auction.currency
                  )}
                  imageUrl={image}
                  statusLabel={
                    auction.mode === "REVERSE" ? "Reverse" : "Forward"
                  }
                  meta={`Starts ${formatDateTime(auction.startAt)}`}
                  ctaLabel="View details"
                  onJoinAuction={() => onSelectAuction(auction.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
