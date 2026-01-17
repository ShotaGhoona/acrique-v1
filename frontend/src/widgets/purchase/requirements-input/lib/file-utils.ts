export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'];
export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/postscript',
  'image/svg+xml',
];

export const DEFAULT_ACCEPTED_TYPES = [
  ...ACCEPTED_IMAGE_TYPES,
  ...ACCEPTED_DOCUMENT_TYPES,
];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateFile(
  file: File,
  acceptedTypes: string[],
  maxSize: number,
): string | null {
  const isValidType = acceptedTypes.some(
    (type) =>
      file.type === type ||
      (type.startsWith('.') && file.name.toLowerCase().endsWith(type.toLowerCase()))
  );
  if (!isValidType) {
    return '対応していないファイル形式です';
  }
  if (file.size > maxSize) {
    return `ファイルサイズは${formatFileSize(maxSize)}以下にしてください`;
  }
  return null;
}

export function getAcceptString(acceptTypes: string[]): string {
  return acceptTypes.join(',');
}
