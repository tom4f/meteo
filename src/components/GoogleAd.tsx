import { useEffect, useState, useRef } from 'react'

declare global {
    interface Window {
        adsbygoogle:any;
    }
}

export const GoogleAd = () => {

    const [showAds, setShowAds] = useState(false)
    const renderCount = useRef(0)

    useEffect( () => {
        setShowAds(true)
        showAds && (window.adsbygoogle = window.adsbygoogle || []).push({})
        console.log('push' )
    }, [showAds] );



    return (
        <>
            { console.log(++renderCount.current) }
            { console.log(showAds) }
            { showAds && <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-6892058759603615"
                data-ad-slot="6550229081"
                data-ad-format="auto"
                data-full-width-responsive="true">
            </ins>
            }
        </>
    )
}