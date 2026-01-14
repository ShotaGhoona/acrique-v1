import type { UploadType } from '@/shared/domain/upload/model/types';

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'];
export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/postscript',
  'image/svg+xml',
];

export function getAcceptedTypes(uploadType: UploadType): string[] {
  switch (uploadType) {
    case 'logo':
      return [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES];
    case 'qr':
      return ACCEPTED_IMAGE_TYPES;
    case 'photo':
      return ACCEPTED_IMAGE_TYPES;
    default:
      return [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES];
  }
}

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
  if (
    !acceptedTypes.some(
      (type) =>
        file.type === type || file.name.endsWith(type.replace('*', '')),
    )
  ) {
    return '対応していないファイル形式です';
  }
  if (file.size > maxSize) {
    return `ファイルサイズは${formatFileSize(maxSize)}以下にしてください`;
  }
  return null;
}
