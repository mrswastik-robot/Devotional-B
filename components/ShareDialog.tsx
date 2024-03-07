import React, {useState} from 'react'
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
  import { Button } from "@/components/ui/button"
  import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"
  import { FaLink } from "react-icons/fa6";
  import { FaWhatsapp } from "react-icons/fa";
  import { FaInstagram } from "react-icons/fa";
  import { FaFacebook } from "react-icons/fa";
  import { FaXTwitter } from "react-icons/fa6";

function ShareDialog({postLink}) {
    const [isCopied, setIsCopied] = useState(false);
    const frontendURL = process.env.NEXT_FRONTEND_URL || "https://devotional-b.vercel.app";
    const link = `${frontendURL}${postLink}`;
    console.log(process.env);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000); // Reset copied state after 3 seconds
    };

    const shareViaWhatsapp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(link)}`, '_blank');
    };

    const shareViaFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
    };

    const shareViaTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`, '_blank');
    };

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <div>Share</div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='mb-2'>Share Question Via:-</AlertDialogTitle>
                        <AlertDialogDescription>
                            <ToggleGroup type="multiple">
                                <ToggleGroupItem value="bold" className='flex gap-1' onClick={copyToClipboard}>
                                    <div><FaLink /></div><div>{isCopied?<div style={{ marginLeft: '5px', color: 'green' }}>Copied!</div>:<div>Copy Link</div>}</div>
                                </ToggleGroupItem>
                                <ToggleGroupItem value="italic" className='flex gap-1' onClick={shareViaWhatsapp}>
                                    <div><FaWhatsapp /></div><div>Whatsapp</div>
                                </ToggleGroupItem>
                                <ToggleGroupItem value="strikethrough" className='flex gap-1' onClick={shareViaFacebook}>
                                    <div><FaFacebook /></div><div>Facebook</div>
                                </ToggleGroupItem>
                                <ToggleGroupItem value="strikethrough" className='flex gap-1' onClick={shareViaTwitter}>
                                    <div><FaXTwitter /></div><div>Twitter</div>
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ShareDialog