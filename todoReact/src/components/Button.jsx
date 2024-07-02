export function Button({ content, toDoOnClick }) {
  return (
    <button
      className="ml-2 text-xs border border-solid border-blue rounded px-2 text-blue p-[2px] hover:text-white hover:bg-blue"
      onClick={toDoOnClick}
    >
      {content}
    </button>
  );
}
