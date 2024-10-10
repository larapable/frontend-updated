import React from "react";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import TeamsPage from "../components/LandingPage/TeamsPage";

const page = () => {
  return (
    <Box
      sx={{
        color: "rgb(59,59,59)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginBottom: "5rem",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          marginTop: "2.5rem",
          fontSize: { lg: "3.5rem", xs: "2.5rem" },
        }}
      >
        Meet our team
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: "medium", fontSize: "1.3rem", marginTop: "1rem" }}
      >
        Our team comprises highly skilled professionals with expertise in their
        respective fields,
        <br />
        ensuring top-notch quality and results for our clients.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          marginTop: "2.5rem",
          marginBottom: "3rem",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            borderColor: "#AB3510", // Initial border color
            color: "#AB3510", // Text color
            fontWeight: "medium",
            fontSize: "1rem",
            padding: "0.5rem 1.5rem",
            "&:hover": {
              backgroundColor: "#AB3510", // Background color on hover
              color: "white", // Text color on hover
              borderColor: "#AB3510", // Border color on hover
            },
          }}
        >
          <Link href="/">Home</Link>
        </Button>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(to left, #8a252c, #AB3510)",
            color: "#ffffff",
            fontWeight: "medium",
            fontSize: "1rem",
            padding: "0.5rem 1.5rem",
          }}
        >
          <Link href="/contact">Contact</Link>
        </Button>
      </Box>

      <Box
        sx={{
          backgroundImage: 'url("landingbg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "56vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center", // Change from 'flex-end' to 'center'
          padding: "2rem",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          {[
            {
              name: "Genevieve Miao",
              role: "Developer / Designer",
              img: "profile-ebeb.png",
            },
            {
              name: "Lara Pable",
              role: "Developer / Designer",
              img: "profile-lara.png",
            },
            {
              name: "Arziel Mae Lawas",
              role: "Developer / Designer",
              img: "profile-arziel.png",
            },
            {
              name: "Arvin Santillan",
              role: "Developer / Designer",
              img: "profile-arvin.png",
            },
            {
              name: "Lyndon Trocio",
              role: "Developer / Designer",
              img: "profile-lyndon.png",
            },
          ].map((member) => (
            <Box
              key={member.name}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={member.img}
                alt={member.name}
                style={{ width: "15rem", height: "17rem", marginTop: "1rem" }}
              />
              <Box
                sx={{
                  backgroundColor: "white",
                  height: "5rem",
                  width: "17rem",
                  borderRadius: "1rem",
                  marginTop: "-1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1rem", fontWeight: "bold" }}
                  >
                    {member.name}
                  </Typography>
                  <Typography variant="body2">{member.role}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Typography
        variant="body1"
        sx={{
          fontWeight: "medium",
          fontStyle: "italic",
          fontSize: "1rem",
          marginTop: "3rem",
        }}
      >
        'Your goals, our journey. Together, we achieve.'
      </Typography>
      <Typography variant="body2" sx={{ marginTop: "1rem", color: "#504B4B" }}>
        Copyright. All rights reserved.
      </Typography>
    </Box>
  );
};

export default page;
