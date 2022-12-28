import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

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
    const allPostsData = fileNames.map((fileName) => {
        const id: string = fileName.replace(/\.md$/, "") // fileName(id)

        // extract info
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf-8");
        const matterResult = matter(fileContents);

        // return id and data
        return {
            id,
            ...(matterResult.data as { title: string; date: string; thumbnail: string }),
        };
    });
    return allPostsData;
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

    const blogContent = await remark().use(html).process(matterResult.content);
    const blogContentHTML = blogContent.toString();

    return {
        id,
        blogContentHTML,
        ...matterResult.data,
    };
}