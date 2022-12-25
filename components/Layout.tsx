import Head from "next/head";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from 'next/link';

export const siteTitle = "Uyutaka's Blog";
export default function Layout({ children, home }) {
    return (
        <div className={styles.container}>
            <Head>
                <link ref="icon" href="/favicon.ico" />
            </Head>

            <header className={styles.header}>
                {home ? (
                    <>
                        <img src="/images/profile.png" className={`${utilStyles.borderCircle} ${styles.headerHomeImage}`} />
                        <h1 className={`${utilStyles.heading2x1}`}>
                            Uyutaka's Blog
                        </h1>
                    </>
                ) : (
                    <>

                        <Link href={`/`}>
                            <img src="/images/profile.png" className={`${utilStyles.borderCircle} ${styles.headerImage}`} />
                        </Link>

                        <h1 className={`${utilStyles.heading2x1}`}>
                            Uyutaka's Blog
                        </h1>
                    </>
                )}

            </header>
            <main>{children}</main>
        </div >
    );
}
