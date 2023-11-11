import { useRouteError } from "react-router-dom";

export default function ErrorElement() {
    const error: any = useRouteError();
    console.log(error)

    return (
        <div className="h-full flex justify-center items-center">
            <div className="flex items-center space-x-5">
                <h3>{error.status}</h3> <hr className="h-10 w-[1px] bg-muted" /> <p className="text-muted-foreground">{error.statusText}</p>
            </div>
        </div>
    )
}