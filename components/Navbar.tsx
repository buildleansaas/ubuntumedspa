import React from "react";
import NextLink from "next/link";
import Image from "next/image";

interface NavbarProps {
  color?: string;
  sharedProductName?: string;
  sharedProductSlogan?: string;
}

export default function Navbar({
  color = "black",
  sharedProductName = "Ubuntu Med Spa",
  sharedProductSlogan = "Plasma Rich Platelet Health Therapy",
}: NavbarProps) {
  const padding = "4";

  return (
    <div className={`flex items-start justify-between w-full px-${padding} pt-${padding} z-10`}>
      <NextLink href="/" passHref>
        <div className={`flex items-center justify-start`}>
          <Image
            width={48}
            height={48}
            src={color === "black" ? "/ubuntu-black.png" : "/ubuntu.png"}
            alt="Ubuntu Med Spa logo"
          />
          <div className={`flex flex-col items-start justify-center ml-2 mt-0`}>
            <h1 className={`text-xl font-semibold text-${color} leading-tight`}>{sharedProductName}</h1>
            <p className={`mt-0 text-base font-normal text-${color} leading-tight`}>{sharedProductSlogan}</p>
          </div>
        </div>
      </NextLink>
    </div>
  );
}
