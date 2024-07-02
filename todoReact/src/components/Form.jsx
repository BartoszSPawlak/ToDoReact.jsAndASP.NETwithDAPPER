import { useState } from "react";

export function Form({ onFormSubmit }) {
  const [inputValue, setInputValue] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onFormSubmit(inputValue);
      }}
      className="flex gap-[12px]"
    >
      <input
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        type="text"
        className="border border-solid border-black rounded p-[8px] w-full"
      />
      <button
        className={`border border-solid rounded border-blue text-blue px-2 p-[2px] ${
          inputValue.length != 0 ? "hover:text-white hover:bg-blue" : " "
        }`}
        disabled={inputValue.length != 0 ? false : true}
      >
        Dodaj
      </button>
    </form>
  );
}
