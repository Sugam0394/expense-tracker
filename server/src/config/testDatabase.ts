import pool from "./database.js";

const testDatabaseConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();

    console.log("✅ MySQL database connected successfully");

    connection.release();
  } catch (error) {
    console.error("❌ MySQL database connection failed:", error);
    process.exit(1);
  }
};

export default testDatabaseConnection;