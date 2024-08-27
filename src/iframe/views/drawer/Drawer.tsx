import React, { useEffect, useState } from "react"
import { Box, Drawer } from "@mui/material"
import Header from "../../components/header/Header";
import AutofillSection from "../../components/AutofillSection";
import AutofillStart from "../../components/AutofillStart";


const FrameDrawer = () => {

    const [isAutofillActive, setIsAutofillActive] = useState<boolean>(false);


    const handleAutofillClick = () => {
        setIsAutofillActive(true);
    };

    return <Drawer anchor="right" open={true}>
        <Box sx={{ width: 450 }} role="presentation">
            <Header />
            {isAutofillActive ? (
                <AutofillSection />
            ) : (
                <AutofillStart onAutofillClick={handleAutofillClick} />
            )}
        </Box>
    </Drawer>
}

export default FrameDrawer