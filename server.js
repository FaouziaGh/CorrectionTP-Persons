const express = require('express');
const app = express();

const data = require('./data')
const persons = data.persons
const cities = data.cities

app.use(express.json());

// list of persons
app.get('/persons', (req, res) => {
    res.json(persons);
  });

// list of persons by specifying the fields you want to obtain (id, name, cities)
  app.get('/persons/fields', (req, res) => {
    const fields = req.query.fields ? req.query.fields.split(',') : null;
    const result = [];  
    persons.forEach(person => {
      const obj = {};  
      if (fields && fields.includes('id')) {
        obj.id = person.id;
      }
      if (fields && fields.includes('name')) {
        obj.name = person.name;
      }
      if (fields && fields.includes('cities')) {
        obj.cities = person.cities;
      }  
      result.push(obj);
    });
    res.json(result);
  });

  // A person according to his id
app.get('/persons/:id', (req, res) => {
    let id = Number(req.params.id);
    let result = persons.find(person => person.id === id);
    res.send(result);
  });

  //list of people by name
  app.get('/persons/name/:name', (req, res) => {
    const { name } = req.params;
  
    const filteredPersons = persons.filter(person => person.name === name);
  
    if (filteredPersons.length === 0) {
      res.status(404).json({ error: 'No persons found with the given name' });
    } else {
      res.status(200).json(filteredPersons);
    }
  });

//list of cities
  app.get('/cities', (req, res) => {
    res.json(cities);
  });
  
//A city according to its id
  app.get('/cities/:id', (req, res) => {
    const cityId = parseInt(req.params.id);
    const city = cities.find(city => city.id === cityId); 
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }  
    res.json(city);
  });

  // POST endpoint to add a person
