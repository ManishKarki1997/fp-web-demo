import { APP_CONFIG } from '@/config/config';
import { Button } from './ui/button';
import React from 'react'
import { XIcon } from 'lucide-react';

type UploadedImageViewerProps = {
  index: number;
  file: File | { url: string; name: string; isDeleted?: boolean; };
  onDelete?: (index: number, file: File | { url: string; name: string; isDeleted?: boolean; }) => void;
}

const UploadedImageViewer = ({ index, file, onDelete }: UploadedImageViewerProps) => {
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);

      // Cleanup function to revoke object URL
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      // If it's a custom object, just use the URL directly
      setUrl(APP_CONFIG.getStaticFileUrl(file.url));
    }
  }, [file]);

  return (
    <div className='relative group'>
      {/* <h4>{file.name}</h4> */}

      <div className="absolute invisible group-hover:visible -right-6 -top-6 z-10">
        <Button type="button" variant="link" onClick={() => onDelete && onDelete(index, file)}>
          <XIcon className='text-red-500' />
        </Button>
      </div>


      {url && (
        <img
          src={url}
          alt={file.name}
          className={`w-24 h-24 object-cover cursor-pointer border ${'isDeleted' in file && file?.isDeleted ? 'border-red-500 px-2 py-2' : ''} rounded`}
        />
      )}
    </div>
  );
}

export default UploadedImageViewer