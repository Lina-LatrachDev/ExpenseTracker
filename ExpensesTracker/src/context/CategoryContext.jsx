import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; // <-- add this
import {
  getCategories,
  addCategory as apiAddCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory
} from "../api/api";

const CategoryContext = createContext();

const normalizeCat = (cat) => ({
  id: cat._id || cat.id,
  name: cat.name || "Unnamed",
  color: cat.color || "#60a5fa",
  type: cat.type || "expense"
});

export function CategoryProvider({ children }) {
  const { currentUser } = useAuth(); // <-- watch current user
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    if (!currentUser) return setCategories([]);
    setLoading(true);
    try {
      const res = await getCategories();
      let catArray = [];
      if (Array.isArray(res.data)) catArray = res.data;
      else if (Array.isArray(res.data.categories)) catArray = res.data.categories;
      else catArray = [];

      const cats = catArray.map(normalizeCat);
      setCategories(cats);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset/fetch categories whenever user changes
  useEffect(() => {
    fetchCategories();
  }, [currentUser]);

  const addCategory = async (catData) => {
    const res = await apiAddCategory(catData);
    const newCat = normalizeCat(res.data);
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = async (id, updatedData) => {
    const res = await apiUpdateCategory(id, updatedData);
    const updatedCat = normalizeCat(res.data);
    setCategories(prev => prev.map(c => (c.id === id ? updatedCat : c)));
    return updatedCat;
  };

  const deleteCategory = async (id) => {
    await apiDeleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CategoryContext.Provider value={{
      categories,
      loading,
      fetchCategories,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategory = () => useContext(CategoryContext);

{/*import { createContext, useContext, useEffect, useState } from "react";
import {
  getCategories,
  addCategory as apiAddCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory
} from "../api/api";
//import { demoCategories } from "../data/demoData";


const CategoryContext = createContext();

// HELPER: NORMALIZE CATEGORY 
const normalizeCat = (cat) => ({
  id: cat._id || cat.id,
  name: cat.name || "Unnamed",
  color: cat.color || "#60a5fa",
  type: cat.type || "expense"
});

// PROVIDER 
export function CategoryProvider({ children }) {
  // const [categories, setCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all categories
 const fetchCategories = async () => {
  setLoading(true);
  try {
    const res = await getCategories();

    console.log("CAT RESPONSE:", res.data);

    let catArray = [];

    if (Array.isArray(res.data)) {
      catArray = res.data;
    } 
    else if (Array.isArray(res.data.categories)) {
      catArray = res.data.categories;
    } 
    else {
      console.error("Invalid categories format:", res.data);
      catArray = [];
    }

    const cats = catArray.map(normalizeCat);
    setCategories(cats);

  } catch (err) {
    console.error("Failed to fetch categories:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  // ADD CATEGORY
  const addCategory = async (catData) => {
    try {
      const res = await apiAddCategory(catData);
      const newCat = normalizeCat(res.data);
      setCategories(prev => [...prev, newCat]);
      return newCat;
    } catch (err) {
      console.error("Failed to add category:", err);
      throw err;
    }
  };

  // UPDATE CATEGORY 
  const updateCategory = async (id, updatedData) => {
    try {
      const res = await apiUpdateCategory(id, updatedData);
      const updatedCat = normalizeCat(res.data);
      setCategories(prev =>
        prev.map(cat => (cat.id === id ? updatedCat : cat))
      );
      return updatedCat;
    } catch (err) {
      console.error("Failed to update category:", err);
      throw err;
    }
  };

  // DELETE CATEGORY
  const deleteCategory = async (id) => {
    try {
      await apiDeleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
      throw err;
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

//  CUSTOM HOOK 
export const useCategory = () => useContext(CategoryContext);*/}