import './App.css'
import { useState } from 'react';
import Transaction from './components/Transaction'
import Categories from './components/Categories';

function App() {
  const [categories, setCategories] = useState([
  "Food",
  "Entertainment",
  "Subscriptions",
  "Taxes"
  ]);

  return (
    <>
    <Transaction categories={categories} />
    <Categories
  categories={categories}
  setCategories={setCategories}/>
    </>
  )
}

export default App