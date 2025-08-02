import toast from "react-hot-toast";

export const handleToCopyText = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success("Copied !!");
  });
};
