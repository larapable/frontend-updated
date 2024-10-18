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
            borderColor: "#AB3510",
            color: "#AB3510",
            fontWeight: "medium",
            fontSize: "1rem",
            padding: "0.5rem 1.5rem",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#AB3510",
              color: "white",
              borderColor: "#AB3510",
              transform: "scale(1.05)",
              borderWidth: "2px",
            },
          }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
        </Button>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(to left, #8a252c, #AB3510)",
            color: "#ffffff",
            fontWeight: "medium",
            fontSize: "1rem",
            padding: "0.5rem 1.5rem",
            transition: "all 0.3s ease",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              background: "linear-gradient(to right, #AB3510, #8a252c)",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
              transform: "scale(1.05)",
            },
          }}
        >
          <Link href="/contact" style={{ textDecoration: "none", color: "inherit" }}>
            Contact
          </Link>
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
          alignItems: "center",
          padding: "2rem",
          position: "relative",
          animation: "floatingBackground 10s ease-in-out infinite",
          "@keyframes floatingBackground": {
            "0%": { backgroundPosition: "center top" },
            "50%": { backgroundPosition: "center bottom" },
            "100%": { backgroundPosition: "center top" },
          },
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
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                },
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
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
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
