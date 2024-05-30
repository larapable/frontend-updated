import excuteQuery from "/lib/db.js";

const FinancialReport = {
  async getAllFinancialReports() {
    try {
      const result = await excuteQuery({
        query: "SELECT * FROM financial_report",
      });
      return result;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  },
  async getAllFinancialReportsByDepartment(department_id) {
    try {
      const result = await excuteQuery({
        query: "SELECT * FROM financial_report WHERE department_id = ?",
        values: [department_id],
      });
      return result;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  },
  async postFinancialReport(
    title,
    dateCreated,
    description,
    objectives, // Now an array of objectives
    department_id
  ) {
    try {
      await excuteQuery({
        query:
          "INSERT INTO financial_report (department_id, title, dateCreated, description, objectives) VALUES (?, ?, ?, ?, ?)",
        values: [
          department_id,
          title,
          dateCreated,
          description,
          JSON.stringify(objectives),
        ],
        // Convert objectives array to a JSON string before inserting
      });
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  },

  async putFinancialReport(id, title, description, objectives, department_id) {
    try {
      await excuteQuery({
        query:
          "UPDATE financial_report SET title = ?, description = ?, objectives = ?, department_id = ? WHERE id = ?",
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

  async deleteFinancialReport(id) {
    try {
      await excuteQuery({
        query: "DELETE FROM financial_report WHERE id = ?",
        values: [id],
      });
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  },
};

export default FinancialReport;
