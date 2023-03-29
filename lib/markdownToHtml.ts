import { remark } from 'remark'
import remarkPrism from 'remark-prism'
import remarkToc from 'remark-toc'
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import { unified } from 'unified'
import html from 'remark-html'

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(html)
    .use(remarkToc)
    .use(remarkParse)
    .use(remarkPrism, { plugins: ["line-numbers"] })
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .process(markdown);
  return result.toString()
}
