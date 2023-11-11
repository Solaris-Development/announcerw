import MSuspense from "@/Components/MSuspense";
import { Button } from "@/Components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Stage1() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [user, setUser] = useState<any>();
    const redirect = useNavigate()

    useEffect(() => {
        (async () => {
            const fragment = new URLSearchParams(window.location.hash.slice(1));
            const [accessToken, tokenType, state] = [fragment.get('access_token'), fragment.get('token_type'), fragment.get('state')];
            
            console.log(state)
            console.log(localStorage.getItem('oauth-state'))

            if (!accessToken || !tokenType || !state)
                return redirect('/verification')

            if (atob(decodeURIComponent(state)) !== localStorage.getItem('oauth-state'))
                return redirect('/verification')

            const f = await fetch("https://discord.com/api/users/@me", { headers: { Authorization: `${tokenType} ${accessToken}` }})
            if (!f.ok)
                return setErr(true)
            setUser(await f.json())
            setLoaded(true)
        })()
    }, [])

    return (
        <div className="h-full flex items-center justify-center">
            <div className="min-w-[28rem] w-[28rem] h-[50%] border border-border bg-background rounded-lg p-5 flex items-center flex-col relative">
                <h2>Solaris Verification Process</h2>
                
                <div className="w-full h-[calc(100%-77px)] flex items-center justify-center flex-col">
                <MSuspense fallback={
                    <Loader2 className="mr-2 h-6 w-6 animate-spin rounded-full" />
                } loaded={loaded}>
                    <img src={'https://cdn.discordapp.com/avatars/'+user?.id+'/'+user?.avatar+'.png?size=512'} className="h-20 w-20 rounded-full" />
                    <h4>@{user?.username}</h4>
                    <p className="text-center mt-5">This is the Discord account that will be used to verify you. Make sure it's the right one as this is not changeable.</p>
                </MSuspense>
                </div>

                <div className="absolute bottom-0 m-5 space-x-5">
                    { loaded && <>
                        <Button disabled={isLoading} variant={'ghost'} onClick={() => redirect('/verification')}>Change Account</Button>
                        <Button disabled={isLoading}>
                            { isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> } 
                            Continue
                        </Button>
                    </> }
                    
                    
                </div>
                

                <AlertDialog open={err}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Something went wrong</AlertDialogTitle>
                        <AlertDialogDescription>
                            We couldn't log you in. Try again later. 
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogAction onClick={() => redirect('/verification')}>Ok</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}