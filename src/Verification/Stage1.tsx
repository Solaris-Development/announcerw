import MSuspense from "@/Components/MSuspense";
import { Button } from "@/Components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog"
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
    
    function authorize() {
        setLoading(true)
        const fragment2 = new URLSearchParams(window.location.hash.slice(1));
        localStorage.setItem('tk_discord', fragment2.get('token_type') + ' ' + fragment2.get('access_token'))

        const fragment = new URLSearchParams(window.location.hash.slice(1))
        const state: any = fragment.get('state')

        const url = new URL("https://apis.roblox.com/oauth/v1/authorize")
        url.searchParams.set("client_id", import.meta.env.VITE_RBXCLIENTID.toString())
        url.searchParams.set("redirect_uri", import.meta.env.VITE_URL+"verification/stage2")
        url.searchParams.set("scope", "openid profile")
        url.searchParams.set("response_type", "code")
        url.searchParams.set("state", state)

        document.location.href = url.toString();
    }

    return (
        <div className="h-full flex items-center justify-center">
            <div className="min-w-[28rem] w-[28rem] h-[50%] border border-border bg-background rounded-lg p-5 flex items-center flex-col relative">
                <h2>Discord Account</h2>
                
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
                        <Button disabled={isLoading} onClick={() => authorize()}>
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