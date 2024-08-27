import React, { CSSProperties, useEffect, useState } from 'react';
import extLogo from '../../assets/images/extLogo.png';
import Fab from '@mui/material/Fab';

const FloatingWidget = ({ toggleDrawer }: { toggleDrawer: any }) => {

    const [isDragging, setIsDragging] = useState(false);
    const [currentYPosition, setCurrentYPosition] = useState(20); // Initial Y position set to 20px from bottom as per CSS

    useEffect(() => {
        const moveWidget = (event: any) => {
            if (isDragging) {
                let newYPosition = event.clientY;

                // Prevent widget from moving outside of the viewport
                const widgetHeight = document.querySelector('.floating-widget')!.clientHeight;
                const screenHeight = window.innerHeight;

                // Adjust newYPosition based on widget height and screen height
                newYPosition = Math.max(0, newYPosition); // Prevent it from going above the screen
                newYPosition = Math.min(screenHeight - widgetHeight, newYPosition); // Prevent it from going below the screen

                setCurrentYPosition(newYPosition);
            }
        };

        const stopDragging = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', moveWidget);
            window.addEventListener('mouseup', stopDragging);
        }

        return () => {
            window.removeEventListener('mousemove', moveWidget);
            window.removeEventListener('mouseup', stopDragging);
        };
    }, [isDragging]);

    const getWidgetStyles = (): CSSProperties =>
        ({ position: 'absolute', top: `${currentYPosition}px`, cursor: isDragging ? 'grabbing' : 'grab', right: '20px', padding: '10px', borderRadius: '8px' })

    return (
        <div
            className="floating-widget"
            style={getWidgetStyles()}
            onMouseDown={() => setIsDragging(true)}
        >
            <Fab className='widgetBtn'
                onClick={toggleDrawer(true)}
                aria-label="add">
                <img src={extLogo} />
            </Fab>
        </div>
    );
};

export default FloatingWidget;