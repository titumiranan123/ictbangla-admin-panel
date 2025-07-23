"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { api_url } from "@/hooks/apiurl";
import { useSetting } from "@/hooks/useSetting";
import Swal from "sweetalert2";

interface Setting {
  label: string;
  value: boolean;
}

const LanguageSettingsForm: React.FC = () => {
  const { data, isLoading } = useSetting();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<{ settings: Setting[] }>({
    defaultValues: {
      settings: [],
    },
  });

  // Sync fetched data to form
  useEffect(() => {
    if (data) {
      const initialSettings: Setting[] = [
        {
          label: "show_features_course",
          value: data.show_features_course ?? "false",
        },
        {
          label: "show_popular_course",
          value: data.show_popular_course ?? "false",
        },
        { label: "show_free_course", value: data.show_free_course ?? "false" },
        {
          label: "show_upcoming_courses",
          value: data.show_upcoming_courses ?? "false",
        },
        { label: "show_top_courses", value: data.show_top_courses ?? "false" },
        { label: "bkash", value: data.bkash ?? "false" },
        { label: "ssl", value: data.ssl ?? "false" },
      ];
      reset({ settings: initialSettings });
    }
  }, [data, reset]);

  const currentSettings = watch("settings");

  const onSubmit = async (formData: { settings: Setting[] }) => {
    const formattedData = formData.settings.map((setting) => ({
      ...setting,
      value:
        typeof setting.value === "string"
          ? setting.value === "true"
          : setting.value,
    }));

    try {
      const result = await Swal.fire({
        title: "Update Settings?",
        text: "You're about to update these settings.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#EF4444",
        confirmButtonText: "Update Settings",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const res = await api_url.post(
          "/v1/admin-user/update/settings",
          formattedData
        );
        if (res.status === 200 || res.status === 201) {
          await Swal.fire({
            title: "Success!",
            text: "Settings have been updated successfully.",
            icon: "success",
            confirmButtonColor: "#10B981",
          });
        }
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      await Swal.fire({
        title: "Update Failed",
        text: "There was an error updating your settings.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleSelectChange = (index: number, value: string) => {
    setValue(`settings.${index}.value`, value === "true");
  };

  if (isLoading) {
    return (
      <div className="p-6 container mx-auto bg-white rounded-lg shadow">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 container mx-auto bg-white rounded-lg shadow">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Settings Configuration
        </h2>
        <p className="text-gray-500 mt-1">
          Manage your application preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {currentSettings?.length > 0 ? (<>
            <div>
              <h2 className="text-xl font-semibold mb-5">Home Page Setting </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentSettings.slice(0,5).map((setting, index) => (
                  <div
                    key={`${setting.label}-${index}`}
                    className="p-4 border rounded-lg hover:shadow transition"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {setting.label.replace(/_/g, " ")}
                    </label>
                    <select
                      value={String(setting.value)}
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-5">Payment Method Setting </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentSettings.slice(5).map((setting, index) => (
                  <div
                    key={`${setting.label}-${index}`}
                    className="p-4 border rounded-lg hover:shadow transition"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {setting.label.replace(/_/g, " ")}
                    </label>
                    <select
                      value={String(setting.value)}
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                ))}
              </div>
            </div> </>
          ) : (
            <div className="text-center text-gray-500">
              No settings available to show.
            </div>
          )}

          <div className="mt-8 pt-6 border-t flex justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2 border text-gray-700 border-gray-300 rounded-md hover:bg-gray-100 transition"
              onClick={() => reset()}
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 text-white rounded-md transition ${
                isSubmitting
                  ? "bg-emerald-300 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LanguageSettingsForm;