app.post('/persons', (req, res) => {
    // Create a new person object with data from the request body
    const newPerson = {
      id: persons.length + 1, // Generate a new ID for the person
      name: req.body.name,
      cities: req.body.cities || [] // Default to an empty array if cities is not provided
    };
    // Add the new person to the persons array
    persons.push(newPerson); 
    // Send a response with the new person's data
    res.status(201).json(newPerson);
  });

  //Add a city
  app.post('/cities', (req, res) => {
    // We retrieve the data of the city from the body of the request
    const { name, area, population } = req.body;  
    // We create a new city
    const newCity = {
      id: cities.length + 1,
      name,
      area,
      population
    };  
    // We add the new city to the table of cities
    cities.push(newCity);  
    // We send the answer with the new city created
    res.status(201).json(newCity);
  });

  // Edit a person (at least the name field)
  app.put('/persons/:id', (req, res) => {
    const personId = parseInt(req.params.id);
    const newName = req.body.name;
    // Search for the person to be modified
    const personToUpdate = persons.find(person => person.id === personId);  
    if (!personToUpdate) {
      return res.status(404).send(`The person with the id ${personId} does not exist!`);
    } 
    // Updating the name field
    personToUpdate.name = newName;
    // Sending the answer with the modified person
    res.status(200).send(personToUpdate);
  });

  //Add a city to a person (just by giving the id of the city id)
  app.put('/persons/:id/cities/:cId', (req, res) => {
    const personId = parseInt(req.params.id);
    const cId = parseInt(req.params.cId); 
    // Find the person in the list
    const person = persons.find(person => person.id === personId); 
    // Find the city in the list
    const city = cities.find(city => city.id === cId);  
    if (!person) {
      res.status(404).send('Person not found');
    } else if (!city) {
      res.status(404).send('City not found');
    } else {
      // Add the city to the person's list of cities
      person.cities.push(city);
      res.status(200).send(person);
    }
  });

  // Delete a city from a person
  app.delete('/persons/:id/cities/:cId', (req, res) => {
    const personId = req.params.id;
    const cId = parseInt(req.params.cId); 
    // Find the person to whom you want to delete a city
    const person = persons.find(person => person.id === parseInt(personId));    
    if (!person) {
      res.status(404).send(`The person with the ID ${personId} was not found.`);
      return;
    } 
    // Find the index of the city to delete in the list of cities of this person
    const cityIndex = person.cities.findIndex(city => city.id === cId); 
    if (cityIndex === -1) {
      res.status(404).send(`The city with the ID ${cId} was not found for the person with the ID ${personId}.`);
      return;
    }
    // Delete the city using the found index
    person.cities.splice(cityIndex, 1);
    res.status(200).send(`The city with the ID ${cId} has been successfully deleted for the person with the ID ${personId}.`);
  });

  app.delete('/persons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    //Find the index of the person with the specified ID
    const index = persons.findIndex(person => person.id === id);
    if (index !== -1) {
      persons.splice(index, 1);
      res.status(200).send(`Person with id ${id} has been deleted`);
    } else {
      res.status(404).send(`Person with id ${id} not found`);
    }
  });
  
  // Delete a city
  app.delete('/cities/:id', (req, res) => {
    const cityId = parseInt(req.params.id);
    const cityIndex = cities.findIndex(city => city.id === cityId);
  
    if (cityIndex !== -1) {
      cities.splice(cityIndex, 1);
      res.status(200).send(`City with id ${cityId} has been deleted`);
    } else {
      res.status(404).send({ error: 'City not found' });
    }
  });

  // the list of persons in lexicographical order. lexicographical order.
  app.get('/sort/persons', (req, res) => {
    // retrieve the sort and order query parameters from the request
    const sortBy = req.query.sort || 'id';
    const sortOrder = req.query.order || 'asc'; 

    let result = [...persons];  
    if (sortBy === 'name') {
      // use the sort() method with a comparison function that compares the name field of two persons
      result.sort((a, b) => {
        
        if (a.name < b.name) {
          //returns a negative value if the first name is lexicographically before the second name
          return sortOrder === 'asc' ? -1 : 1;
        } else if (a.name > b.name) {
          // returns a positive value if the first name is after the second name
          return sortOrder === 'asc' ? 1 : -1;
        } else {
          // return 0 if the names are equal
          return 0;
        }
      });
    }
    res.status(200).json(result);
    
  });

  // all persons whose name field is name field is Jack.
  app.get('/name/persons', (req, res) => {
    // We get the "name" parameter in the query
    const name = req.query.name; 
    
    if (name) {
      // We filter the people who have the name "name".
      const filteredPersons = persons.filter(person => person.name === name);
      // We return the list of filtered persons
      res.json(filteredPersons); 
    } else {
      // If the "name" parameter is not specified, the complete list of persons is returned
      res.json(persons);
    }
  });

  // the list of people by the specific id of a city 
  app.get('/city/persons', (req, res) => {
    const cityId = parseInt(req.query.cityID);
  
    if (cityId) {
      const personsInCity = persons.filter(person => {
        //The some() method is used to check if at least one element in the cities array matches the city ID
        return person.cities.some(city => city.id === cityId);

      });
      res.send(personsInCity);
      
    }else {
      res.send(persons);
    }
  });

  // GET /persons?city=1&sort=name : The two previous criteria at the same time.
  app.get('/sortCity/persons', (req, res) => {
    const { cityId, sort } = req.query;
    
    let filteredPersons = persons.filter(person => {
      return person.cities && person.cities.find(city => city.id === parseInt(cityId));
    });
  
    if (sort === 'name') {
      filteredPersons.sort((person1, person2) => {
        if (person1.name < person2.name) {
          return -1;
        } else if (person1.name > person2.name) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    res.json(filteredPersons);
  });

  // GET /persons?fields=id,name&city=1&sort=name : The same request as before, but only returns the ids and names of the names of the persons.
  app.get('/getByfields/persons', (req, res) => {
    const cityId = req.query.city;
    const fields = req.query.fields?.split(',') || ['id', 'name']; // default fields to return if not provided
    const sortField = req.query.sort || 'id';
  
    let filteredPersons = persons.filter(person => {
      return person.cities && person.cities.some(city => city.id == cityId);
    });
  
    filteredPersons = filteredPersons.map(person => {
      let filteredPerson = {};
      fields.forEach(field => {
        filteredPerson[field] = person[field];
      });
      return filteredPerson;
    });
  
    filteredPersons.sort((a, b) => a[sortField] > b[sortField] ? 1 : -1);
  
    res.send(filteredPersons);
  });
  

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server is listening on ${port}`));