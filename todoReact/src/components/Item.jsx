import { Button } from "./Button";
import { useState } from "react";

export function Item({ name, done, finishItem, deleteItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(name);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="border-t-2 border-solid border-slate-400 flex pt-[16px] mt-[16px]">
      <div onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ) : (
          <span className={`${done ? "line-through" : ""}`}>{text}</span>
        )}
      </div>
      <div className="ml-auto">
        {done == false ? (
          <Button content="Zrobione" toDoOnClick={finishItem} />
        ) : (
          ""
        )}
        <Button content="Usuń" toDoOnClick={deleteItem} />
      </div>
    </div>
  );
}
