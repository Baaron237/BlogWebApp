import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ThemeEditor = () => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    const { data, error } = await supabase
      .from("themes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch themes");
      return;
    }

    setThemes(data || []);
  };

  const handleThemeUpdate = async (theme: any) => {
    const { error } = await supabase
      .from("themes")
      .update(theme)
      .eq("id", theme.id);

    if (error) {
      toast.error("Failed to update theme");
      return;
    }

    toast.success("Theme updated successfully");
    fetchThemes();
  };

  const createNewTheme = async () => {
    const newTheme = {
      name: "New Theme",
      primary_color: "#ffffff",
      secondary_color: "#f3f4f6",
      background_color: "#e5e7eb",
      text_color: "#111827",
      is_active: false,
    };

    const { error } = await supabase.from("themes").insert([newTheme]);

    if (error) {
      toast.error("Failed to create theme");
      return;
    }

    toast.success("Theme created successfully");
    fetchThemes();
  };

  const deleteTheme = async (id: string) => {
    const { error } = await supabase.from("themes").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete theme");
      return;
    }

    toast.success("Theme deleted successfully");
    fetchThemes();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Theme Editor</h2>
        <button
          onClick={createNewTheme}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Theme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themes.map((theme: any) => (
          <div key={theme.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={theme.name}
                onChange={(e) =>
                  handleThemeUpdate({ ...theme, name: e.target.value })
                }
                className="text-lg font-medium bg-transparent border-b border-transparent focus:border-gray-300 focus:outline-none"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleThemeUpdate({ ...theme, is_active: !theme.is_active })
                  }
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {theme.is_active ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => deleteTheme(theme.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={theme.primary_color}
                  onChange={(e) =>
                    handleThemeUpdate({
                      ...theme,
                      primary_color: e.target.value,
                    })
                  }
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={theme.secondary_color}
                  onChange={(e) =>
                    handleThemeUpdate({
                      ...theme,
                      secondary_color: e.target.value,
                    })
                  }
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  value={theme.background_color}
                  onChange={(e) =>
                    handleThemeUpdate({
                      ...theme,
                      background_color: e.target.value,
                    })
                  }
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <input
                  type="color"
                  value={theme.text_color}
                  onChange={(e) =>
                    handleThemeUpdate({ ...theme, text_color: e.target.value })
                  }
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div
              className="mt-6 p-4 rounded-lg"
              style={{
                backgroundColor: theme.background_color,
                color: theme.text_color,
              }}
            >
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <div className="space-y-2">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: theme.primary_color }}
                >
                  Primary Color
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: theme.secondary_color }}
                >
                  Secondary Color
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeEditor;
