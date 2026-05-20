import { DatabaseSync } from 'node:sqlite';
import { appendFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dbPath = path.join(os.homedir(), '.local', 'share', 'kilo', 'kilo.db');
const logFilePath = path.join(import.meta.dirname, '(YOUR_NAME)_prompts.md');


console.log("=========================================");
console.log("   🚀 KILO CLI REAL-TIME PROMPT MONITOR  ");
console.log("=========================================");
console.log(`Watching Kilo DB: ${dbPath}`);
console.log(`Appending to Log: ${logFilePath}`);

let lastSeenTimestamp = Date.now();

// Query to find the latest user prompt timestamp on startup
function getLatestTimestamp() {
  try {
    const db = new DatabaseSync(dbPath, { readOnly: true });
    const row = db.prepare(`
      SELECT p.time_created 
      FROM part p
      JOIN message m ON p.message_id = m.id
      WHERE json_extract(m.data, '$.role') = 'user'
        AND json_extract(p.data, '$.type') = 'text'
      ORDER BY p.time_created DESC LIMIT 1
    `).get();
    db.close();
    return row ? row.time_created : Date.now();
  } catch (e) {
    // If table/json queries fail on open, return current time as safety
    return Date.now();
  }
}

lastSeenTimestamp = getLatestTimestamp();
console.log(`Initial tracking checkpoint set at: ${new Date(lastSeenTimestamp).toLocaleTimeString()}`);
console.log("Listening for new inputs in Kilo CLI...\n");

// Check the database for any new prompts
function checkNewPrompts() {
  let db;
  try {
    // Open in read-only mode to prevent locking conflicts with Kilo CLI
    db = new DatabaseSync(dbPath, { readOnly: true });
    
    const newPrompts = db.prepare(`
      SELECT p.time_created, p.data as part_data, s.title as session_title
      FROM part p
      JOIN message m ON p.message_id = m.id
      JOIN session s ON m.session_id = s.id
      WHERE p.time_created > ?
        AND json_extract(m.data, '$.role') = 'user'
        AND json_extract(p.data, '$.type') = 'text'
      ORDER BY p.time_created ASC
    `).all(lastSeenTimestamp);

    for (const prompt of newPrompts) {
      const part = JSON.parse(prompt.part_data);
      const promptText = part.text.trim();
      
      if (promptText && promptText.length > 1) {
        lastSeenTimestamp = prompt.time_created;
        const timeStr = new Date(prompt.time_created).toISOString().replace('T', ' ').substring(0, 19);
        const sessionName = prompt.session_title || 'Active Session';
        
        console.log(`[${timeStr}] Detected prompt in Kilo CLI session "${sessionName}":`);
        console.log(`> ${promptText.substring(0, 100)}${promptText.length > 100 ? '...' : ''}\n`);
        
        // Append to (YOUR_NAME)_prompts.md file
        const logContent = `\n* **${timeStr}** *(Auto-tracked from Kilo CLI: ${sessionName})*\n` +
                           promptText.split('\n').map(line => `  > ${line}`).join('\n') + `\n`;
        
        appendFileSync(logFilePath, logContent, 'utf-8');
      }
    }
  } catch (e) {
    // Gracefully handle busy database locks
    if (!e.message.includes('busy')) {
      console.error("Monitor Error:", e.message);
    }
  } finally {
    if (db) {
      try { db.close(); } catch (err) {}
    }
  }
}

// Poll every 2 seconds
setInterval(checkNewPrompts, 2000);
