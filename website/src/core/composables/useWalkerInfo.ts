import { storeToRefs } from "pinia";
import { useHomeStore } from "../stores/HomeStore";

export function useHome() {
    const store = useHomeStore()

    return {
        walkerInfo: store.getWalker
    }
}