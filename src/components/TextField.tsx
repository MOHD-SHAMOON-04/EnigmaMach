import CopyBtn from "./CopyBtn";
interface TextFieldProps {
  handleCopy: (text: string) => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  label: string;
}

export default function TextField({ handleCopy, text, setText, label }: TextFieldProps) {
  return (
    <div className="w-full bg-zinc-700/50 py-1 px-2 rounded">
      <div className="flex justify-between items-center mb-1">
        <label
          htmlFor={`${label.toLowerCase()}-field`}
          className="font-semibold mr-auto bg-zinc-700 rounded px-1">
          {label}
        </label>
        <CopyBtn onClick={() => handleCopy(text)} />
        <button
          className="ml-3 lg:ml-4 cursor-pointer bg-zinc-700 rounded p-0.5"
          onClick={() => setText("")}
        >
          ❌
        </button>
      </div>
      <textarea
        id={`${label.toLowerCase()}-field`}
        placeholder={`${label} Text`}
        defaultValue={text}
        disabled={true}
        onKeyDown={(e) => e.preventDefault()}
        rows={4}
        className="w-full resize-y p-1 lg:p-2.5 lg:text-lg outline-none bg-zinc-50 text-zinc-950 rounded"
      ></textarea>
    </div>
  )
}