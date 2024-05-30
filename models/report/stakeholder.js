import excuteQuery from "/lib/db.js";

const StakeholderReport = {
  async getStakeholderReportsByDeptID(department_id) {
    try {
      return await excuteQuery({
        query: "SELECT * FROM stakeholder_report WHERE department_id = ?",
        values: [department_id],
      });
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  },
  async postStakeholderReport(
    title,
    formattedDate,
    description,
    objectives,
    department_id
  ) {
    try {
      await excuteQuery({
        query:
          "INSERT INTO stakeholder_report (department_id, title, dateCreated, description, objectives) VALUES (?, ?, ?, ?, ?)",
        values: [
          department_id,
          title,
          formattedDate,
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
  async putStakeholderReport(
    id,
    title,
    objectives,
    description,
    department_id
  ) {
    try {
      await excuteQuery({
        query:
          "UPDATE stakeholder_report SET title = ?, objectives = ?, description = ?, department_id = ? WHERE id = ?",
        values: [
          title,
          JSON.stringify(objectives),
          description,
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

  async deleteStakeholderReport(id) {
    try {
      await excuteQuery({
        query: "DELETE FROM stakeholder_report WHERE id = ?",
        values: [id],
      });
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  },
};

export default StakeholderReport;
