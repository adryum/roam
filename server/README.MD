# Par datubāzi

Te ir visi iespējamie pieprasījumi serverim, un viņa atbildes.<br>

## Izmantotās tehnoloģijas
- multer
- express.js
- nodemon

## Lai palaistu
Pirmo reizi - pēc klonēšanas - atverot projektu neaizmirstiet instalēt node_modules!

<br>
Terminālī no root path " blablabla\roam> "

```sh
cd server
npx nodemon src/index.ts
```

## Requesti / Responsi
Servera noklusējuma HTTP ceļš: http://localhost:5000

### Registration
#### sign up
Pieprasījums: POST
```
uz: /registration/signup

{
    name: string,
    surname: string,
    email: string,
    password: string
}
```

Atbilde: 
```
{
    id: int,
    name: string,
    surname: string,
    email: string,
    password: string,
    profile_picture: string,
    description: string,
    role: string,
    description_dots: [
        {
            point: string
        }
    ]
}
```

#### login
Pieprasījums: POST
```
uz: /registration/login

{
    email: string,
    password: string
}
```

Atbilde: 
```
{
    id: int,
    name: string,
    surname: string,
    email: string,
    password: string,
    profile_picture: string,
    description: string,
    role: string,
    description_dots: [
        {
            point: string
        }
    ]
}
```

### Users
#### Get all users.
Pieprasījums: GET
```
uz: /users/
```

Atbilde: 
```
[
    {
        id: int,
        name: string,
        surname: string,
        profile_picture: string,
        description: string,
        role: string,
        description_dots: [
            {
                point: string
            }
        ]
    }
]
```

### Reviews

#### Get all reviews.

Pieprasījums: GET
```
uz: /reviews/
```

Atbilde: 
```
[
    {
        id: int,
        creator_id: int,
        receiver_id: int,
        creation_date: string,
        title: string,
        content: string,
        stars: float,
        recievers_fullname: string,
        creators_fullname: string,
    }
]
```

Pieprasījums: POST
```
uz: /reviews/create

{
    fromUserId: int,
    toUserId: int,
    stars: int,
    title: string,
    content: string
}
```

Atbilde: 
```
[
    {
        id: int,
        creator_id: int,
        receiver_id: int,
        creation_date: string,
        title: string,
        content: string,
        stars: float,
        recievers_fullname: string,
        creators_fullname: string,
    }
]
```


Pieprasījums: POST
```
uz: /reviews/delete

{
    id: int
}
```

Atbilde: 
```
{
    "deletedReviewId": int
}
```

### Pets
#### Get all pets.

Pieprasījums: GET
```
uz: /pets/
```

```
[
    {
        id: int,
        owner_id: int,
        name: string,
        species: string,
        age: int,
        description: string,
        picture: string,
        tags: [
            tag: string
        ]
    }
]
```

Pieprasījums: POST
```
uz: /pets/create

{
    name: string,
    ownerId: int,
    species: string,
    description: string,
    age: int,
    image: File
}
```

Atbilde: 
```
{
    id: int,
    owner_id: int,
    name: string,
    species: string,
    age: int,
    description: string,
    picture: string,
    tags: [
        tag: string
    ]
}
```


Pieprasījums: POST
```
uz: /pets/delete

{
    id: int
}
```

Atbilde: 
```
{
    "deletedPetId": int
}
```

### Reservations
#### Get all reservations.

Pieprasījums: GET
```
uz: /rezervations/
```

```
[
    {
        id: int,
        creation_date_time: string,
        walk_start_date_time: string,
        walk_end_date_time: string,
        path_start: string,
        path_end: string,
        start_time: string,
        end_time: string,
        price: float
        description: string,
        client_id: int,
        walker_id: int,
        pets: [
            {
                id: int,
                owner_id: int,
                name: string,
                species: string,
                age: int,
                description: string,
                picture: string,
                tags: [
                    tag: string
                ]
            }
        ]
    }
]
```

Pieprasījums: POST
```
uz: /reservation/create

{
    walkerId: int,
    clientId: int,
    pathStartLocation: string,
    pathEndLocation: string,
    walkStartDate: string,
    walkEndDate: string,
    price: float,
    description: string,
    assignedPets: int[]
}
```

Atbilde: 
```
{
    id: int,
    creation_date_time: string,
    walk_start_date_time: string,
    walk_end_date_time: string,
    path_start: string,
    path_end: string,
    start_time: string,
    end_time: string,
    price: float
    description: string,
    client_id: int,
    walker_id: int,
    pets: [
        {
            id: int,
            owner_id: int,
            name: string,
            species: string,
            age: int,
            description: string,
            picture: string,
            tags: [
                tag: string
            ]
        }
    ]
}
```


Pieprasījums: POST
```
uz: /reservation/delete

{
    id: int
}
```

Atbilde: 
```
{
    "deletedReservationId": int
}
```
