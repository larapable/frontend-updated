import excuteQuery from "/lib/db.js";

const LearningGrowthReport = {
  async getAllLGReports() {
    try {
      const result = await excuteQuery({
        query: "SELECT * FROM learning_report",
      });
      return result;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  },

  async getAllLGReportsbyDeptID(department_id) {
    try {
      const result = await excuteQuery({
        query: "SELECT * FROM learning_report WHERE department_id = ?",
        values: [department_id],
      });
      return result;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  },

  async postLGReport(
    title,
    dateCreated,
    description,
    objectives,
    department_id
  ) {
    try {
      await excuteQuery({
        query:
          "INSERT INTO learning_report (department_id, title, dateCreated, description, objectives) VALUES (?, ?, ?, ?, ?)",
        values: [
          department_id,
          title,
          dateCreated,
          description,
          JSON.stringify(objectives),
        ],
      });
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  },

  async putLearningReport(id, title, description, objectives, department_id) {
    try {
      await excuteQuery({
        query:
          "UPDATE learning_report SET title = ?, description = ?, objectives = ?, department_id = ? WHERE id = ?",
        values: [
          title,
          description,
          JSON.stringify(objectives),
          department_id,
          id,
        ],
      });
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  },

  async deleteLGReport(id) {
    try {
      await excuteQuery({
        query: "DELETE FROM learning_report WHERE id = ?",
        values: [id],
      });
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  },
};

export default LearningGrowthReport;
