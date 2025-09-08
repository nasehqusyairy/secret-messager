import mysql, { type RowDataPacket } from 'mysql2/promise';
import type { Message } from '~/models/message';
// create the connection to database
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'secret_messager',
});

export async function fetchMessages() {
    // execute will internally call prepare and query
    return (await connection.execute<RowDataPacket[]>('SELECT * FROM `messages` ORDER BY `created_at`'))[0] as Message[];
}

export async function postMessage(sender: string, msg: string) {
    const message = msg.replace('\n', '\n\n');
    const [result] = await connection.execute<mysql.ResultSetHeader>('INSERT INTO `messages` (sender, msg) VALUES (?, ?)', [sender, message]);
    return result.insertId;
}