import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

  const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { username, password } = credentials;

        try {
          console.log("Input username:", username);
          console.log("Input password:", password);

          // Admin credentials check
          if (username === "Admin" && password === "A@dmin123") {
            console.log("Admin login");
            return {
              id: 0,
              username: "Admin",
              department: { id: 0 },
              role: "admin",
              head: "admin"
            };
          }

          // Make HTTP request to check if user exists
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            console.log("User not found");
            return null; // User not found or other error
          }

          const user = await response.json();
          console.log("User from API: ", user);

          // Compare plain text password with user input password
          const passwordMatch = await bcrypt.compare(password, user.password);
          console.log("Password match:", passwordMatch);

          if (!passwordMatch) {
            console.log("Password does not match");
            return null; // Passwords don't match
          }

          // Check if the user role is 'qualityAssurance' and set department to null
          if (user.role === "qualityAssurance") {
            user.department = null; // Set department to null
          }

          console.log("Return user: ", user);
          return user; // Return the user if authentication succeeds
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, session, trigger }) {
      console.log("jwt callback", { token, user, session });
     
     if (user) {
      token.id = user.id;
      token.username = user.username;
      token.department_id = user.department ? user.department.id : null; // Handle null department
      token.role = user.role;
      token.head = user.head;
      }
      
      if (trigger === "update" && session.user.department_id) {
        token.department_id = session.user.department_id; 
      }

    return token;
  },
    async session({ session, token, user }) {
      console.log("session callback", { session, token, user });

      session.user.id = token.id;
      session.user.name = JSON.stringify(token);
      session.user.department_id = token.department_id; // Set department_id from token
      session.user.role = token.role; // Add role to session
      session.user.head = token.head;

      // session.user.id = token.id;
      // session.user.name = JSON.stringify(token);
      //  return {
      //     ...session,
      //     user: {
      //         ...session.user,
      //         id: token.id,
      //         name: token.username,
      //         department: token.department,
      //     }

      //  };

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
