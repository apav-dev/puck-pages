import { BlogStarter_featuredBlogs } from "../types/autogen";
import { Image } from "@yext/sites-components";
import { formatDate } from "../utils";

export interface FeaturedBlogProps {
  blog: BlogStarter_featuredBlogs;
}

export const FeaturedBlog = ({ blog }: FeaturedBlogProps) => {
  return (
    <article
      key={blog.id}
      className="relative isolate flex flex-col gap-8 lg:flex-row"
    >
      <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
        {blog.blogStarter_coverPhoto && (
          <Image
            image={blog.blogStarter_coverPhoto}
            className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
          />
        )}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div>
        <div className="flex items-center gap-x-4 text-xs">
          <time dateTime={blog.datePosted} className="text-gray-500">
            {formatDate(blog.datePosted)}
          </time>
          <a
            href={`/${blog.slug}`}
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >
            {blog.name}
          </a>
          {blog.c_premium && (
            <div className="relative z-10 rounded-full bg-sky-200 px-3 py-1.5 font-medium text-gray-600 ">
              Premium
            </div>
          )}
        </div>
        <div className="group relative max-w-xl">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <a href={`/${blog.slug}`}>
              <span className="absolute inset-0" />
              {blog.name}
            </a>
          </h3>
          <p className="mt-5 text-sm leading-6 text-gray-600">
            {blog.blogStarter_description}
          </p>
        </div>
        <div className="mt-6 flex border-t border-gray-900/5 pt-6">
          <div className="relative flex items-center gap-x-4">
            <div className="text-sm leading-6">
              <p className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                <span className="absolute inset-0" />
                {blog.blogStarter_blogAuthor}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
