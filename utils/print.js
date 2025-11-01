export const printToKitchen = (order) => {
    console.log("🧾 Printing order to kitchen...");
    console.log(`โต๊ะที่: ${order.tableNumber}`);
    order.items.forEach(i => {
        console.log(` - เมนู ID: ${i.menuId} จำนวน: ${i.quantity}`);
    });
    console.log("📠 ส่งเข้าครัวเรียบร้อย!");
    // TODO: ภายหลังสามารถเชื่อมต่อเครื่องพิมพ์จริงผ่าน Network/USB
};
