export default function CarrierBadge({
  name,
  brandColor,
}: {
  name: string;
  brandColor: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${brandColor}`}
    >
      {name}
    </span>
  );
}
