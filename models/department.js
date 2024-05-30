import excuteQuery from "@/lib/db.js";
import fs from "fs";
import util from "util";

const Department = {
  async department_register(departmentName, headOfficer, departmentLandline, location, university, description, email) {
    try {
      // Execute the INSERT query to register the department with all provided details
      await excuteQuery({
        query: `
          INSERT INTO department (department_name, headOfficer, departmentLandline, location, university, description, email)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        values: [departmentName, headOfficer, departmentLandline, location, university, description, email],
      });

      return true; // Return true if the department registration is successful
    } catch (error) {
      console.error("Error:", error);
      return false; // Return false if there's an error during department registration
    }
  }, 
  
  async getAllDepartments() {
    try {
      const result = await excuteQuery({
        query: "SELECT * FROM department",
      });

      if (result && result.length > 0) {
        return result; // Return all departments if found
      } else {
        return []; // Return an empty array if no departments found
      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("An error occurred while querying the database.");
    }
  },

  async getDepartmentIdByName(department) {
    try {
      const result = await excuteQuery({
        query: "SELECT id FROM department WHERE department_name = ?",
        values: [department],
      });

      if (result && result.length > 0) {
        return result[0].id;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("An error occurred while querying the database.");
    }
  },

  async findById(id) {
    try {
      const result = await excuteQuery({
        query: "SELECT department_name FROM department WHERE id = ?",
        values: [id],
      });

      if (result && result.length > 0) {
        return result[0]; // Return department details if found
      } else {
        return null; // Return null if department not found
      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("An error occurred while querying the database.");
    }
  },

  async updateDepartmentDetails(
    id,
    headOfficer,
    departmentLandline,
    location,
    university,
    departmentDescription
  ) {
    try {
      // Execute the UPDATE query to update department details
      const result = await excuteQuery({
        query: `
                UPDATE department
                SET headOfficer = ?, departmentLandline = ?, location = ?, university = ?, description = ?
                WHERE id = ?
            `,
        values: [
          headOfficer,
          departmentLandline,
          location,
          university,
          departmentDescription,
          id,
        ],
      });

      if (result.affectedRows > 0) {
        // Department details successfully updated
        return true;
      } else {
        // No department found with the given ID
        return false;
      }
    } catch (error) {
      console.error("Error updating department details:", error);
      throw new Error("An error occurred while updating department details.");
    }
  },

  async getDepartmentDetailsById(id) {
    try {
      const result = await excuteQuery({
        query: `
                SELECT *
                FROM department
                WHERE id = ?
            `,
        values: [id],
      });

      if (result && result.length > 0) {
        return result[0]; // Return department details if found
      } else {
        return null; // Return null if department not found
      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("An error occurred while querying the database.");
    }
  },
  
  //Checks if the image exists
  async imageExists(department_id) {
    try {
      const result = await excuteQuery({
        query: "SELECT 1 FROM department_images WHERE department_id = ?",
        values: [department_id],
      });

      return result.length > 0;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  },

  //Inserts the image
  async insertDepartmentImage(department_id, imageData, imageFormat) {
    try {
      await excuteQuery({
        query:
          "INSERT INTO department_images (department_id, image, image_format) VALUES (?, ?, ?)",
        values: [department_id, imageData, imageFormat],
      });
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  },

  //Update the image
  async updateDepartmentImage(department_id, imageData, imageFormat) {
    try {
      await excuteQuery({
        query:
          "UPDATE department_images SET image = ?, image_format = ? WHERE department_id = ?",
        values: [imageData, imageFormat, department_id],
      });
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  },

  async getDepartmentImage(department_id) {
    try {
      const result = await excuteQuery({
        query:
          "SELECT image, image_format FROM department_images WHERE department_id = ?",
        values: [department_id],
      });

      if (result && result.length > 0) {
        return {
          imageData: result[0].image, // Return the image data
          imageFormat: result[0].image_format, // Return the image format
        };
      } else {
        return null; // Return null if no image found for the department
      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("An error occurred while querying the database.");
    }
  },
};

module.exports = Department;
