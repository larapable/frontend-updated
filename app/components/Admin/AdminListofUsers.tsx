import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface UserEntity {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  age: number;
  birthdate: Date;
  //generatedAiStrats: number;
  // Add other fields if they exist in your UserEntity class
}

const drawerWidth = 50;

const AdminListOfUser: React.FC = () => {
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fetch the list of users from the backend
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://3.107.42.174:8080/user/getAllUsers");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: UserEntity[] = await response.json();
        setUsers(data);
        setFilteredUsers(data);

        // Fetch the user count
        const countResponse = await fetch(
          "http://3.107.42.174:8080/user/userCount"
        );
        if (!countResponse.ok) {
          throw new Error("Failed to fetch user count");
        }
        const countData = await countResponse.json();
        setUserCount(countData.userCount);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on the search term
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl">Error: {error}</div>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        flexGrow: 1,
        ml: isMobile ? 0 : `${drawerWidth}px`,
        width: `calc(100% - ${drawerWidth}px)`,
        padding: 0,
        marginTop: "2rem",
      }}
    >
      <Box
        sx={{
          padding: 2,
          maxWidth: "1500px",
          width: "100%",
          color: "rgb(59,59,59)",
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
        >
          List of Users
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            Total Users: {userCount}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ width: "100%", maxWidth: "500px" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {filteredUsers.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                mb: 6,
                width: "100%",
                maxWidth: "1200px",
                maxHeight: "65vh",
                overflowY: "auto",
              }}
            >
              <Table className="w-full border-collapse border border-gray-400">
                <TableHead>
                  <TableRow className="bg-[#b83216]">
                    {[
                      "ID",
                      "Username",
                      "Email",
                      "Firstname",
                      "Lastname",
                      "Role",
                      "Age",
                      "Birthdate",
                      //"Generated AI Strats",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        className="border border-gray-400 font-bold"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: "1.125rem",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className={index % 2 === 0 ? "bg-[#fff6d1]" : "bg-white"}
                    >
                      <TableCell
                        className="border border-gray-400"
                        sx={{ fontSize: "1rem", textAlign: "center" }}
                      >
                        {user.id}
                      </TableCell>
                      <TableCell
                        className="border border-gray-400"
                        sx={{ fontSize: "1rem", textAlign: "center" }}
                      >
                        {user.username}
                      </TableCell>
                      <TableCell
                        className="border border-gray-400"
                        sx={{ fontSize: "1rem", textAlign: "center" }}
                      >
                        {user.email}
                      </TableCell>
                      <TableCell
                        className="border border-gray-400"
                        sx={{ fontSize: "1rem", textAlign: "center" }}
                      >
                        {user.firstname}
                      </TableCell>
                      <TableCell
                        className="border border-gray-400"
                        sx={{ fontSize: "1rem", textAlign: "center" }}
                      >
                        {user.lastname}
                      </TableCell>
                      <TableCell
                        className="border border-gray-400"
                        sx={{ fontSize: "1rem", textAlign: "center" }}
                      >
                        {user.role}
                      </TableCell>
                      <TableCell
                        className="border border-gray-400"
                        sx={{ fontSize: "1rem", textAlign: "center" }}
                      >
                        {user.age}
                      </TableCell>
                      <TableCell
                        className="border border-gray-400"
                        sx={{ fontSize: "1rem", textAlign: "center" }}
                      >
                        {user.birthdate
                          ? new Date(user.birthdate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      {/* <TableCell
                        className="border border-gray-400 max-w-xs break-words"
                        sx={{ fontSize: "1rem", textAlign: "center" }}
                      >
                        {user.generatedAiStrats}
                      </TableCell>*/}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", color: "gray", fontSize: "1.25rem" }}
            >
              No users found.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminListOfUser;
