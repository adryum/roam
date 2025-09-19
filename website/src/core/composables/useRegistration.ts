import { storeToRefs } from "pinia";
import { useRegistrationStore } from "../stores/registrationStore";

export function useRegistration() {
    const store = useRegistrationStore()
    const { isLoggedIn } = storeToRefs(store)

    return {
        isLoggedIn,
        logIn: store.logIn,
        signUp: store.signUp
    }
}