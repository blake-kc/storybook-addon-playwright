import * as path from 'path';

export interface StoryPlaywrightFileInfo {
  name: string;
  path: string;
  dir: string;
}

export const getStoryPlaywrightFileInfo = (storyRelativeFilePath: string) => {
  const absolutePath = path.resolve(storyRelativeFilePath);
  const parsedFileName = path.parse(absolutePath);
  const name = `${parsedFileName.name}.playwright.json`;
  return {
    dir: parsedFileName.dir,
    name: name,
    path: path.join(path.dirname(absolutePath), name),
  };
};