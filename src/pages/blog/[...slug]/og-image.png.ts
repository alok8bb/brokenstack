import fs from "fs/promises";
import satori from "satori";
import sharp from "sharp";
import type { APIRoute } from "astro";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { getCollection, getEntry } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

export const GET: APIRoute = async function GET({ params, request }) {
  const { slug } = params;
  if (!slug) {
    return new Response("Not found", { status: 404 });
  }

  const post = await getEntry("blog", slug);
  const title = post?.data.title ?? "Not Found!";

  const dir = dirname(fileURLToPath(import.meta.url));
  const fontPaths = ["Inter-Regular.ttf", "Inter-Bold.ttf", "Inter-Medium.ttf"]
    .map(
      (font) => `${dir}/../../public/font/inter/${font}`,
    );

  const [interRegular, interBold, interMedium] = await Promise.all(
    fontPaths.map((path) => fs.readFile(path)),
  );

  const svg = await satori(
    {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              children: title,
              style: {
                fontSize: "4.6rem",
                marginTop: "40px",
                fontFamily: "Inter Bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
              },
            },
          },
          {
            type: "div",
            props: {
              children: [
                {
                  type: "img",
                  props: {
                    src:
                      "https://i.imgur.com/0RrOkQK.png",
                    style: {
                      width: "70px",
                      backgroundColor: "black",
                      height: "70px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "block",
                      border: "2px solid black",
                      boxShadow:
                        "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    children: [
                      {
                        type: "span",
                        props: {
                          children: "brokenstack by Alok",
                          style: {
                            fontSize: "2rem",
                            fontFamily: "Inter Medium",
                          },
                        },
                      },
                      {
                        type: "span",
                        props: {
                          children: "blog.alk.pw/",
                          style: {
                            fontSize: "1.3rem",
                          },
                        },
                      },
                    ],
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: "10px",
                    },
                  },
                },
              ],
              style: {
                display: "flex",
                marginTop: "auto",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          },
        ],
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "#fff",
          fontFamily: "Inter",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "50px 80px",
        },
      },
      key: "hi",
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter Bold",
          data: interBold,
          weight: 800,
          style: "normal",
        },
        {
          name: "Inter Medium",
          data: interMedium,
          weight: 600,
          style: "normal",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
