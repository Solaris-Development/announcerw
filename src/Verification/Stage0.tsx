import { Button } from "@/Components/ui/button";
import { Loader2 } from "lucide-react";
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
        document.location.href = `https://discord.com/api/oauth2/authorize?client_id=1172662931121504276&redirect_uri=${import.meta.env.VITE_URL+'verification/stage1'}&response_type=token&scope=identify&state=`+btoa(randomString);
    }

    return (
        <div className="h-full flex items-center justify-center">
            <div className="min-w-[28rem] w-[28rem] h-[30%] border border-border bg-background rounded-lg p-5 flex items-center flex-col relative">
                <h2>Solaris Verification Process</h2>
                <p className="text-muted-foreground">Welcome to the verification process.</p>
                <p className="w-96 text-center mt-5">We need you to connect your Roblox and Discord account to continue.</p>
                <Button className="absolute bottom-0 m-5 " onClick={() => getstarted()} disabled={isLoading}>
                    { isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> } 
                    Get Started
                </Button>
            </div>
        </div>
    )
}