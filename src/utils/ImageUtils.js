import { APP, CONTENT_PATH } from "../constants";

export function getImagePath(image, title) {
  return APP.swasthApp === "CC" ? image && title + "/" + image : image;
}

export function getLessonImage(image) {
  return "https://d2ot3z5xcrn0h2.cloudfront.net/images/module_content/" + image;
}

export function getVideoPath(videoID) {
  return "https://d2ot3z5xcrn0h2.cloudfront.net/videos/" + videoID;
}

export function getCloudIDFromImageURL(image, type = cloudinaryPaths.lessons) {
  let path = "";
  if (image) {
    let imagePathSplitted = image.split("/");
    if (imagePathSplitted.length > 0) {
      path = imagePathSplitted[imagePathSplitted.length - 1];
      let n = path.lastIndexOf(".");
      switch (type) {
      }
      path = type + path.slice(0, n);
    }
  }
  return path;
}

export function getCloudIDFromImageName(image, type = cloudinaryPaths.lessons) {
  let path = "";
  if (image) {
    let n = image.lastIndexOf(".");
    path = type + image.slice(0, n);
    console.log("CLOUD_IMAGE_PATH", path);
  }
  return path;
}

export const cloudinaryPaths = {
  exercise: "dbt/png/exercises/",
  lessons: "dbt/png/lessons/"
};

export function getMeditationImage(filename) {
  const path = CONTENT_PATH + "meditations/meditation_icons/" + filename;
  console.log("MEDITATION IMAGE", path);
  return path;
}
