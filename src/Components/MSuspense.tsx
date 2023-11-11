import { ReactNode } from "react";

export default function MSuspense({
    children, fallback, loaded
}:{
    children: ReactNode | undefined, fallback: ReactNode, loaded: boolean
}) {
    return (
        loaded ? children : fallback
    )
}