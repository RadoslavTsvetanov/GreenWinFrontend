export default function TickAndText({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-row gap-7">
      <img src="/Tick.svg" alt="Tick" />
      <div className="flex flex-col gap-3">
        <p className="heading7 text-primary-900">{title}</p>
        <p className="paragraph1-light text-base-700">{description}</p>
      </div>
    </div>
  );
}
