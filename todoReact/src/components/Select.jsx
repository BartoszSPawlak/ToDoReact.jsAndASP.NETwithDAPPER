export function Select({
  idOfSelect,
  labelOfSelect,
  sortItems,
  cName,
  value1,
  textOfValue1,
  value2,
  textOfValue2,
  value3,
  textOfValue3,
}) {
  return (
    <>
      <label htmlFor={idOfSelect}>{labelOfSelect} </label>
      <select id={idOfSelect} onChange={sortItems} className={cName}>
        <option value={value1}>{textOfValue1}</option>
        <option value={value2}>{textOfValue2}</option>
        <option value={value3}>{textOfValue3}</option>
      </select>
    </>
  );
}
