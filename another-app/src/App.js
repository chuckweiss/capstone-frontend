import React, { useEffect, useState, useRef } from "react";
// import logo from "./logo.svg";
// import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import InventoryTracker from "./components/inventoryTracker/InventoryTracker";
import NavBar from "./components/navBar/NavBar";

function App() {
  const serverURL = "http://localhost:5000";
  const inventoryURL = "inventory";

  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState([]);

  const isInitialMount = useRef(true);

  // Fetch Inventory
  const fetchInventory = async () => {
    const res = await fetch(`${serverURL}/${inventoryURL}`);
    const data = await res.json();
    return data[0].items;
  };

  // Get inventory on page load
  useEffect(() => {
    const getInventory = async () => {
      const inventory = await fetchInventory();
      setInventory(inventory);
    };
    getInventory();
  }, []);

  // Keep inventory updated on server
  useEffect(() => {
    const postInventory = async () => {
      await fetch(`${serverURL}/${inventoryURL}/1`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ items: inventory }),
      });
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      postInventory();
    }
  }, [inventory]);

  // Add Item
  const addItem = async (item) => {
    inventory.push(item);
    setInventory([...inventory]);
  };

  // Edit Item
  const editItem = async (item, amount) => {
    item.amount = amount;
    setInventory([...inventory]);
  };

  const deleteItem = async (item) => {
    setInventory(inventory.filter((e) => e !== item));
  };

  return (
    <Router>
      <div className="">
        <Routes>
          <Route
            path={`/${inventoryURL}`}
            element={
              <InventoryTracker
                inventory={inventory}
                addItem={addItem}
                deleteItem={deleteItem}
                editItem={editItem}
                loading={loading}
              />
            }
          />
          <Route path="/" element={<Navigate to={inventoryURL} />} />
        </Routes>
        <NavBar />
      </div>
    </Router>
  );
}

export default App;
