import {useState} from 'react';


export default function TransactionForm({categories}){
    const [transaction, setTransaction] = useState({ 
        id : "",
        nom : "",
        montant : "",
        categorie :"" 
    });

    const handleChange = (e) => {
      setTransaction({
        ...transaction, 
        [e.target.name]: e.target.value
    })}

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(transaction);
        setTransaction({
            id:"", 
            nom:"", 
            montant:"", 
            categorie:""
        }
    )}

    return(
        <form onSubmit={handleSubmit}>

        <label>Nom : </label>
        <input 
        type="text"
        name="nom" 
        value={transaction.nom} 
        onChange={handleChange}/>

        <label>Montant : </label>
        <input 
        type="number" 
        name="montant"
        value={transaction.montant} 
        onChange={handleChange}/>

        <label>Categorie : </label>
        <select
        name="categorie"
        value={transaction.categorie}
        onChange={handleChange}
        >
            {categories.map((cat) => (
             <option key={cat} value={cat}>
             {cat}
             </option>
        ))}
        </select>

        <button type="submit">Ajouter</button>
        
        </form>
    )
}