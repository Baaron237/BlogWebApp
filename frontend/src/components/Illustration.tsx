/* eslint-disable @typescript-eslint/no-explicit-any */

import { ImageIcon } from "lucide-react";
import { API_URL } from "../constants/API_URL";
import { useState } from "react";
import Picker from "emoji-picker-react";
import { Smile } from "lucide-react";


const Illustration = ({ index, values, onChange, id } : { index: number, values: any, onChange: (index: number, updatedValues: object) => void, id: string | undefined}) => {
    const [imgCurrent, setImgCurrent] = useState<File | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value
        if(name === 'media') {
            values[name] = e.target.files[0]
            setImgCurrent(e.target.files[0]);
        } else {
            const updatedValues = { ...values, [name]: value };
            onChange(index, updatedValues);
        }
    };

    const onEmojiClick = (emojiData: { emoji: string }) => {
    const textarea = document.getElementById(`content-${index}`) as HTMLTextAreaElement;
    if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const newText = text.substring(0, start) + emojiData.emoji + text.substring(end);

        const updatedValues = { ...values, content: newText };
        onChange(index, updatedValues);

        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + emojiData.emoji?.length;
        }, 0);

        setShowEmojiPicker(false);
    }
};

  return (
        <div className='flex flex-col gap-2 mb-4'>
            <div className="relative w-full">
                <textarea
                    id={`content-${index}`}
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-14"
                    placeholder="Description"
                />
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-2 top-2 p-1 text-gray-600 hover:text-gray-800"
                >
                    <Smile className="w-5 h-5" />
                </button>
                {showEmojiPicker && (
                    <div className="absolute z-50 top-full right-0 mt-2">
                    <Picker onEmojiClick={(emojiData, event) => onEmojiClick(emojiData)} />
                    </div>
                )}
                </div>

            {
                !id ? (
                    <label style={{ width: imgCurrent ? '100%' : 'max-content'}} className="p-1 flex items-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                        {
                            imgCurrent ? (
                                <img 
                                    src={URL.createObjectURL(imgCurrent)} 
                                    alt="" 
                                    className="object-cover rounded-lg"
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <div className="flex items-center">
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                    <span className="text-sm text-gray-500">Add Media</span>
                                </div>
                            )
                        }
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleChange}
                            name='media' 
                            id='media'
                        />
                    </label>
                ) : (
                    <label className="w-full p-1 flex items-center border-2 border-dashed rounded-lg cursor-pointer">
                        <img 
                            src={
                                imgCurrent
                                    ? URL.createObjectURL(imgCurrent)
                                    : `${API_URL}/uploads/${values.url}`
                            }
                            alt="" 
                            crossOrigin="anonymous"
                        />
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleChange}
                            name='media' 
                            id='media'
                        />
                    </label>
                )
            }
        </div>
  )
}

export default Illustration
