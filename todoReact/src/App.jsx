import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import { Form } from "./components/Form";
import { Item } from "./components/Item";
import { Select } from "./components/Select";
import { InputTextToSearch } from "./components/InputTextToSearch";

function App() {
  var [add, setAdd] = useState(false);
  const [items, setItems] = useState([]);

  function getAllItems() {
    fetch("https://localhost:7218/ToDo", {
      method: "GET",
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setItems(data);
        });
      }
    });
  }

  useEffect(() => {
    getAllItems();
  }, []);

  function setItem(newTodoName) {
    setAdd(false);

    const newItem = {
      Name: newTodoName,
      IsDone: false,
    };

    fetch("https://localhost:7218/ToDo", {
      method: "POST",
      body: JSON.stringify(newItem),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setItems(data);
        });
      }
    });
  }

  function finishItem(id) {
    fetch(`https://localhost:7218/ToDo/`, {
      method: "PATCH",
      body: JSON.stringify(id),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setItems(data);
        });
      }
    });
  }

  function deleteItem(id) {
    fetch(`https://localhost:7218/ToDo/`, {
      method: "DELETE",
      body: JSON.stringify(id),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setItems(data);
        });
      }
    });
  }

  function fetchForSearchingOrFilteringOrSorting(value, method) {
    fetch(`https://localhost:7218/ToDo/${method}`, {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setItems(data);
        });
      }
    });
  }

  function sortItems(e) {
    var sortBy = e.target.value;
    if (sortBy != "") {
      fetchForSearchingOrFilteringOrSorting(sortBy, "Sort");
    }
  }

  function filterItems(e) {
    var filterBy = e.target.value;
    fetchForSearchingOrFilteringOrSorting(filterBy, "Filter");
  }

  return (
    <>
      <div className="min-h-screen bg-blue">
        <div className="min-w-[400px] max-h-[calc(100vh-60px)] rounded-xl bg-white m-auto absolute left-1/2 ml-[-192px] mt-[30px] mb-[30px] px-5 pb-[24px]">
          <header className="flex justify-between font-bold py-3 ">
            <div>
              <h1 className="text-[28px] box-border m-0 p-0">Do zrobienia</h1>
              <h2 className="text-[25px] box-border m-0 p-0">
                {items.length} zadań
              </h2>
            </div>
            {add ? (
              ""
            ) : (
              <button
                className="bg-blue rounded-3xl border border-blue pb-[6px] w-11 h-11 text-white text-center text-2xl cursor-pointer mt-5 font-normal hover:text-blue hover:bg-white hover:border-blue"
                onClick={() => {
                  setAdd((prevState) => {
                    return { ...prevState, add: !add };
                  });
                }}
              >
                +
              </button>
            )}
          </header>
          {add ? (
            <Form onFormSubmit={(newTodoName) => setItem(newTodoName)} />
          ) : (
            ""
          )}

          <InputTextToSearch
            fetchFunc={fetchForSearchingOrFilteringOrSorting}
          />

          <Select
            labelOfSelect="Sortuj: "
            sortItems={sortItems}
            cName="mr-[8px] ml-[2px]"
            value1=""
            textOfValue1="brak"
            value2="ASC"
            textOfValue2="A...Z"
            value3="DESC"
            textOfValue3="Z...A"
          />

          <Select
            labelOfSelect="Filtruj: "
            sortItems={filterItems}
            cName="ml-[2px]"
            value1="all"
            textOfValue1="wszystkie"
            value2={1}
            textOfValue2="zrobione"
            value3={0}
            textOfValue3="niezrobione"
          />

          <ul className="max-h-[calc(80vh)] overflow-auto">
            {items.map(({ id, name, isDone }) => (
              <Item
                key={id}
                name={name}
                done={isDone}
                finishItem={() => finishItem(id)}
                deleteItem={() => deleteItem(id)}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
