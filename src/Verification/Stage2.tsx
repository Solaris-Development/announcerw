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
import { ApiGet } from "@/Lib/ApiGet";

export default function Stage2() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [user, setUser] = useState<any>();
    const redirect = useNavigate()

    useEffect(() => {
        (async () => {
            const fragment = new URLSearchParams(window.location.search.slice(1));
            const [code, state] = [fragment.get('code'), fragment.get('state')];
            
            if (!state || !code)
                return redirect('/verification')

            if (atob(decodeURIComponent(state)) !== localStorage.getItem('oauth-state'))
                return redirect('/verification')

            var tf0
            if (!localStorage.getItem('tk_robloxa') || !localStorage.getItem('tk_robloxr')) {
                tf0 = await ApiGet(import.meta.env.VITE_APIURL+"verification/exchange?code="+code, { cache: 'no-cache' })
                if (!tf0.ok)
                    return setErr(true)
            } else {
                tf0 = await ApiGet(import.meta.env.VITE_APIURL+"verification/refresh?code="+localStorage.getItem('tk_robloxr'), { cache: 'no-cache' })
                if (!tf0.ok)
                    return setErr(true)
            }
            const tf = JSON.parse(tf0.body)
            
            localStorage.setItem('tk_robloxa', `${tf.token_type} ${tf.access_token}`)
            localStorage.setItem('tk_robloxr', tf.refresh_token)

            const user = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
                headers: {
                    Authorization: `${tf.token_type} ${tf.access_token}`
                }
            })
            if (!user.ok)
                return setErr(true)
            setUser(await user.json())
            setLoaded(true)
        })()
    }, [])

    return (
        <div className="h-full flex items-center justify-center">
            <div className="min-w-[28rem] w-[28rem] h-[50%] border border-border bg-background rounded-lg p-5 flex items-center flex-col relative">
                <h2>Roblox Account</h2>
                
                <div className="w-full h-[calc(100%-77px)] flex items-center justify-center flex-col">
                <MSuspense fallback={
                    <Loader2 className="mr-2 h-6 w-6 animate-spin rounded-full" />
                } loaded={loaded}>
                    <img src={user?.picture || 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHdpZHRoPSI5MCIgaGVpZ2h0PSI5MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlPi5zdDJ7ZmlsbDpub25lO3N0cm9rZTojMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPjxnIGlkPSJ1bmFwcHJvdmVkXzFfIj48cGF0aCBpZD0iYmdfMl8iIGZpbGw9IiM2NTY2NjgiIGQ9Ik0wIDBoOTB2OTBIMHoiLz48ZyBpZD0idW5hcHByb3ZlZCIgb3BhY2l0eT0iLjMiPjxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjQ1IiBjeT0iNDguOCIgcj0iMTAiLz48cGF0aCBjbGFzcz0ic3QyIiBkPSJNMzggNDEuN2wxNCAxNC4xTTMyLjUgMjMuNWgtNHY0TTI4LjUgNjIuNXY0aDRNMjguNSAzMS44djZNMjguNSA0MnY2TTI4LjUgNTIuMnY2TTU3LjUgNjYuNWg0di00TTYxLjUgNTguMnYtNk02MS41IDQ4di02TTYxLjUgMzcuOHYtNE0zNi44IDY2LjVoNk00Ny4yIDY2LjVoNk0zNi44IDIzLjVoNk00Ny4yIDIzLjVoNE01MS40IDIzLjZsMy41IDMuNU01Ny45IDMwLjFsMy41IDMuNU01MS4yIDIzLjh2M001OC41IDMzLjhoM001MS4yIDMwLjJ2My42aDMuNiIvPjwvZz48L2c+PC9zdmc+'} className="h-20 w-20 rounded-full" />
                    <h4>@{user?.preferred_username}</h4>
                    <p className="text-center mt-5">This is the Roblox account that will be used to verify you. Make sure it's the right one as this is not changeable.</p>
                </MSuspense>
                </div>

                <div className="absolute bottom-0 m-5 space-x-5">
                    { loaded && <>
                        <Button disabled={isLoading} variant={'ghost'} onClick={() => redirect('/verification')}>Finish</Button>
                        <Button disabled={isLoading} onClick={() => redirect('/verification/stage3?state='+btoa(localStorage.getItem('oauth-state')!))}>
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