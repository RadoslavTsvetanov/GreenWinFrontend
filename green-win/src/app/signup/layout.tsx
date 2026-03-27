import background from "@/assets/images/auth-background.png";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="min-h-screen min-w-screen bg-center bg-cover flex items-center justify-center bg-base-100/50">
        <div className="py-5">{children}</div>
      </div>
    </div>
  );
};

export default LoginLayout;
