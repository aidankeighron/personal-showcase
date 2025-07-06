export const backgroundColor = '#1E1F22';

export type Media = {
  id: string,
  uri: string,
  type: "image" | "video" | "livePhoto" | "pairedVideo" | "website" | undefined,
  width: number,
  height: number,
  rotation: number,
}