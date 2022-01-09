import { Component } from 'react'

declare global {
    interface Window {
        adsbygoogle:any;
    }
}

export default class GoogleAd extends Component {

    componentDidMount () {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
    }

    render () {
        return (
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-6892058759603615"
                data-ad-slot="6550229081"
                data-ad-format="auto"
                data-full-width-responsive="true">
            </ins>
        )
    }
}