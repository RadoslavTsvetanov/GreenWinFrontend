type IconProps = {
  src: string;
  className?: string;
};

const Icon = ({ src, className }: IconProps) => {
  return (
    <div
      className={`w-6 h-6 ${className}`}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        backgroundColor: "currentColor",
      }}
    />
  );
};

export default Icon;
