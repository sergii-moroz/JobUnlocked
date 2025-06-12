import { db } from "../connections.js";

export async function up() {
	return new Promise<void>((resolve, reject) => {
		db.run(`
			--trigger will automatically set updated_at to the current time whenever the row is updated
			CREATE TRIGGER IF NOT EXISTS trg_update_applicaitonpost_updated_at
			AFTER UPDATE ON applicationPosts
			FOR EACH ROW
			BEGIN
				UPDATE applicationPosts
				SET updated_at = CURRENT_TIMESTAMP
				WHERE id = OLD.id;
			END;
		`, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}
