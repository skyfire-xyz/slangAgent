import { ImageLoader } from "next/image";

export const defaultImageLoader: ImageLoader = ({ src }) => {
  return src;
};
