export type PetModel = {
    id: number,
    owner_id: number,
    name: string,
    species: string,
    age: number,
    description: string,
    picture: string,
    tags: [
        tag: string
    ]
}