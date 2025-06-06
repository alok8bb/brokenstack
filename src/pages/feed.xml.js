import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';


export async function GET(context) {
    const posts = (await getCollection('blog')).sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    );

    return rss({
        title: 'Brokenstack',
        description: 'blog by alok',
        site: context.site,
        items: posts.map((post) => ({
            link: `/blog/${post.slug}/`,
            title: post.data.title,
            pubDate: post.data.pubDate.toLocaleDateString("en-in", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            description: post.data.description,
        })),
        customData: `<language>en-us</language>`,
    });
}