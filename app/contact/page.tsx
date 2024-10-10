import TeamsPage from '../components/TeamsPage'
import React from 'react'
import Link from 'next/link'
import { Box, Button, Typography } from "@mui/material";

const page = () => {
  return (
    <Box sx={{ color: 'rgb(59,59,59)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '5rem' }}>
      <Typography variant="h2" sx={{ fontWeight: 'bold', marginTop: '2.5rem', fontSize: { lg: '3.5rem', xs: '2.5rem' } }}>
        Contact our team
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1.3rem', marginTop: '1rem' }}>
        We value collaboration and work closely with our clients every step of the way,
        <br />
        ensuring their vision and goals are met with precision and excellence.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: '2.5rem', marginBottom: '3rem' }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: '#AB3510', // Initial border color
            color: '#AB3510', // Text color
            fontWeight: 'medium',
            fontSize: '1rem',
            padding: '0.5rem 1.5rem',
            '&:hover': {
              backgroundColor: '#AB3510', // Background color on hover
              color: 'white', // Text color on hover
              borderColor: '#AB3510', // Border color on hover
            },
          }}
        >
          <Link href="/">Home</Link>
        </Button>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(to left, #8a252c, #AB3510)',
            color: '#ffffff',
            fontWeight: 'medium',
            fontSize: '1rem',
            padding: '0.5rem 1.5rem',
          }}
        >
          <Link href="/team">Team</Link>
        </Button>
      </Box>

      <Box
        sx={{
          backgroundImage: 'url("landingbg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '56vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center', // Change from 'flex-end' to 'center'
          padding: '2rem',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ backgroundColor: 'white', borderRadius: '1rem', p: 2, width: '30rem' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
              Talk to the Team
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                {['Genevieve', 'Lara', 'Arziel', 'Arvin', 'Lyndon'].map((name) => (
                  <Typography key={name} variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>
                    {name}:
                  </Typography>
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                {['+63123456789', '+63123456789', '+63123456789', '+63123456789', '+63123456789'].map((number) => (
                  <Typography key={number} variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>
                    {number}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Browse Team Box */}
          <Box sx={{ backgroundColor: 'white', borderRadius: '1rem', p: 2, width: '30rem' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
              Browse the Team
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                {['Facebook:', 'Instagram:', 'Twitter:', 'MS Teams:', 'Gmail:'].map((social) => (
                  <Typography key={social} variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>{social}</Typography>
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                {['atlas.official', 'atlas.official', 'atlas.official', 'atlas.official', 'atlas.official'].map((account) => (
                  <Typography key={account} variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>{account}</Typography>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Visit Team Box */}
          <Box sx={{ backgroundColor: 'white', borderRadius: '1rem', p: 2, width: '30rem' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
              Visit the Team
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>Address:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>Building:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>Business Hours:</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>Tabok Mandaue</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>North Wing 2nd</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>9:00am - 6:00pm</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Typography variant="body1" sx={{ fontWeight: 'medium', fontStyle: 'italic', fontSize: '1rem', marginTop: '3rem' }}>
        'Your goals, our journey. Together, we achieve.'
      </Typography>
      <Typography variant="body2" sx={{ marginTop: '1rem', color: '#504B4B' }}>
        Copyright. All rights reserved.
      </Typography>
    </Box>
  )
};

export default page