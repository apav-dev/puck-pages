export interface MainProps {
  children?: React.ReactNode;
}

export const Main = ({ children }: MainProps) => {
  return <div className="relative min-h-screen">{children}</div>;
};
