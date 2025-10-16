import Link from "next/link";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

//export type CalculatorNavLinkProps = { };

export default function CalculatorNavLink(
    //{ }: CalculatorNavLinkProps
) {

    return (
        <Link
            className="m-2 text-xl flex justify-baseline font-bold"
            href={`/`}
        >
            <ChevronLeftIcon className="mx-1"></ChevronLeftIcon>
            Calculator
        </Link>
    );
}
