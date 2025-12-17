import type { Metadata } from "next";
import AuctionDetailClient from "./auction-detail-client";

interface AuctionPageProps {
  params: Promise<{
    auctionId: string;
  }>;
}

async function getAuction(auctionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${baseUrl}/api/v1/auctions/${auctionId}`, {
      next: { revalidate: 60 }, // Revalidate every minute for SEO
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: AuctionPageProps): Promise<Metadata> {
  const { auctionId } = await params;
  const auction = await getAuction(auctionId);

  if (!auction) {
    return {
      title: "Auction Not Found | Packtok",
    };
  }

  const title = auction.product?.title || "Auction Details";
  const description = auction.product?.description || `Join the bidding for ${title}. Current amount: ${auction.currency} ${auction.currentAmount || auction.startingAmount}`;

  return {
    title: `${title} | Live Bidding | Packtok`,
    description,
    openGraph: {
      title: `${title} | Packtok Bidding`,
      description,
      images: auction.product?.images?.[0] ? [{ url: auction.product.images[0] }] : [],
    },
  };
}

export default async function Page({ params }: AuctionPageProps) {
  const { auctionId } = await params;

  return <AuctionDetailClient auctionId={auctionId} />;
}
