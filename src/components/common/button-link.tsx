import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

export type ButtonLinkProps = Parameters<typeof Link>[0];

export default function ButtonLink(
    props: ButtonLinkProps
) {

    const textClasses = "text-center font-medium text-sm sm:text-base";
    const sizeClasses = "px-4 py-1 sm:px-6 sm:py-3"; //w-full sm:w-auto md:w-[188px]
    const buttonClasses = "rounded-xl border border-solid border-black/[.35] dark:border-white/[.35] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent";

    const allClasses = clsx(
        textClasses,
        sizeClasses,
        buttonClasses,
        props.className
    );

    return (
        <Link
            {...props}
            className={`${allClasses}`}
        >
            {props.children}
        </Link>
    );
}
 
 
