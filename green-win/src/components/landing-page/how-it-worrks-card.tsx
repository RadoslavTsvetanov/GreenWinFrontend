export default function HowItWorksCard({
  title,
  description,
  number,
  icon,
}: {
  title: string;
  description: string;
  number: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-end gap-7 rounded-lg bg-base-100 shadow-custom">
      <p className="heading1 text-base-900">{number}</p>
      <div className="flex flex-col gap-0">
        <div className="flex flex-row gap-3">
          {icon}
          <p className="text-lg heading6 text-base-900">{title}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}
