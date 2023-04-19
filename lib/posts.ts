import fs from "fs";
import path from "path";
import matter, { GrayMatterFile } from "gray-matter";
import { Blog } from "../types/blog";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export interface BlogIdParams {
  params: { id: string };
}

export function getAllPostIds(): BlogIdParams[] {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id: string): Promise<Blog> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult: GrayMatterFile<string> = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const blogData: Blog = {
    id: id,
    title: matterResult.data.title,
    date: matterResult.data.date,
    contentHtml: contentHtml
  };

  return blogData;
}

export function getSortedPostsData(): Blog[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id: string = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath: string = path.join(postsDirectory, fileName);
    const fileContents: string = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult: GrayMatterFile<string> = matter(fileContents);

    const blogData: Blog = {
      id: id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      contentHtml: null
    };

    console.log("Matter")
    console.log(JSON.stringify(blogData))

    return blogData;
  });
  // Sort posts by date
  const sortedPostsData: Blog[] = allPostsData.sort((a: Blog, b: Blog) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
  return sortedPostsData;
}
