import { storeToRefs } from 'pinia'
import { useRegistrationStore } from '../stores/registrationStore'

export function useRegistration() {
  const store = useRegistrationStore()
  const { isLoggedIn, currentUser, loading, error } = storeToRefs(store)

  return {
    isLoggedIn,
    currentUser,
    loading,
    error,
    logIn: store.logIn,
    signUp: store.signUp,
    logOut: store.logOut,
  }
}
