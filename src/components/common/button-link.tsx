import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

export type ButtonLinkProps = Parameters<typeof Link>[0];

export default function ButtonLink(
    props: ButtonLinkProps
) {

    const textClasses = "text-center font-medium text-sm sm:text-base";
    const sizeClasses = "h-18 sm:h-22 px-4 py-1 sm:px-5 sm:py-2"; //w-full sm:w-auto md:w-[188px]
    const buttonClasses = "rounded-xl border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent";

    const allClasses = [
        textClasses,
        sizeClasses,
        buttonClasses,
        props.className
    ].join(" ");

    console.log(allClasses);

    return (
        <Link
            {...props}
            className={`${allClasses}`}
        >
            {props.children}
        </Link>
    );
}
 
 
