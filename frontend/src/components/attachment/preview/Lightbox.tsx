import { PropsWithChildren } from 'react'

import '../../../styles/lightbox.css'


export interface LightboxProps extends PropsWithChildren {
    onClose: () => void
}


export default function Lightbox({ children, onClose }: LightboxProps) {
    const handleLightboxClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        onClose()
    }

    return (
        <div className='lightbox'>
            <div className='lightbox-overlay' onClick={handleLightboxClick}></div>
            {children}
        </div>
    )
}