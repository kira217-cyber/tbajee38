import { toast } from "react-toastify";

import { api } from "../../api/axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const imageUrl = (u) =>
  !u ? "" : u.startsWith("http") ? u : `${API_URL}${u}`;

/** সাইট সেটিং আপলোড হেল্পার — /api/site-settings/admin/upload */
export const useUpload = () => async (file) => {
  if (!file) return "";
  if (!file.type.startsWith("image/")) {
    toast.error("Choose an image");
    return "";
  }
  const form = new FormData();
  form.append("image", file);
  const { data } = await api.post("/api/site-settings/admin/upload", form);
  return data?.data?.url || "";
};
