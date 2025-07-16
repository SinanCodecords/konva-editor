'use client';

import dynamic from "next/dynamic";
const ImageEditor = dynamic(() => import("@/image-editor/ImageEditor"), { ssr: false })


const page = () => {
  return (
    <div>
      <ImageEditor />
    </div>
  );
};
export default page;
