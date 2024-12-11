import Link from "next/link";

const BigNavigation: React.FC = () => {
  return (
    <nav className="hidden md:flex gap-4">
      <Link href="/">Home</Link>
      <Link href="/event">Events</Link>
      <Link href="/team">Teams</Link>
      <Link href="/resource">Resources</Link>
    </nav>
  );
};

export default BigNavigation;
