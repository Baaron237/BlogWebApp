import React, { useState, useEffect } from "react";
import { Upload, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const MediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    // const { data, error } = await supabase.storage.from("media").list();
    // if (error) {
    //   toast.error("Failed to fetch media");
    //   return;
    // }
    // const mediaUrls = await Promise.all(
    //   data.map(async (file) => {
    //     const {
    //       data: { publicUrl },
    //     } = supabase.storage.from("media").getPublicUrl(file.name);
    //     return {
    //       ...file,
    //       url: publicUrl,
    //     };
    //   })
    // );
    // setMedia(mediaUrls);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);

    try {
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // const { error: uploadError } = await supabase.storage
        //   .from("media")
        //   .upload(filePath, file);

        // if (uploadError) {
        //   throw uploadError;
        // }
      }

      toast.success("Media uploaded successfully");
      fetchMedia();
    } catch (error) {
      toast.error("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    // const { error } = await supabase.storage.from("media").remove([fileName]);

    // if (error) {
    //   toast.error("Failed to delete media");
    //   return;
    // }

    toast.success("Media deleted successfully");
    fetchMedia();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Media Library</h2>
        <label className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer">
          <Upload className="w-5 h-5 mr-2" />
          Upload Media
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((file: any) => (
          <div key={file.name} className="relative group">
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <button
                onClick={() => handleDelete(file.name)}
                className="p-2 bg-red-600 text-white rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaLibrary;
