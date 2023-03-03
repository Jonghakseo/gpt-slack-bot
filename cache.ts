import * as fs from "fs";
import * as path from "path";

const CACHE_DIR = "./.cache"

const getCacheFilePath = (key: string) => {
  return path.resolve(CACHE_DIR, `${key.replace(".","-")}.json`)
}

export function getCacheData(key: string) {
  const filePath = getCacheFilePath(key)
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
  }catch {
    fs.writeFileSync(filePath, JSON.stringify([]))
  }
  const data = fs.readFileSync(filePath, 'utf8');
  const messages = JSON.parse(data)
  if (data.length > 3000){
    return cutArrayInHalf(messages)
  }
  return messages
}

export function setCacheData(key:string, data: unknown) {
  const filePath = getCacheFilePath(key)
  fs.writeFileSync(filePath, JSON.stringify(data));
}

function cutArrayInHalf<T>(arr:T[]):T[] {
  const arrayLength = arr.length
  const middleIndex = Math.floor(arrayLength / 2);
  const secondHalf = arr.slice(middleIndex, arrayLength - 1);
  return secondHalf;
}
