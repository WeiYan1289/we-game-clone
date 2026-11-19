import Image from "next/image";

const RATIO = 194 / 49; // intrinsic aspect ratio of icon-logo.svg (mark + wordmark)

/** WeGame logo lock-up. `height` drives the size; width follows the aspect ratio. */
export function Logo({ height = 28 }: { height?: number }) {
  return <Image src="/images/icon-logo.svg" alt="WeGame" width={Math.round(height * RATIO)} height={height} priority />;
}
