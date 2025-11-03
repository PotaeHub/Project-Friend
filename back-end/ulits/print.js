// printer/posPrinter.js
import { exec } from "child_process";

// ตัวอย่างง่าย ๆ ใช้คำสั่ง print ของ Windows
export const printOrder = async (order) => {
    const content = `
  ===== Order #${order.id} =====
  Table: ${order.tableNumber}
  --------------------------
  ${order.items.map(i => `${i.menu.name} x${i.qty} = ${i.menu.price * i.qty}฿`).join("\n")}
  --------------------------
  Total: ${order.items.reduce((sum, i) => sum + i.menu.price * i.qty, 0)}฿
  ==========================
  `;

    // ใช้ command-line print (ปรับตาม OS/Printer)
    exec(`echo "${content}" > LPT1`, (err) => {
        if (err) console.error("Print error:", err);
        else console.log("Order printed!");
    });
};
