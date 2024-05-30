import excuteQuery from "/lib/db.js";

const InternalProcessReport = {
  async getAllIPReports() {
    try {
      const result = await excuteQuery({
        query: "SELECT * FROM internal_report",
      });
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  },
  async getAllIPReportsByDeptId(department_id) {
    try {
      const result = await excuteQuery({
        query: "SELECT * FROM internal_report WHERE department_id = ?",
        values: [department_id],
      });
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  },
  async postIPReport(
    title,
    dateCreated,
    description,
    objectives,
    department_id
  ) {
    try {
      await excuteQuery({
        query:
          "INSERT INTO internal_report (department_id, title, dateCreated, description, objectives) VALUES (?, ?, ?, ?, ?)",
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

  async putIPReport(id, title, description, objectives, department_id) {
    try {
      await excuteQuery({
        query:
          "UPDATE internal_report SET title = ?, description = ?, objectives = ?, department_id = ? WHERE id = ?",
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

  async deleteIPReport(id) {
    try {
      await excuteQuery({
        query: "DELETE FROM internal_report WHERE id = ?",
        values: [id],
      });
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  },
};

export default InternalProcessReport;
