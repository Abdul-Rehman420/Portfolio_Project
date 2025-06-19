"use client";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { MdOpenInNew } from "react-icons/md";
import parse from "html-react-parser";
import { useState, useCallback } from "react";
import YouTube from "react-youtube";

type Project = {
  id: string;
  title: string;
  details: string;
  longDetails: string;
  backendSourceCode: string;
  tags: string[];
  category: string;
  author: string;
  avatar: string;
  createdAt: string;
  sourceCode: string;
  liveLink: string;
  image: string;
  slideshowImages?: string[];
};

type ProjectPageProps = {
  project: Project;
};

const ProjectPage = ({ project }: ProjectPageProps) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleClick = () => router.back();

  const getYouTubeId = useCallback((url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }, []);

  const isYouTubeUrl = useCallback(
    (url: string) => url.includes("youtube.com") || url.includes("youtu.be"),
    []
  );

  const mediaItems = project.slideshowImages?.length
    ? project.slideshowImages
    : [project.image];

  const nextSlide = useCallback(() => {
    setIsVideoPlaying(false);
    setCurrentSlide((prev) =>
      prev === mediaItems.length - 1 ? 0 : prev + 1
    );
  }, [mediaItems.length]);

  const prevSlide = useCallback(() => {
    setIsVideoPlaying(false);
    setCurrentSlide((prev) =>
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  }, [mediaItems.length]);

  const goToSlide = useCallback((index: number) => {
    setIsVideoPlaying(false);
    setCurrentSlide(index);
  }, []);

  const onVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);

  const youtubeOpts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: isVideoPlaying ? 1 : 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  const currentMedia = mediaItems[currentSlide] || "";

  return (
    <div className="p-8 max-w-7xl mx-auto mt-28 mb-10 dark:bg-[#020617] bg-slate-100 rounded-xl border-[1px] dark:border-slate-500/10 border-slate-500/5">
      {/* Back Button */}
      <div className="pb-5">
        <HoverBorderGradient
          onClick={handleClick}
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-slate-800 bg-slate-100 text-sm text-slate-700 dark:text-slate-100 flex items-center"
        >
          <IoIosArrowBack className="font-extrabold text-lg mr-1 -ml-2" /> Back
        </HoverBorderGradient>
      </div>

      {/* Media Slider */}
      <div className="bg-blue-100 w-full h-full rounded-lg drop-shadow-md overflow-hidden relative">
        <div className="relative w-full h-full aspect-video">
          {isYouTubeUrl(currentMedia) ? (
            <div className="w-full h-full">
              <YouTube
                videoId={getYouTubeId(currentMedia || "") || undefined}
                opts={youtubeOpts}
                onPlay={onVideoPlay}
                className="w-full h-full aspect-video"
                iframeClassName="w-full h-full"
              />
            </div>
          ) : (
            <Image
              src={currentMedia.trim() || "/fallback.jpg"}
              width={1080}
              height={720}
              alt={`${project.title} - ${currentSlide + 1}`}
              className="w-full h-full object-cover"
              priority={currentSlide === 0}
            />
          )}

          {/* Navigation Controls */}
          {mediaItems.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 z-10 transition-all"
                aria-label="Previous slide"
              >
                <IoIosArrowBack />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 rotate-180 z-10 transition-all"
                aria-label="Next slide"
              >
                <IoIosArrowBack />
              </button>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {mediaItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentSlide === index
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentSlide + 1}/{mediaItems.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Project Details */}
      <div className="mt-6">
        <span className="p-2 text-xs mb-10 border-[2px] rounded-full">
          #{project.category}
        </span>
        <h2 className="lg:text-3xl text-xl font-bold mt-5">{project.title}</h2>
        <p className="mt-2 lg:max-w-5xl lg:text-base text-sm">
          {project.details}
        </p>

        {project.longDetails && (
          <div className="mt-4 prose dark:prose-invert max-w-none">
            {parse(project.longDetails)}
          </div>
        )}

        {project.tags.length > 0 && (
          <div className="flex mt-4">
            <div className="flex space-x-2 mt-2 flex-wrap items-center">
              <span className="font-semibold">Tags:</span>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs border rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        <div className="mt-6">
          <div className="flex items-center gap-x-2">
            <Image
              width={48}
              height={48}
              src={project.avatar}
              className="w-12 h-12 rounded-lg"
              alt={project.author}
            />
            <div>
              <p>{project.author}</p>
              <span className="text-xs leading-tight">
                Added At: {format(new Date(project.createdAt), "dd/MM/yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center mt-6 gap-x-5 flex-wrap gap-y-3">
          <a
            href={project.sourceCode}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HoverBorderGradient
              containerClassName="rounded-lg"
              as="button"
              className="dark:bg-slate-800 bg-slate-100 text-slate-700 dark:text-slate-100 flex items-center space-x-2 px-4 py-2"
            >
              <FaGithub className="font-extrabold text-lg mr-2" />
              <span>Github</span>
            </HoverBorderGradient>
          </a>

          {project.backendSourceCode && (
            <a
              href={project.backendSourceCode}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HoverBorderGradient
                containerClassName="rounded-lg"
                as="button"
                className="dark:bg-slate-800 bg-slate-100 text-slate-700 dark:text-slate-100 flex items-center space-x-2 px-4 py-2"
              >
                <FaGithub className="font-extrabold text-lg mr-2" />
                <span>Backend</span>
              </HoverBorderGradient>
            </a>
          )}

          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HoverBorderGradient
                containerClassName="rounded-lg"
                as="button"
                className="dark:bg-indigo-500 bg-indigo-500 text-slate-100 dark:text-slate-100 flex items-center space-x-2 px-4 py-2"
              >
                <MdOpenInNew className="font-extrabold text-lg mr-2" />
                <span>Live Demo</span>
              </HoverBorderGradient>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
