import path from "path";
import fs from "fs";
import matter from "gray-matter";
import remarkPrism from 'remark-prism'
import remarkToc from 'remark-toc'
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import { unified } from 'unified'

const postsDirectory = path.join(process.cwd(), "posts");

export type Post = {
    id: string,
    title: string,
    date: string,
    thumbnail: string
}

// extract info from md
export function getPostsData(): Post[] {
    const fileNames = fs.readdirSync(postsDirectory);
    var allPostsData = fileNames.map((fileName) => {
        const id: string = fileName.replace(/\.md$/, "") // fileName(id)

        // extract info
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf-8");
        const matterResult = matter(fileContents);
        return {
            id,
            ...(matterResult.data as { title: string; date: string; thumbnail: string }),
        };
    });

    // Remove post's title starting with [WIP]
    allPostsData = allPostsData.filter((post) => {
        return !post?.title.includes("[WIP]");
    })

    // Sort by date
    allPostsData.sort((a, b) => {
        if (a!.date < b!.date) {
            return 1;
        } else {
            return -1;
        }
    });

    return allPostsData as Post[];
}

// get path via getStaticPath
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ""),
            },
        };
    });
}

// return article info based on id
export async function getPostData(id: string) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const matterResult = matter(fileContent);
    const result = await unified()
        .use(remarkToc)
        .use(remarkParse)
        .use(remarkPrism, { plugins: ["line-numbers"] })
        .use(remarkRehype)
        // .use(rehypeHighlight)  => use remarkPrism instead of rehypeHighlight
        .use(rehypeStringify)
        .use(rehypeSlug)
        .process(matterResult.content);
    const blogContentHTML = result.toString();



    return {
        id,
        blogContentHTML,
        ...matterResult.data,
    };
}
