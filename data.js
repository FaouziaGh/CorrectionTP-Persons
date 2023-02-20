let persons = [{
        id: 1,
        name: 'John',
        cities: [
            { id: 1, name: 'Paris', area: 105, population: 2140 },
            { id: 3, name: 'Warsaw', area: 517, population: 1778000 },
            { id: 2, name: 'Dublin', area: 115, population: 555000 }
        ]
    },
    {
        id: 2,
        name: 'Jane',
        cities: [
            { id: 2, name: 'Dublin', area: 115, population: 555000 }
        ]
    },
    { 
        id: 3, 
        name: 'Jack',
        cities:[]
    },
    {
        id: 4,
        name: 'Jill',
        cities: [
            { id: 2, name: 'Dublin', area: 115, population: 555000 }
        ]
    },
    {
        id: 5,
        name: 'Anna',
        cities: [
            { id: 3, name: 'Warsaw', area: 517, population: 1778000 },
            { id: 2, name: 'Dublin', area: 115, population: 555000 }
        ]
    },
    {
        id: 6,
        name: 'Jack',
        cities: [
            { id: 3, name: 'Warsaw', area: 517, population: 1778000 }
        ]
    }
];

let cities = [
    { id: 1, name: 'Paris', area: 105, population: 2140000 },
    { id: 2, name: 'Dublin', area: 115, population: 555000 },
    { id: 3, name: 'Warsaw', area: 517, population: 1778000 },
    { id: 4, name: 'Lisbon', area: 100, population: 506000 }
];
module.exports = { cities, persons };