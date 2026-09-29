import Image from "next/image";

export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <>
      <Image
        src="/logo-lcdr--light.png"
        alt="Logo de LCDR"
        width={256}
        height={189}
        className={`logo-light shrink-0 ${className}`}
      />
      <Image
        src="/logo-lcdr--dark.png"
        alt="Logo de LCDR"
        width={256}
        height={189}
        className={`logo-dark shrink-0 ${className}`}
      />
    </>
  );
}
