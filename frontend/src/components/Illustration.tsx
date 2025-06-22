/* eslint-disable @typescript-eslint/no-explicit-any */

import { ImageIcon } from "lucide-react";
import { API_URL } from "../constants/API_URL";
import { useState } from "react";

const Illustration = ({ index, values, onChange, id } : { index: number, values: any, onChange: (index: number, updatedValues: object) => void, id: string | undefined}) => {
    const [imgCurrent, setImgCurrent] = useState<File | null>(null);
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
  return (
        <div className='flex flex-col gap-2 mb-4'>
            <div className='w-full flex flex-col xs:flex-row gap-1 xs:items-center'>
                <textarea name="content" value={values.content} onChange={handleChange}  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-14" placeholder='Description'></textarea>
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
