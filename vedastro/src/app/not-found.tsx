import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center mt-20">
      <h1>404</h1>
      <p>Page Not Found</p>

      <Link href="/">
        Go Home
      </Link>
    </div>
  );
}