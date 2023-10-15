import { useToast } from "components/ui/use-toast";

export default function useCopyToClipBoard() {
  const { toast } = useToast();

  const handleCopy = async (text: string) => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(text);
        toast({ title: `Copied ${text} to clipboard` });
      } catch (err) {
        toast({ title: "Error copying to clipboard, please do so manually" });
      }
    } else {
      toast({ title: "Error copying to clipboard, please do so manually" });
    }
  };

  return { handleCopy };
}
