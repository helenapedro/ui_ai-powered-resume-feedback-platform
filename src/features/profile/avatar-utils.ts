const MAX_AVATAR_DIMENSION = 1024;
const AVATAR_OUTPUT_QUALITY = 0.82;

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to load the image.'));
    };
    image.src = objectUrl;
  });
}

function getScaledDimensions(width: number, height: number): { width: number; height: number } {
  const longestSide = Math.max(width, height);
  if (longestSide <= MAX_AVATAR_DIMENSION) {
    return { width, height };
  }

  const scale = MAX_AVATAR_DIMENSION / longestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export async function optimizeAvatarFile(file: File): Promise<File> {
  const image = await loadImageFromFile(file);
  const { width, height } = getScaledDimensions(image.width, image.height);
  const outputType = file.type === 'image/png' ? 'image/png' : 'image/webp';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    const quality = outputType === 'image/png' ? undefined : AVATAR_OUTPUT_QUALITY;
    canvas.toBlob(resolve, outputType, quality);
  });

  if (!blob) {
    return file;
  }

  const extension = outputType === 'image/png' ? 'png' : 'webp';
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const optimizedFile = new File([blob], `${baseName}.${extension}`, { type: outputType });
  return optimizedFile.size < file.size ? optimizedFile : file;
}
