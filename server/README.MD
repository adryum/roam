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
Pieprasījums:
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
Pieprasījums:
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
Pieprasījums:
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

Pieprasījums:
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

### Pets
#### Get all pets.

Pieprasījums:
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

### Reservations
#### Get all reservations.

Pieprasījums:
```
uz: /rezervations/
```

```
[
    {
        id: int,
        creation_date: string,
        realization_date: string,
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
