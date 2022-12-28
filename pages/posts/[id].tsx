import Layout from "../../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/post";
import utilStyles from "../../styles/utils.module.css";
import Head from "next/head";

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}

type StaticProp = {
    params: { id: string }
}

export async function getStaticProps({ params }: StaticProp) {
    const postData = await getPostData(params.id);
    return {
        props: {
            postData,
        },
    };
}

type PostData = {
    id: string,
    blogContentHTML: string,
    title: string,
    date: string,
    thumbnail: string
}

type PostProp = {
    postData: PostData
}

export default function Post({ postData }: PostProp) {
    return (
        <Layout>
            <Head><title>{postData.title}</title></Head>
            <article>
                <h1 className={utilStyles.headingX1}>{postData.title}</h1>
                <div className={utilStyles.lightText}>{postData.date}</div>
                <div dangerouslySetInnerHTML={{ __html: postData.blogContentHTML }}></div>
            </article>
        </Layout>
    );
} 
