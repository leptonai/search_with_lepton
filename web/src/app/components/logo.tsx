import Link from "next/link";

export function Logo({
  link = "/",
  text_size = "text-3xl",
  logosize = "64px",
}) {
  return (
    <div className="flex gap-4 items-center justify-center cursor-default select-none relative font-mono font-thin text-indigo-400 hover:text-indigo-600">

      <Link href={link}>
        <div className="flex items-center justify-center">
          <div>
            <img
              src="/sciphi_logo.png"
              style={{ width: logosize, height: logosize }}
            />
          </div>
          <div className={"ml-1 " + text_size}>SciPhi</div>
        </div>
      </Link>
    </div>
  );
}
