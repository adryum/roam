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
export type UserModel = {
    id: number,
    name: string,
    surname: string,
    location: string,
    description: string,
    profile_picture: string,
    role: string
}