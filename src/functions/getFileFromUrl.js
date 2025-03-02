export async function getFileFromUrl(
  imageUrl,
  filename = `${Date.now().toString()}.jpg`,
) {
  const cloudFunctionUrl = process.env.REACT_APP_cloudFunctionUrl;
  const response = await fetch(
    `${cloudFunctionUrl}?url=${encodeURIComponent(imageUrl)}`,
  );
  const blob = await response.blob();

  return new File([blob], filename, { type: blob.type });
}
