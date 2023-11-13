import { Button } from "@/Components/ui/button";
import { getDiscordOAuth } from "@/Lib/Utils";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

function generateRandomString() {
	let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}

export default function Stage0() {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.removeItem('tk_discord')
        localStorage.removeItem('tk_robloxa')
        localStorage.removeItem('tk_robloxr')
        localStorage.removeItem('oauth-state')
    }, [])

    function getstarted() {
        setLoading(true)
        const randomString = generateRandomString();
		localStorage.setItem('oauth-state', randomString);
        document.location.href = getDiscordOAuth(btoa(randomString));
    }

    return (
        <div className="h-full flex items-center justify-center">
            <div className="min-w-[50rem] w-[50rem] h-[20rem] min-h-[20rem] border border-border bg-background rounded-lg flex items-center flex-col relative">
                <div className="p-2 w-full border-b-border border-b">
                    <h4>Account Link • Welcome</h4>
                </div>
                <div className="p-5 h-full w-full text-center flex justify-center items-center flex-col">
                    <h4>Welcome!</h4>
                    <p>We need you to verify your identity.</p>
                    <p>Let's get started.</p>
                </div>
                <div className="w-full relative h-36">
                    <div className="absolute right-0 bottom-0">
                        <Button className="m-5" onClick={() => getstarted()} disabled={isLoading}>
                            Get Started
                            { isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <ArrowRight className="ml-2 h-4 w-4" /> } 
                        </Button>
                    </div>
                </div>  
            </div>
        </div>
    )
}