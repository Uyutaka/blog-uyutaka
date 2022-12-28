import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from 'next/link';
import React from "react";
import { useRouter } from "next/router";

export const siteTitle = "Uyutaka's Blog";

type Props = {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    const home = useRouter().pathname === "/" ? true : false;
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                {home ? (
                    <>
                        <img src="/images/profile.png" className={`${utilStyles.borderCircle} ${styles.headerHomeImage}`} />
                        <h1 className={`${utilStyles.heading2x1}`}>
                            Uyutaka&apos;s Blog
                        </h1>
                    </>
                ) : (
                    <>

                        <Link href={`/`}>
                            <img src="/images/profile.png" className={`${utilStyles.borderCircle} ${styles.headerImage}`} />
                        </Link>

                        <h1 className={`${utilStyles.heading2x1}`}>
                            Uyutaka&apos;s Blog
                        </h1>
                    </>
                )}

            </header>
            <main>{children}</main>
        </div >
    );
}
