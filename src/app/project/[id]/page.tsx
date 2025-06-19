import { Metadata } from "next";
import ProjectPage from "./projectPage";
import data from "../../../../public/newData.json";

// ✅ TypeScript type definition
type Project = {
  id: string;
  title: string;
  details: string;
  longDetails: string;
  category: string;
  author: string;
  liveLink: string;
  sourceCode: string;
  backendSourceCode: string;
  image: string;
  slideshowImages : string[];
  avatar: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// ✅ Convert `_id` to `id` for internal usage
async function getProject(id: string): Promise<Project | null> {
  const projectList = (data as any).project;

  if (!Array.isArray(projectList)) return null;

  const project = projectList.find((p: any) => p._id === id);
  if (!project) return null;

  return {
    id: project._id,
    title: project.title,
    details: project.details,
    longDetails: project.longDetails,
    category: project.category,
    author: project.author,
    liveLink: project.liveLink,
    sourceCode: project.sourceCode,
    backendSourceCode: project.backendSourceCode,
    image: project.image,
    slideshowImages : project.slideshowImages,
    avatar: project.avatar,
    tags: project.tags,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    __v: project.__v,
  };
}

// ✅ SEO metadata generation
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;
  const project = await getProject(id);

  const title = project?.title || "Default Project Title";
  const description = project?.details || "Default Project Description";
  const image =
    project?.image ||
    "https://res.cloudinary.com/nodelove/image/upload/f_auto,q_auto/v1/mdranju/ngpfp5vkd5ky5wfst2ec";

  return {
    title,
    description,
    keywords: project?.tags || ["projects", "portfolio", "example"],
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
      siteName: "Md Ranju Portfolio",
      type: "website",
      url: `https://mdranju.xyz/project/${id}`,
    },
    twitter: {
      title,
      description,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
      card: "summary_large_image",
      site: "@muhammad_ranju",
    },
  };
}

// ✅ Render project page
const Project = async ({ params }: { params: { id: string } }) => {
  const project = await getProject(params.id);

  if (!project) {
    return <div>Project not found.</div>;
  }

  return <ProjectPage project={project} />;
};

export default Project;
