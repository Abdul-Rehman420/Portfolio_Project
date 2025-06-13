"use client";
import { useEffect, useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { HiViewGridAdd } from "react-icons/hi";
import { MdOpenInNew } from "react-icons/md";
import SkeletonUI2 from "./SkeletonUI2";

// Import local JSON
import projectData from "@/data/newData.json";

export function Projects() {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    try {
      // Simulate API delay
      setTimeout(() => {
        setData(projectData.project); // ✅ Fix: assign the `project` array only
        setIsLoading(false);
      }, 500);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  if (isError) {
    return <div>Failed to load projects.</div>;
  }

  const post = data?.slice(0, 6);

  return (
    <div className="bg-slate-100 dark:bg-[#020617] ">
      <div className="max-w-7xl mx-auto py-20 flex flex-col items-center justify-center px-4 lg:px-6">
        {/* Title Section */}
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 from-10% via-violet-500 via-30% to-sky-500 to-90%">
          My Projects
        </h2>
        <p className="mt-4 text-base leading-relaxed ">
          Here are some of my projects I have done.
        </p>

        {/* Skeleton UI */}
        {isLoading && (
          <div className="grid gap-6 py-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
            <SkeletonUI2 />
            <SkeletonUI2 />
            <SkeletonUI2 />
            <SkeletonUI2 />
            <SkeletonUI2 />
            <SkeletonUI2 />
          </div>
        )}

        {/* Project Cards */}
        {!isLoading && (
          <div className="grid gap-6 py-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
            {post?.map((post) => (
              <div
                key={post?.title}
                className="group relative border rounded-xl dark:bg-slate-900 bg-slate-100 shadow-md"
              >
                <Image
                  src={post?.image}
                  className="aspect-video w-full rounded-t-xl"
                  width={700}
                  height={500}
                  blurDataURL="blur"
                  placeholder="blur"
                  alt={post?.title}
                />
                <div className="min-h-min p-3">
                  <p className="mt-4 w-full text-xs font-semibold leading-tight">
                    #{post?.category.toLowerCase()}
                  </p>
                  <p
                    className="mt-4 flex-1 text-base font-semibold"
                    title={post?.title}
                  >
                    {post?.title.length > 40
                      ? post?.title.substring(0, 30).concat("...")
                      : post?.title}
                  </p>
                  <p
                    className="mt-2 w-full text-sm leading-normal"
                    title={post?.details}
                  >
                    {post?.details.length > 150
                      ? post?.details.substring(0, 80).concat("...")
                      : post?.details}
                  </p>
                </div>
                {/* Button Container */}
                <div className="absolute inset-x-0 bottom-3 flex justify-center items-center space-x-2 transition-all duration-300 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0">
                  <div>
                    <Link
                      href={post?.sourceCode}
                      target="_blank"
                      className="flex gap-x-1 items-center"
                    >
                      <HoverBorderGradient
                        containerClassName="rounded-lg"
                        as="button"
                        className="dark:bg-slate-800 bg-slate-100 text-slate-700 dark:text-slate-100 flex items-center space-x-2"
                      >
                        <FaGithub className="font-extrabold text-lg mr-1" />
                        GitHub
                      </HoverBorderGradient>
                    </Link>
                  </div>
                  {post?.liveLink && (
                    <div>
                      <Link href={post?.liveLink} target="_blank">
                        <HoverBorderGradient
                          containerClassName="rounded-lg"
                          as="button"
                          className="dark:bg-indigo-500 bg-slate-100 text-slate-700 dark:text-slate-100 flex items-center space-x-2"
                        >
                          <MdOpenInNew className="font-extrabold text-lg mr-1" />
                          Live
                        </HoverBorderGradient>
                      </Link>
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/project/${post?._id}`}
                      className="flex gap-x-1 items-center"
                    >
                      <HoverBorderGradient
                        containerClassName="rounded-lg"
                        as="button"
                        className="dark:bg-slate-800 bg-slate-100 text-slate-700 dark:text-slate-100 flex items-center space-x-2"
                      >
                        <HiViewGridAdd className="font-extrabold text-lg mr-1" />
                        Details
                      </HoverBorderGradient>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Section */}
        <div className="flex justify-center items-center text-center">
          <Link href={"/projects"}>
            <RainbowButton>More Projects</RainbowButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
