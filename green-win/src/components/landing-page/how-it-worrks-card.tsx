import Icon from "../icon/Icon";

export default function HowItWorksCard({
  title,
  description,
  number,
  src,
}: {
  title: string;
  description: string;
  number: number;
  src: string;
}) {
  return (
    <div className="flex flex-row items-end gap-7 p-7 rounded-lg bg-base-100 shadow-custom">
      <p className="heading1 text-base-900">{number}</p>
      <div className="flex flex-col gap-0 items-center justify-center h-full">
        <div className="flex flex-row gap-3">
          <Icon src={src}></Icon>
          <p className="text-lg heading6 text-base-900">{title}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}
