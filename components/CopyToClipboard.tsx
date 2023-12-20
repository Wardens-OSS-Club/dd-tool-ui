import { AppDefaultButton } from "./AppButton";

export default function CopyToClipboardButton({ text }: { text: string }) {
  const handleClick = async () => {
    await navigator.clipboard.writeText(text);
  };

  return <AppDefaultButton onClick={handleClick}>Copy</AppDefaultButton>;
}