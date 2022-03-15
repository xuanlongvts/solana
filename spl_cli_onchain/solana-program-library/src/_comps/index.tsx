import Link from "next/link";

export const HeaderElement = (title: string) => {
    return (
        <div className="headEle">
            <Link href="/">
                <a>Back</a>
            </Link>{" "}
            <h2>{title}</h2>
        </div>
    );
};
