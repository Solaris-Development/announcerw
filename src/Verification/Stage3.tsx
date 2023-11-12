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
import { Link, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiGet } from "@/Lib/ApiGet";

export default function Stage3() {
    const [loaded, setLoaded] = useState(false);
    const [err, setErr] = useState({shown: false, title: '', message: ''});
    const [userd, setUserd] = useState<any>();
    const [userr, setUserr] = useState<any>();
    const redirect = useNavigate()

    useEffect(() => {
        (async () => {
            const fragment = new URLSearchParams(window.location.search.slice(1));
            const state = fragment.get('state')
            
            if (!state)
                return redirect('/verification')

            if (atob(decodeURIComponent(state)) !== localStorage.getItem('oauth-state'))
                return redirect('/verification')

            if (!localStorage.getItem('tk_discord') || !localStorage.getItem('tk_robloxr'))
                return redirect('/verification')
            console.log(
                localStorage.getItem('tk_robloxr'),
                localStorage.getItem('tk_discord')
            )

            const url = import.meta.env.VITE_APIURL+"verification/finish?rbx="+localStorage.getItem('tk_robloxr')+"?dsc="+localStorage.getItem('tk_discord')
            const f0 = await ApiGet(url)
            if (!f0.ok) {
                if (f0.status !== 400)
                    return setErr({ shown: true, title: 'Something went wrong', message: 'An error occured and we were not able to verify you. Try again later.' });
                const f = JSON.parse(f0.body)
                if (!f.id)
                    return setErr({ shown: true, title: 'Something went wrong', message: 'An error occured and we were not able to verify you. Try again later.\nError code: '+f.message });
                switch (f.id) {
                    case 'rbxuse':
                        return setErr({ shown: true, title: 'Roblox account error', message: 'The roblox account you are trying to use is taken. Please contact @mezabyte if you think there is a problem.' });
                    case 'dscuse':
                        return setErr({ shown: true, title: 'Discord account error', message: 'The discord account you are trying to use is taken. Please contact @mezabyte if you think there is a problem.' });
                    case 'narg':
                        return redirect('/verification')
                }
            }
            const f = JSON.parse(f0.body)
            setUserr(f.rbx)
            setUserd(f.dsc)
            setLoaded(true)
        })()
    }, [])

    return (
        <div className="h-full flex items-center justify-center">
            <div className="min-w-[28rem] w-[28rem] h-[35%] border border-border bg-background rounded-lg p-5 flex items-center flex-col relative">
                <h2>All done!</h2>
                
                <div className="w-full h-full flex items-center justify-center flex-col">
                <MSuspense fallback={
                    <Loader2 className="mr-2 h-6 w-6 animate-spin rounded-full" />
                } loaded={loaded}>
                    <div className="flex w-[70%]">
                        <div className="w-full">
                            <img className="h-20 w-20 rounded-full m-auto" src={'https://cdn.discordapp.com/avatars/'+userd?.id+'/'+userd?.avatar+'.png?size=512'} />
                            <h4 className="text-center w-full">@{userd?.username}</h4>
                        </div>
                        <div className="w-8 mx-5 flex items-center justify-center">
                            <Link className="w-8 h-8" />
                        </div>
                        <div className="w-full">
                            <img className="h-20 w-20 rounded-full m-auto" src={userr?.picture || 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHdpZHRoPSI5MCIgaGVpZ2h0PSI5MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlPi5zdDJ7ZmlsbDpub25lO3N0cm9rZTojMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPjxnIGlkPSJ1bmFwcHJvdmVkXzFfIj48cGF0aCBpZD0iYmdfMl8iIGZpbGw9IiM2NTY2NjgiIGQ9Ik0wIDBoOTB2OTBIMHoiLz48ZyBpZD0idW5hcHByb3ZlZCIgb3BhY2l0eT0iLjMiPjxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjQ1IiBjeT0iNDguOCIgcj0iMTAiLz48cGF0aCBjbGFzcz0ic3QyIiBkPSJNMzggNDEuN2wxNCAxNC4xTTMyLjUgMjMuNWgtNHY0TTI4LjUgNjIuNXY0aDRNMjguNSAzMS44djZNMjguNSA0MnY2TTI4LjUgNTIuMnY2TTU3LjUgNjYuNWg0di00TTYxLjUgNTguMnYtNk02MS41IDQ4di02TTYxLjUgMzcuOHYtNE0zNi44IDY2LjVoNk00Ny4yIDY2LjVoNk0zNi44IDIzLjVoNk00Ny4yIDIzLjVoNE01MS40IDIzLjZsMy41IDMuNU01Ny45IDMwLjFsMy41IDMuNU01MS4yIDIzLjh2M001OC41IDMzLjhoM001MS4yIDMwLjJ2My42aDMuNiIvPjwvZz48L2c+PC9zdmc+'} />
                            <h4 className="text-center w-full">@{userr?.preferred_username}</h4>
                        </div>
                    </div>
                    
                    <p className="text-center mt-5 text-muted-foreground">You may now close this tab.</p>
                </MSuspense>
                </div>
                
                <AlertDialog open={err.shown}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{err.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {err.message}
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