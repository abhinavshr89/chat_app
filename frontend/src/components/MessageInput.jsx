import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

/**
 * MessageInput component allows users to type and send messages, as well as attach image files.
 * 
 * @component
 * @example
 * return (
 *   <MessageInput />
 * )
 * 
 * @returns {JSX.Element} The rendered MessageInput component.
 * 
 * @function
 * @name MessageInput
 * 
 * @description
 * This component provides a text input for typing messages and a file input for attaching images.
 * It displays a preview of the selected image and allows users to remove the image before sending.
 * The component uses the `useChatStore` hook to send messages and manages its own state for the text input and image preview.
 * 
 * @property {string} text - The current text input value.
 * @property {function} setText - Function to update the text input value.
 * @property {string|null} imagePreview - The preview URL of the selected image file.
 * @property {function} setImagePreview - Function to update the image preview URL.
 * @property {object} fileInputRef - Reference to the hidden file input element.
 * @property {function} sendMessage - Function from `useChatStore` to send the message.
 * 
 * @function handleImageChange
 * @description Handles the change event for the file input, reads the selected image file, and sets the image preview.
 * @param {Event} e - The change event from the file input.
 * 
 * @function removeImage
 * @description Removes the selected image and clears the file input.
 * 
 * @function handleSendMessage
 * @description Handles the form submission, sends the message with text and/or image, and clears the form.
 * @param {Event} e - The submit event from the form.
 */
const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Here input is hidden and button is visible but when someone clicks on the send Image button using the ref function the input file function is used show the button is only for show piece behind the scenes we are using the input file tag but it is difficult to design it  */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={` sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;