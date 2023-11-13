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
import { ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiscordOAuth } from "@/Lib/Utils";

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

            // if (!accessToken || !tokenType || !state)
            //     return redirect('/verification')

            // if (atob(decodeURIComponent(state)) !== localStorage.getItem('oauth-state'))
            //     return redirect('/verification')

            // const f = await fetch("https://discord.com/api/users/@me", { headers: { Authorization: `${tokenType} ${accessToken}` }})
            // if (!f.ok)
            //     return setErr(true)
            // setUser(await f.json())
            setTimeout(() => {
                setLoaded(true)
            }, 1000)
            
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
            {/* <div className="min-w-[28rem] w-[28rem] h-[50%] border border-border bg-background rounded-lg p-5 flex items-center flex-col relative">
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
                
                
            </div> */}
            <div className="min-w-[50rem] w-[50rem] h-[23rem] min-h-[23rem] border border-border bg-background rounded-lg flex items-center flex-col relative">
                <div className="p-2 w-full border-b-border border-b">
                    <h4>Account Link • Discord Account</h4>
                </div>
                <div className="p-5 h-full w-full text-center flex justify-center items-center flex-col">
                    <h4>Logged in as</h4>
                    <div className="h-full flex justify-center items-center flex-col">
                        <MSuspense fallback={
                            <Loader2 className="mr-2 h-6 w-6 animate-spin rounded-full" />
                        } loaded={loaded}>
                            <img src={'https://cdn.discordapp.com/avatars/'+user?.id+'/'+user?.avatar+'.png?size=512'} className="h-20 w-20 rounded-full mt-5" />
                            <h4>@{user?.username ? user?.username : 'username'}</h4>
                            <p className="mt-5">Make sure this is the right account.</p>
                        </MSuspense>
                    </div>
                    
                </div>
                <div className="w-full relative h-36">
                    <div className="absolute right-0 bottom-0">
                        <Button className="m-5" variant="ghost" onClick={() => { setLoading(true); document.location.href = getDiscordOAuth(btoa(localStorage.getItem('oauth-state')!)) }} disabled={isLoading}>
                            Change account
                            { isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <RefreshCw className="ml-2 h-4 w-4" /> } 
                        </Button>
                        <Button className="m-5" onClick={() => authorize()} disabled={isLoading}>
                            Get Started
                            { isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <ArrowRight className="ml-2 h-4 w-4" /> } 
                        </Button>
                    </div>
                    
                </div>  
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
    )
}