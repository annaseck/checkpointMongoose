const mongoose = require('mongoose');
const express = require('express')
const Person = require('./person');

require('dotenv').config();  
const app = express();
const port = 5050;
const URI = process.env.MONGO_URI;

mongoose.connect(URI)
.then(() => {
    console.log('Connexion à MongoDB réussie !')
})
.catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err)
});
app.use(express.json())

app.post("/newPerson", async (req,res) => {
    console.log(req.body);
    
    const {name, age, favoriteFoods} = req.body
    try {
        const person = await  Person.create({
            name,
            age,
            favoriteFoods
        })
        return res.status(200).json({message:"personne ajouté avec succès",person})
    } catch (error) {
        console.log("Erreur lors de l'ajout la personne",error);
        return res.status(500).json({error:"Erreur"})
    }
})

//Ajouter plusieurs personne
app.post("/newPersons", async (req, res) => {
    try {
        const persons = [] = req.body; 
        console.log(req.body);
        
        const result = await Person.create(persons);
        return res.status(200).json({ message: "Personnes ajoutées avec succès", result });
    } catch (error) {
        console.log("Erreur lors de l'ajout des personnes", error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

//Afficher toutes les personnes
app.get("/getPersons", async (req, res) => {
    const allPerson = await Person.find();
    return res.status(200).json(allPerson);
});

//Trouver une personne en utilisant findOne()
app.get("/getPers", async (req, res) => {
    const Pers = await Person.findOne({name : "Anita"});
    return res.status(200).json(Pers);
});

//Trouver une personne en utilisant findById()
app.get("/getPersById", async (req, res) => {
    const Pers = await Person.findById({_id : '66eabdc031d777394b24a074'});
    return res.status(200).json(Pers);
});

//Mise à jour classique
//On crée une fonction de mise à jour
async function Update(id){
    try {
        const person = await Person.findById(id);
        person.favoriteFoods.push('yassa');
        await person.save();
        console.log("Mise à jour réussie");
        return person; 
    } catch (error) {
        console.log("Erreur lors de la mise à jour", error);
    }
}
//Utilisation de la fonction
//console.log(Update('66eabdc031d777394b24a074'));

//Mise à jour avec findAndUpdate
app.put("/findAndUpdate", async (req, res) => {
    try {
        const filter = { name: 'Anita' };
        const update = { age: 20 };
        const doc = await Person.findOneAndUpdate(filter, update, {new: true});
        return res.status(200).json(doc);
    } catch (error) {
        console.log("Erreur lors de la mise à jour",error);
        return res.status(500).json({error:"Erreur lors de la mise à jour"})
    }
});

//Supprimer un document avec findByIdAndRemove
app.delete("/findAndRemove", async (req, res) => {
    try {
        const id = '66eac31b969b6e9153fd0f81';
        const doc = await Person.findByIdAndDelete(id);
        return res.json({message:"Document supprimer avec succès"});       
    } catch (error) {
        console.log("Erreur lors de la suppression",error);
        return res.status(500).json({error:"Erreur lors de la suppression"});
    }
});

//Supprimer plusieurs document
app.delete("/Remove", async (req, res) => {
    try {
        const doc = await Person.deleteMany({name:"Mary"});
        return res.json({message:"Documents supprimer avec succès"});       
    } catch (error) {
        console.log("Erreur lors de la suppression",error);
        return res.status(500).json({error:"Erreur lors de la suppression"});
    }
});

app.listen(port, () => {
    console.log('Server is running on port: ',port);        
})