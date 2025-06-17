/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { ThemesAPI } from "../../services/API/Themes";
import { StoreContext } from "../../context/StoreContext";

const ThemeEditor = () => {
  const [themes, setThemes] = useState([]);
  const { token } = useContext(StoreContext);

  const fetchThemes = async () => {
    try {
      const response = await ThemesAPI.getAllThemes();
      setThemes(response.data.themes);
      
    } catch (error) {
      console.error("Error fetching themes:", error);
      toast.error("Failed to fetch themes");
    }
  };

  const handleThemeUpdate = async (theme: any) => {
    try {
      await ThemesAPI.updateTheme(theme.id, theme, token);
      toast.success("Theme updated successfully");
      fetchThemes();
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme");
    }
  };

  const createNewTheme = async () => {
    const newTheme = {
      name: "New Theme",
      primaryColor: "#ffffff",
      secondaryColor: "#f3f4f6",
      backgroundColor: "#e5e7eb",
      textColor: "#111827",
      isActive: false,
    };
    try {
      await ThemesAPI.createTheme(newTheme, token);

      toast.success("Theme created successfully");
      fetchThemes();
      
    } catch (error) {
      console.error("Error creating new theme:", error);
      toast.error("Failed to create new theme");
      return;
      
    }

  };

  const deleteTheme = async (id: string) => {
    try {
      await ThemesAPI.deleteTheme(id, token);
      toast.success("Theme deleted successfully");
      fetchThemes();
    } catch (error) {
      console.error("Error deleting theme:", error);
      toast.error("Failed to delete theme");
      
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

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
                    handleThemeUpdate({ ...theme, isActive: !theme.isActive })
                  }
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {theme.isActive ? "Active" : "Inactive"}
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
                  value={theme.primaryColor}
                  onChange={(e) =>
                    handleThemeUpdate({
                      ...theme,
                      primaryColor: e.target.value,
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
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    handleThemeUpdate({
                      ...theme,
                      secondaryColor: e.target.value,
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
                  value={theme.backgroundColor}
                  onChange={(e) =>
                    handleThemeUpdate({
                      ...theme,
                      backgroundColor: e.target.value,
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
                  value={theme.textColor}
                  onChange={(e) =>
                    handleThemeUpdate({ ...theme, textColor: e.target.value })
                  }
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div
              className="mt-6 p-4 rounded-lg"
              style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
              }}
            >
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <div className="space-y-2">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Primary Color
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: theme.secondaryColor }}
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
