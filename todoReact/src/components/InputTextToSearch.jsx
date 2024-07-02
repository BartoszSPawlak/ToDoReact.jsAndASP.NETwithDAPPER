export function InputTextToSearch({ fetchFunc }) {
  return (
    <input
      onChange={(event) => {
        fetchFunc(event.target.value, "Search");
      }}
      type="text"
      className="border border-solid border-black rounded p-[8px] mt-[5px] mr-[8px] w-2/6 h-8"
    />
  );
}
