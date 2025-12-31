"use client";

import dynamic from "next/dynamic";

const StickyCallBar = dynamic(
  () => import("./StickyCallBar"),
  { ssr: false }
);

export default function ClientStickyCallBar() {
  return <StickyCallBar />;
}
