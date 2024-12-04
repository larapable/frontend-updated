import { useRef, useEffect } from 'react';
import '@/app/page.css'
import { Box, Typography, Grid, SvgIcon } from '@mui/material';
import React from 'react';

const Benefits = () => {


    return (
        <Box
            sx={{
                backgroundColor: '#fafac2',
                height: '100vh',
                width: '100%',
                textAlign: 'center',
                color: '#302E2E',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', 
            }}
            id="benefit-section"
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h3" sx={{fontWeight: 'bold', color: '#302E2E', fontSize: { lg: '2rem', sm: '2rem', md: '2rem', xs: '1.5rem' } }}>
                    Benefits of Choosing Atlas
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, fontSize: { lg: '1.3rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
                    Explore the advantages of using Atlas for your strategic planning needs.
                    <br /> Benefit from intuitive AI-powered tools.
                </Typography>
            </Box>

            <Grid container justifyContent="center" alignItems="center" spacing={5} sx={{ mt: -6 }}>
                <Grid item sx={{ display: { xs: 'none', sm: 'none', lg:'flex', md:'flex' }}}>
                    <img src="/advantages.png" alt="" style={{ height: '20rem', marginTop: '20px' }} />
                </Grid>
                <Grid item>
                    <Box display="flex" flexDirection="column" justifyContent="center" gap={3} sx={{mt:'3rem'}}>
                        {[
                            'Streamline strategic planning with intuitive AI-driven features.',
                            'Gain a competitive edge through comprehensive SWOT analysis.',
                            'Precisely map strategies to key business perspectives.',
                            'Leverage AI-driven insights for innovative strategy development.',
                            'Track progress and performance metrics seamlessly.',
                            'Enhance transparency and accountability across projects.',
                        ].map((text, index) => (
                            <Box key={index} display="flex" alignItems="center" color="#d14330" gap={2}>
                                <SvgIcon viewBox="0 0 24 24" fill="currentColor" sx={{ fontSize: '35px' }}>
                                    <path
                                        fillRule="evenodd"
                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                        clipRule="evenodd"
                                    />
                                </SvgIcon>
                                <Typography sx={{color: '#302E2E', fontSize: { lg: '1.3rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
                                    {text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Benefits