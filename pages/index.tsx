import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Layout, { siteTitle } from '../components/Layout';
import utilStyle from "../styles/utils.module.css";
import { getPostsData, Post } from '../lib/post';

// SSG
export async function getStaticProps() {
  const allPostsData: Post[] = getPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

type Props = {
  allPostsData: Post[]
}

export default function Home({ allPostsData }: Props) {
  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Layout>
        <section className={utilStyle.headingMd}><p>testtest..... explaination</p></section>
        <div className={styles.grid}>
          {allPostsData.map(({ id, title, date, thumbnail }) => (
            <article key={id}>
              <Link href={`/posts/${id}`}>
                <img src={`${thumbnail}`} className={styles.thumbnailImage} />
              </Link>
              <Link href={`/posts/${id}`} className={utilStyle.boldText}>
                {title}
              </Link>
              <br />
              <small className={utilStyle.lightText}>{date}</small>
            </article>
          ))}
        </div>
      </Layout>
    </div>
  )
}
