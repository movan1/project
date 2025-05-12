import cron from "node-cron";

import { pool } from "../config";
import { Statuses } from "../types";

export const startSchedules = () => {
  cron.schedule('*/1 * * * * *', () => {
    pool.query(`
      UPDATE orders
      SET status=?
      WHERE DATE_ADD(
        STR_TO_DATE(SUBSTRING(created_at, 1, 19), '%Y-%m-%dT%H:%i:%s'),
        INTERVAL 1 MINUTE
      ) < UTC_TIMESTAMP() AND status=? AND id IS NOT NULL;
    `, [Statuses.Canceled, Statuses.Created]);
  })
}
